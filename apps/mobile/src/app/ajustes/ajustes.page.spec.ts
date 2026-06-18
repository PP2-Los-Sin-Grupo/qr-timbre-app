/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';

import { AjustesPage } from './ajustes.page';
import { AuthService } from '../services/auth.service';
import { TelegramService } from '../services/telegram.service';
import { ThemeService } from '../services/theme.service';

describe('AjustesPage', () => {
  let component: AjustesPage;
  let fixture: ComponentFixture<AjustesPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let telegramServiceSpy: jasmine.SpyObj<TelegramService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    telegramServiceSpy = jasmine.createSpyObj<TelegramService>('TelegramService', ['obtenerUltimoChatId']);
    themeServiceSpy = jasmine.createSpyObj<ThemeService>('ThemeService', ['isDarkMode', 'setDarkMode']);
    themeServiceSpy.isDarkMode.and.returnValue(true);

    authServiceSpy.getCurrentUser.and.returnValue({
      id: 'u1',
      nombre: 'Ana',
      apellido: 'Perez',
      email: 'ana@edificio.com',
      rol: 'Residente',
      departamentoId: 'dep-1',
    });

    await TestBed.configureTestingModule({
      declarations: [AjustesPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TelegramService, useValue: telegramServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: Firestore, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dark mode state from theme service', async () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);

    await component.ngOnInit();

    expect(themeServiceSpy.isDarkMode).toHaveBeenCalled();
    expect(component.darkModeEnabled).toBeTrue();
  });

  it('should toggle notification flag', () => {
    expect(component.notificaciones.email).toBeFalse();

    component.toggleNotificacion('email');

    expect(component.notificaciones.email).toBeTrue();
  });

  it('should validate empty chatId before linking', async () => {
    component.telegramChatId = '   ';

    await component.vincularTelegram();

    expect(component.tipoMensaje).toBe('error');
    expect(component.mensajeEstado).toContain('Ingresá un chat ID válido');
  });

  it('should show success when telegram api returns a chat id', async () => {
    telegramServiceSpy.obtenerUltimoChatId.and.returnValue(Promise.resolve('1168091764'));

    await component.obtenerMiChatId();

    expect(component.telegramChatId).toBe('1168091764');
    expect(component.tipoMensaje).toBe('success');
  });

  it('should show error when telegram api returns no chat id', async () => {
    telegramServiceSpy.obtenerUltimoChatId.and.returnValue(Promise.resolve(null));

    await component.obtenerMiChatId();

    expect(component.tipoMensaje).toBe('error');
    expect(component.mensajeEstado).toContain('No se encontraron mensajes recientes');
  });

  it('should navigate back to home', () => {
    component.volver();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should toggle dark mode and persist with service', () => {
    component.darkModeEnabled = false;

    component.toggleDarkMode();

    expect(component.darkModeEnabled).toBeTrue();
    expect(themeServiceSpy.setDarkMode).toHaveBeenCalledWith(true);
  });
});
