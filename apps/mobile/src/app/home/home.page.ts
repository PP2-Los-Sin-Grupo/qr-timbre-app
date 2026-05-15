import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore, collection, query, where, orderBy,
  getDocs, doc, getDoc, updateDoc
} from '@angular/fire/firestore';
import { AuthService, UsuarioSession } from '../services/auth.service';

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
export class HomePage implements OnInit {
  usuario: UsuarioSession | null = null;
  unidad: string = '';
  visitasHoy: number = 0;
  enEspera: number = 0;
  visitasRecientes: Visita[] = [];
  loading: boolean = true;

  private router = inject(Router);
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  async ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    if (!this.usuario) return;

    try {
      await Promise.all([
        this.cargarDepartamento(),
        this.cargarNotificaciones()
      ]);
    } catch (e) {
      console.error('Error cargando datos del home:', e);
    } finally {
      this.loading = false;
    }
  }

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
    if (!this.usuario) return;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const q = query(
      collection(this.firestore, 'notificaciones'),
      where('residenteUid', '==', this.usuario.id),
      orderBy('creadoEn', 'desc')
    );
    const snapshot = await getDocs(q);

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
        tipo: estado === 'nueva' ? 'en_espera' : estado === 'ignorada' ? 'rechazada' : 'atendida',
      };
    });

    this.enEspera = this.visitasRecientes.filter(v => v.tipo === 'en_espera').length;
    this.visitasHoy = snapshot.docs.filter(d => {
      const fecha: Date = d.data()['creadoEn']?.toDate() ?? new Date();
      return fecha >= hoy;
    }).length;
  }

  private getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      nueva: 'Visita en puerta',
      vista: 'Atendida',
      ignorada: 'Rechazada',
    };
    return labels[estado] ?? 'Visita';
  }

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
}
