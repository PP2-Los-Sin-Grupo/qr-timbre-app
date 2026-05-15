import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

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
