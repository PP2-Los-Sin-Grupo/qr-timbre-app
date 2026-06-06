/* Servicio de autenticacion: login, registro y cambio de contraseña.
   Los usuarios se almacenan en la coleccion "usuarios" de Firestore */

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc } from '@angular/fire/firestore';

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

  /* Busca al usuario por email+password y guarda la sesion en localStorage */
  async login(email: string, password: string): Promise<void> {
    const ref = collection(this.firestore, 'usuarios');
    const q = query(ref, where('email', '==', email), where('password', '==', password));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('invalid-credentials');
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
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
    const ref = collection(this.firestore, 'usuarios');
    const q = query(ref, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      throw new Error('email-exists');
    }

    await addDoc(ref, {
      email,
      password,
      nombre,
      apellido,
      rol: 'Residente',
      departamentoId,
      telegramChatId: ''
    });
  }

  /* Cambia la contraseña: verifica credenciales actuales y actualiza el campo */
  async cambiarPassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    const ref = collection(this.firestore, 'usuarios');
    const q = query(ref, where('email', '==', email), where('password', '==', currentPassword));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('invalid-credentials');
    }

    const docRef = snapshot.docs[0].ref;
    const { updateDoc } = await import('@angular/fire/firestore');
    await updateDoc(docRef, { password: newPassword });
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
