import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

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

  private router = inject(Router);

  login() {
    this.router.navigate(['/home']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
