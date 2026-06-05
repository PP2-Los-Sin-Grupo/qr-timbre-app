/* Pagina de ajustes del residente: permite vincular/desvincular Telegram
   y configurar preferencias de notificacion */

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore, doc, getDoc, updateDoc
} from '@angular/fire/firestore';
import { AuthService, UsuarioSession } from '../services/auth.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: false,
})
export class AjustesPage implements OnInit {
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

  /* Al iniciar, carga el telegramChatId actual del usuario desde Firestore */
  async ngOnInit() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    try {
      const usuarioRef = doc(this.firestore, 'usuarios', usuario.id);
      const snap = await getDoc(usuarioRef);
      if (snap.exists()) {
        const data = snap.data();
        this.telegramChatId = data['telegramChatId'] || '';
        this.telegramVinculado = !!this.telegramChatId;
        this.unidad = `Piso ${data['departamentoId'] || ''}`;
      }
    } catch (e) {
      console.error('Error cargando datos de ajustes:', e);
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
