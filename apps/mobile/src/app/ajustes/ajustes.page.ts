import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: false,
})
export class AjustesPage {
  unidad: string = '3°B — Rios';
  notificaciones = {
    recibirAvisos: true,
    push: true,
    whatsapp: true,
    email: false
  };

  private router = inject(Router);

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
