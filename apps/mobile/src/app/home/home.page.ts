/* Pagina principal del residente: muestra estadisticas y lista de visitas en
   tiempo real. Al recibir una notificacion nueva, envia un mensaje a Telegram
   si el residente tiene vinculado su chat ID */

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore, collection, query, where, orderBy,
  getDocs, doc, getDoc, updateDoc, onSnapshot, Unsubscribe
} from '@angular/fire/firestore';
import { AuthService, UsuarioSession } from '../services/auth.service';
import { TelegramService } from '../services/telegram.service';
import { ThemeService } from '../services/theme.service';

interface Visita {
  id: string;
  estado: string;
  mensaje: string;
  tiempo: string;
  tipo: 'en_espera' | 'atendida' | 'rechazada';
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  usuario: UsuarioSession | null = null;
  unidad: string = '';
  visitasHoy: number = 0;
  enEspera: number = 0;
  visitasRecientes: Visita[] = [];
  loading: boolean = true;
  darkModeEnabled: boolean = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private telegramService = inject(TelegramService);
  private themeService = inject(ThemeService);
  private unsubscribeNotif: Unsubscribe | null = null;

  async ngOnInit() {
    this.darkModeEnabled = this.themeService.isDarkMode();

    this.usuario = this.authService.getCurrentUser();
    if (!this.usuario) return;

    try {
      await this.cargarDepartamento();
      this.escucharNotificaciones();
    } catch (e) {
      console.error('Error cargando datos del home:', e);
      this.loading = false;
    }
  }

  ionViewWillEnter() {
    this.darkModeEnabled = this.themeService.isDarkMode();
  }

  /* Escucha en tiempo real los cambios en la coleccion notificaciones del usuario */
  private escucharNotificaciones() {
    if (!this.usuario) return;

    const q = query(
      collection(this.firestore, 'notificaciones'),
      where('residenteUid', '==', this.usuario.id),
      orderBy('creadoEn', 'desc')
    );

    this.unsubscribeNotif = onSnapshot(q, async (snapshot) => {
      /* Procesar solo los documentos recien agregados con estado "nueva" */
      for (const change of snapshot.docChanges()) {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data['estado'] === 'nueva') {
            await this.procesarNotificacion(change.doc.id, data);
          }
        }
      }

      /* Actualizar la lista de visitas en la UI */
      this.visitasRecientes = snapshot.docs.map(d => {
        const data = d.data();
        const fecha: Date = data['creadoEn']?.toDate() ?? new Date();
        const estado: string = data['estado'];
        return {
          id: d.id,
          estado: this.getEstadoLabel(estado),
          mensaje: data['visitante']?.nombre
            ? `Visita: ${data['visitante'].nombre}`
            : 'Llegó alguien por vos',
          tiempo: this.formatTiempo(fecha),
          tipo: estado === 'nueva' || estado === 'notificado' ? 'en_espera' : estado === 'ignorada' ? 'rechazada' : 'atendida',
        };
      });

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      this.enEspera = this.visitasRecientes.filter(v => v.tipo === 'en_espera').length;
      this.visitasHoy = snapshot.docs.filter(d => {
        const fecha: Date = d.data()['creadoEn']?.toDate() ?? new Date();
        return fecha >= hoy;
      }).length;

      this.loading = false;
    });
  }

  /* Envia el mensaje a Telegram y actualiza el estado de la notificacion */
  private async procesarNotificacion(docId: string, data: any) {
    if (!this.usuario) return;

    try {
      /* Obtener el telegramChatId del usuario desde Firestore */
      const usuarioRef = doc(this.firestore, 'usuarios', this.usuario.id);
      const usuarioSnap = await getDoc(usuarioRef);

      let chatId = '';
      if (usuarioSnap.exists()) {
        chatId = usuarioSnap.data()['telegramChatId'] || '';
      }

      if (!chatId) {
        console.warn('El residente no tiene vinculado Telegram');
        return;
      }

      const mensaje = `🔔 Tienes visitas`;

      const enviado = await this.telegramService.enviarMensaje(chatId, mensaje);

      /* Marcar como notificado o notificado_error segun el resultado */
      await updateDoc(doc(this.firestore, 'notificaciones', docId), {
        estado: enviado ? 'notificado' : 'notificado_error'
      });
    } catch (e) {
      console.error('Error procesando notificacion:', e);
      await updateDoc(doc(this.firestore, 'notificaciones', docId), {
        estado: 'notificado_error'
      });
    }
  }

  /* Carga la informacion del departamento del residente para mostrar en pantalla */
  private async cargarDepartamento() {
    if (!this.usuario?.departamentoId) {
      this.unidad = this.usuario?.apellido ?? '';
      return;
    }
    const snap = await getDoc(doc(this.firestore, 'departamentos', this.usuario.departamentoId));
    if (snap.exists()) {
      const d = snap.data();
      this.unidad = `Piso ${d['piso']} - Depto ${d['numero']} · ${this.usuario!.apellido}`;
    }
  }

  private async cargarNotificaciones() {
    // Reemplazado por escucharNotificaciones() con onSnapshot
  }

  /* Traduce el estado de Firestore a una etiqueta legible */
  private getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      nueva: 'Visita en puerta',
      notificado: 'Visita en puerta',
      notificado_error: 'Visita en puerta',
      vista: 'Atendida',
      ignorada: 'Rechazada',
    };
    return labels[estado] ?? 'Visita';
  }

  /* Formatea una fecha a texto relativo (ej: "hace 5 min", "ayer 14:30") */
  private formatTiempo(fecha: Date): string {
    const diff = Math.floor((Date.now() - fecha.getTime()) / 1000);
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    const hh = fecha.getHours().toString().padStart(2, '0');
    const mm = fecha.getMinutes().toString().padStart(2, '0');
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    ayer.setHours(0, 0, 0, 0);
    return fecha >= ayer
      ? `ayer ${hh}:${mm}`
      : fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
  }

  /* Acciones del residente sobre las visitas */
  async abrirVisita(visita: Visita) {
    await updateDoc(doc(this.firestore, 'notificaciones', visita.id), { estado: 'vista' });
    visita.tipo = 'atendida';
    visita.estado = 'Atendida';
    this.enEspera = Math.max(0, this.enEspera - 1);
  }

  async rechazarVisita(visita: Visita) {
    await updateDoc(doc(this.firestore, 'notificaciones', visita.id), { estado: 'ignorada' });
    visita.tipo = 'rechazada';
    visita.estado = 'Rechazada';
    this.enEspera = Math.max(0, this.enEspera - 1);
  }

  irAjustes() {
    this.router.navigate(['/ajustes']);
  }

  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    this.themeService.setDarkMode(this.darkModeEnabled);
  }

  ngOnDestroy() {
    if (this.unsubscribeNotif) {
      this.unsubscribeNotif();
    }
  }
}
