import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  errorMsg: string = '';

  private router = inject(Router);
  private authService = inject(AuthService);

  async login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completá email y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMsg = this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(error: any): string {
    if (error?.message === 'invalid-credentials') {
      return 'Email o contraseña incorrectos.';
    }
    return 'Error al iniciar sesión. Intentá de nuevo.';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
