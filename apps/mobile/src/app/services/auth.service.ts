/* Servicio de autenticacion: login, registro y cambio de contraseña.
   Los usuarios se almacenan en la coleccion "usuarios" de Firestore */

import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc, updateDoc } from '@angular/fire/firestore';

export interface UsuarioSession {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  departamentoId: string;
}

const SESSION_KEY = 'usuario_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  /* Hashea la contraseña con SHA-256 usando el email como salt.
     Mismo email + misma password → mismo hash siempre.
     Distinto email → distinto hash aunque la password sea igual. */
  private async hashPassword(email: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + email.toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /* Busca al usuario por email+password y guarda la sesion en localStorage */
  async login(email: string, password: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const hashed = await this.hashPassword(normalizedEmail, password);
    const snapshot = await runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'usuarios');
      const q = query(ref, where('email', '==', normalizedEmail));
      return getDocs(q);
    });

    if (snapshot.empty) {
      throw new Error('invalid-credentials');
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const stored = data['password'];

    /* Acepta tanto contraseñas hasheadas (formato nuevo) como en texto plano
       (usuarios cargados manualmente en Firestore). */
    const matches = stored === hashed || stored === password;
    if (!matches) {
      throw new Error('invalid-credentials');
    }
    const session: UsuarioSession = {
      id: doc.id,
      nombre: data['nombre'],
      apellido: data['apellido'],
      email: data['email'],
      rol: data['rol'],
      departamentoId: data['departamentoId'],
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  /* Registra un nuevo residente: verifica que el email no exista y crea el documento */
  async register(email: string, password: string, nombre: string, apellido: string, departamentoId: string): Promise<void> {
    const snapshot = await runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'usuarios');
      const q = query(ref, where('email', '==', email));
      return getDocs(q);
    });

    if (!snapshot.empty) {
      throw new Error('email-exists');
    }

    const hashed = await this.hashPassword(email, password);
    await runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'usuarios');
      return addDoc(ref, {
        email,
        password: hashed,
        nombre,
        apellido,
        rol: 'Residente',
        departamentoId,
        telegramChatId: ''
      });
    });
  }

  /* Cambia la contraseña: verifica credenciales actuales y actualiza el campo */
  async cambiarPassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    const hashedCurrent = await this.hashPassword(email, currentPassword);
    const snapshot = await runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'usuarios');
      const q = query(ref, where('email', '==', email), where('password', '==', hashedCurrent));
      return getDocs(q);
    });

    if (snapshot.empty) {
      throw new Error('invalid-credentials');
    }

    const hashedNew = await this.hashPassword(email, newPassword);
    const docRef = snapshot.docs[0].ref;
    await runInInjectionContext(this.injector, () => updateDoc(docRef, { password: hashedNew }));
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  getCurrentUser(): UsuarioSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(SESSION_KEY);
  }
}
