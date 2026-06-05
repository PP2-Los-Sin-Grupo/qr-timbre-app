/* Servicio para enviar mensajes a Telegram usando la Bot API.
   Usa el token configurado en environment y llama a api.telegram.org */

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  private botToken = environment.telegramBotToken;
  private apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

  /* Envia un mensaje a un chat de Telegram. Retorna true si se envio correctamente */
  async enviarMensaje(chatId: string, mensaje: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: mensaje,
          parse_mode: 'HTML'
        })
      });
      const data = await response.json();
      return data.ok === true;
    } catch (e) {
      console.error('Error enviando mensaje a Telegram:', e);
      return false;
    }
  }
}
