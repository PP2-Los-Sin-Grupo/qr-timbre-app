/* Pagina de login/registro/cambio de contraseña del residente.
   Tiene tres modos intercambiables mediante enlaces */

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ThemeService } from '../services/theme.service';

interface DeptoOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  modo: 'login' | 'register' | 'cambiar-password' = 'login';

  /* Campos del formulario de login */
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  /* Campos del formulario de registro */
  regNombre: string = '';
  regApellido: string = '';
  regEmail: string = '';
  regPassword: string = '';
  regConfirmPassword: string = '';
  regDepartamentoId: string = '';
  departamentos: DeptoOption[] = [];

  /* Campos del formulario de cambio de contraseña */
  cambioEmail: string = '';
  cambioCurrentPassword: string = '';
  cambioNewPassword: string = '';
  cambioConfirmPassword: string = '';

  /* Estado compartido */
  loading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';
  darkModeEnabled: boolean = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private themeService = inject(ThemeService);

  /* Al iniciar, solo carga el tema. Los departamentos se cargan al abrir el modo registro */
  ngOnInit() {
    this.darkModeEnabled = this.themeService.isDarkMode();
  }

  ionViewWillEnter() {
    this.darkModeEnabled = this.themeService.isDarkMode();
  }

  /* Obtiene los departamentos de Firestore filtrando los que ya tienen residente */
  private async cargarDepartamentos() {
    try {
      const usuariosSnap = await getDocs(collection(this.firestore, 'usuarios'));
      const deptosOcupados = new Set(
        usuariosSnap.docs
          .map(d => d.data()['departamentoId'])
          .filter(id => id)
      );

      const deptosSnap = await getDocs(collection(this.firestore, 'departamentos'));
      this.departamentos = deptosSnap.docs
        .filter(d => !deptosOcupados.has(d.id))
        .map(d => ({
          id: d.id,
          label: `Piso ${d.data()['piso']} - Depto ${d.data()['numero']}`
        }));
    } catch (e) {
      console.error('Error cargando departamentos:', e);
    }
  }

  /* Cambia entre los modos login / registro / cambiar-password */
  setModo(modo: 'login' | 'register' | 'cambiar-password') {
    this.modo = modo;
    this.errorMsg = '';
    this.successMsg = '';
    /* Carga los departamentos solo cuando se abre el formulario de registro */
    if ( modo === 'register' && this.departamentos.length === 0 ) {
      this.cargarDepartamentos();
    }
  }

  /* Inicia sesion con email y contraseña */
  async login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completá email y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMsg = error?.message === 'invalid-credentials'
        ? 'Email o contraseña incorrectos.'
        : 'Error al iniciar sesión. Intentá de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  /* Crea una cuenta nueva como residente */
  async register() {
    if (!this.regNombre || !this.regApellido || !this.regEmail || !this.regPassword || !this.regDepartamentoId) {
      this.errorMsg = 'Completá todos los campos.';
      return;
    }
    if (this.regPassword !== this.regConfirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.regPassword.length < 4) {
      this.errorMsg = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    try {
      await this.authService.register(this.regEmail, this.regPassword, this.regNombre, this.regApellido, this.regDepartamentoId);
      this.successMsg = 'Cuenta creada correctamente. Ya podés iniciar sesión.';
      this.regNombre = '';
      this.regApellido = '';
      this.regEmail = '';
      this.regPassword = '';
      this.regConfirmPassword = '';
      this.regDepartamentoId = '';
      setTimeout(() => this.setModo('login'), 2000);
    } catch (error: any) {
      this.errorMsg = error?.message === 'email-exists'
        ? 'Ya existe una cuenta con ese email.'
        : 'Error al crear la cuenta. Intentá de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  /* Cambia la contraseña verificando la actual */
  async cambiarPassword() {
    if (!this.cambioEmail || !this.cambioCurrentPassword || !this.cambioNewPassword) {
      this.errorMsg = 'Completá todos los campos.';
      return;
    }
    if (this.cambioNewPassword !== this.cambioConfirmPassword) {
      this.errorMsg = 'Las contraseñas nuevas no coinciden.';
      return;
    }
    if (this.cambioNewPassword.length < 4) {
      this.errorMsg = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    try {
      await this.authService.cambiarPassword(this.cambioEmail, this.cambioCurrentPassword, this.cambioNewPassword);
      this.successMsg = 'Contraseña actualizada correctamente.';
      this.cambioEmail = '';
      this.cambioCurrentPassword = '';
      this.cambioNewPassword = '';
      this.cambioConfirmPassword = '';
    } catch (error: any) {
      this.errorMsg = error?.message === 'invalid-credentials'
        ? 'Email o contraseña actual incorrectos.'
        : 'Error al cambiar la contraseña. Intentá de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleDarkMode() {
    this.darkModeEnabled = !this.darkModeEnabled;
    this.themeService.setDarkMode(this.darkModeEnabled);
  }
}
