import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';

import { LoginPage } from './login.page';
import { AuthService } from '../services/auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
      'register',
      'cambiarPassword',
    ]);
    authServiceSpy.login.and.returnValue(Promise.resolve());
    authServiceSpy.register.and.returnValue(Promise.resolve());
    authServiceSpy.cambiarPassword.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Firestore, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();

    component.togglePassword();

    expect(component.showPassword).toBeTrue();
  });

  it('should validate empty login fields', async () => {
    component.email = '';
    component.password = '';

    await component.login();

    expect(component.errorMsg).toContain('Completá email y contraseña');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should login and navigate to home', async () => {
    component.email = 'residente@edificio.com';
    component.password = '1234';

    await component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('residente@edificio.com', '1234');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should validate register password mismatch', async () => {
    component.regNombre = 'Ana';
    component.regApellido = 'Perez';
    component.regEmail = 'ana@edificio.com';
    component.regPassword = '1234';
    component.regConfirmPassword = '0000';
    component.regDepartamentoId = 'dep-1';

    await component.register();

    expect(component.errorMsg).toContain('Las contraseñas no coinciden');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call register service when form is valid', async () => {
    spyOn(window, 'setTimeout').and.callFake((fn: TimerHandler) => {
      if (typeof fn === 'function') {
        fn();
      }
      return 0 as any;
    });

    component.modo = 'register';
    component.regNombre = 'Ana';
    component.regApellido = 'Perez';
    component.regEmail = 'ana@edificio.com';
    component.regPassword = '1234';
    component.regConfirmPassword = '1234';
    component.regDepartamentoId = 'dep-1';

    await component.register();

    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'ana@edificio.com',
      '1234',
      'Ana',
      'Perez',
      'dep-1'
    );
    expect(component.modo).toBe('login');
  });
});
