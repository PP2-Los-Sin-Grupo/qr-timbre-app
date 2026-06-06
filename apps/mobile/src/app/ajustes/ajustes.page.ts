/* Pagina de ajustes del residente: permite vincular/desvincular Telegram
   y configurar preferencias de notificacion */

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore, doc, getDoc, updateDoc
} from '@angular/fire/firestore';
import { AuthService, UsuarioSession } from '../services/auth.service';
import { TelegramService } from '../services/telegram.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: false,
})
export class AjustesPage implements OnInit {
  nombreUsuario: string = '';
  unidad: string = '';
  telegramChatId: string = '';
  telegramVinculado: boolean = false;
  mensajeEstado: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  notificaciones = {
    recibirAvisos: true,
    push: true,
    whatsapp: true,
    email: false
  };

  private router = inject(Router);
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private telegramService = inject(TelegramService);

  /* Al iniciar, carga el telegramChatId actual del usuario desde Firestore */
  async ngOnInit() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    try {
      const usuarioRef = doc(this.firestore, 'usuarios', usuario.id);
      const snap = await getDoc(usuarioRef);
      if (snap.exists()) {
        const data = snap.data();
        this.nombreUsuario = `${data['nombre']} ${data['apellido']}`;
        this.telegramChatId = data['telegramChatId'] || '';
        this.telegramVinculado = !!this.telegramChatId;

        /* Cargar el piso y numero real del departamento */
        const deptoId = data['departamentoId'];
        if (deptoId) {
          const deptoSnap = await getDoc(doc(this.firestore, 'departamentos', deptoId));
          if (deptoSnap.exists()) {
            const d = deptoSnap.data();
            this.unidad = `Piso ${d['piso']} - Depto ${d['numero']}`;
          }
        }
      }
    } catch (e) {
      console.error('Error cargando datos de ajustes:', e);
    }
  }

  /* Obtiene el chat ID del ultimo mensaje enviado al bot y lo rellena */
  async obtenerMiChatId() {
    this.mensajeEstado = 'Consultando Telegram...';
    this.tipoMensaje = '';
    const chatId = await this.telegramService.obtenerUltimoChatId();
    if (chatId) {
      this.telegramChatId = chatId;
      this.mensajeEstado = '✅ Chat ID obtenido. Apretá "Vincular Telegram" para guardar.';
      this.tipoMensaje = 'success';
    } else {
      this.mensajeEstado = '❌ No se encontraron mensajes recientes. Enviá un mensaje a @QRNoti_bot y volvé a intentar.';
      this.tipoMensaje = 'error';
    }
  }

  /* Guarda el chat ID en Firestore para vincular Telegram */
  async vincularTelegram() {
    if (!this.telegramChatId.trim()) {
      this.mensajeEstado = 'Ingresá un chat ID válido';
      this.tipoMensaje = 'error';
      return;
    }

    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    try {
      const usuarioRef = doc(this.firestore, 'usuarios', usuario.id);
      await updateDoc(usuarioRef, { telegramChatId: this.telegramChatId.trim() });
      this.telegramVinculado = true;
      this.mensajeEstado = '✅ Telegram vinculado correctamente';
      this.tipoMensaje = 'success';
    } catch (e) {
      console.error('Error vinculando Telegram:', e);
      this.mensajeEstado = '❌ Error al vincular Telegram';
      this.tipoMensaje = 'error';
    }
  }

  /* Limpia el chat ID de Firestore para desvincular Telegram */
  async desvincularTelegram() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    try {
      const usuarioRef = doc(this.firestore, 'usuarios', usuario.id);
      await updateDoc(usuarioRef, { telegramChatId: '' });
      this.telegramChatId = '';
      this.telegramVinculado = false;
      this.mensajeEstado = 'Telegram desvinculado';
      this.tipoMensaje = 'success';
    } catch (e) {
      console.error('Error desvinculando Telegram:', e);
      this.mensajeEstado = '❌ Error al desvincular';
      this.tipoMensaje = 'error';
    }
  }

  toggleNotificacion(key: string) {
    this.notificaciones[key as keyof typeof this.notificaciones] = !this.notificaciones[key as keyof typeof this.notificaciones];
  }

  abrirPuerta() {
    console.log('Abriendo puerta principal...');
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
