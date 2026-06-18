/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';

import { HomePage } from './home.page';
import { AuthService } from '../services/auth.service';
import { TelegramService } from '../services/telegram.service';
import { ThemeService } from '../services/theme.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let telegramServiceSpy: jasmine.SpyObj<TelegramService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    telegramServiceSpy = jasmine.createSpyObj<TelegramService>('TelegramService', ['enviarMensaje']);
    themeServiceSpy = jasmine.createSpyObj<ThemeService>('ThemeService', ['isDarkMode', 'setDarkMode']);
    authServiceSpy.getCurrentUser.and.returnValue(null);
    themeServiceSpy.isDarkMode.and.returnValue(false);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TelegramService, useValue: telegramServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: Firestore, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to ajustes', () => {
    component.irAjustes();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/ajustes']);
  });

  it('should toggle dark mode and persist preference', () => {
    component.darkModeEnabled = false;

    component.toggleDarkMode();

    expect(component.darkModeEnabled).toBeTrue();
    expect(themeServiceSpy.setDarkMode).toHaveBeenCalledWith(true);
  });

  it('should call unsubscribe on destroy if listener exists', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    (component as any).unsubscribeNotif = unsubscribeSpy;

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
