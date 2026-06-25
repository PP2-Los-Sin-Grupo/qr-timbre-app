import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Visita {
  id: number;
  estado: string;
  mensaje: string;
  tiempo: string;
  tipo: 'en_espera' | 'atendida' | 'rechazada';
  metodo?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  unidad: string = '3°B - Rios';
  visitasHoy: number = 3;
  enEspera: number = 1;

  visitasRecientes: Visita[] = [
    {
      id: 1,
      estado: 'Visita en puerta',
      mensaje: 'Llegó alguien por vos',
      tiempo: 'hace 2 min',
      tipo: 'en_espera'
    },
    {
      id: 2,
      estado: 'Visita — 3°B',
        mensaje: 'Atendida - Telegram',
      tiempo: 'ayer 11:20',
      tipo: 'atendida',
        metodo: 'Telegram'
    }
  ];

  private router = inject(Router);
  private http = inject(HttpClient);

  // URL del servicio de notificaciones. Cambiar a la IP/host accesible desde el dispositivo si es necesario.
  private NOTIFY_URL = 'http://localhost:3000';

  abrirVisita(visita: Visita) {
    console.log('Abriendo visita:', visita);
    const payload = { message: `Timbre activado - visita id:${visita.id}` };
    this.http.post(`${this.NOTIFY_URL}/notify`, payload).subscribe({
      next: (res) => console.log('Notificación enviada:', res),
      error: (err) => console.error('Error enviando notificación:', err),
    });
  }

  rechazarVisita(visita: Visita) {
    console.log('Rechazando visita:', visita);
  }

  irAjustes() {
    this.router.navigate(['/ajustes']);
  }
}
