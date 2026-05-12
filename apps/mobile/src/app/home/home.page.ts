import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

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
      mensaje: 'Atendida - WhatsApp',
      tiempo: 'ayer 11:20',
      tipo: 'atendida',
      metodo: 'WhatsApp'
    }
  ];

  private router = inject(Router);

  abrirVisita(visita: Visita) {
    console.log('Abriendo visita:', visita);
  }

  rechazarVisita(visita: Visita) {
    console.log('Rechazando visita:', visita);
  }

  irAjustes() {
    this.router.navigate(['/ajustes']);
  }
}
