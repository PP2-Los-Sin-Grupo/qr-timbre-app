/* Servicio para enviar mensajes a Telegram usando la Bot API.
   Usa el token configurado en environment y llama a api.telegram.org */

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  private botToken = environment.telegramBotToken;
  private apiBase = `https://api.telegram.org/bot${this.botToken}`;

  /* Envia un mensaje a un chat de Telegram. Retorna true si se envio correctamente */
  async enviarMensaje(chatId: string, mensaje: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBase}/sendMessage`, {
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

  /* Obtiene el chat ID del ultimo mensaje recibido por el bot.
     El usuario debe enviar un mensaje al bot antes de llamar esto.
     Retorna el chat ID o null si no hay mensajes recientes. */
  async obtenerUltimoChatId(): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiBase}/getUpdates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 1, allowed_updates: ['message'] })
      });
      const data = await response.json();
      if (!data.ok || !data.result || data.result.length === 0) {
        return null;
      }
      const chatId = data.result[0].message?.from?.id;
      return chatId ? String(chatId) : null;
    } catch (e) {
      console.error('Error obteniendo chat ID de Telegram:', e);
      return null;
    }
  }
}
