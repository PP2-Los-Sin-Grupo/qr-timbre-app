# 🏢 App Timbre QR

Sistema de portero electrónico digital basado en código QR que centraliza la comunicación entre visitantes y residentes mediante una aplicación web y una aplicación mobile, sin necesidad de hardware tradicional.

---

## 📌 Descripción

Portero QR permite que un visitante escanee un código QR ubicado en la entrada del edificio, seleccione el departamento al que desea avisar y notifique su llegada al residente.

**Flujo principal:**

1. El visitante abre la **app web** (escaneando el QR de la entrada).
2. Selecciona el departamento y envía el aviso de llegada.
3. Se crea una notificación en la base de datos (Firestore).
4. El residente recibe el aviso en su **app mobile** y, además, un mensaje por **Telegram**.

Cada residente puede configurar sus preferencias de contacto (por ejemplo, vincular su cuenta de Telegram) desde la app mobile. Existe también un **panel de administración** en la app web para gestionar usuarios y departamentos.

---

## 🧩 Arquitectura del sistema

El proyecto es un **monorepo** con dos aplicaciones independientes que comparten un mismo backend serverless (Firebase).

### 🌐 Web App (React + Vite) — `apps/web`
- Acceso de **visitantes** mediante QR para avisar su llegada.
- **Panel de administración** para gestión de usuarios y departamentos.
- Login propio (validado contra Firestore).

### 📱 App Mobile (Ionic + Angular) — `apps/mobile`
- Uso exclusivo para **residentes**.
- Recepción de notificaciones de llegada.
- Configuración de preferencias de contacto (vinculación con Telegram).

### ⚙️ Backend (Firebase / Serverless)
- **Cloud Firestore** como base de datos (colecciones `usuarios`, `departamentos`, `notificaciones`).
- Reglas de seguridad definidas en [firestore.rules](firestore.rules).
- Notificaciones a residentes mediante la **Telegram Bot API** si se agrega el id de telegram en la configuración.

---

## 🛠️ Stack tecnológico

| Módulo | Tecnologías |
| --- | --- |
| **Web** | React 19, TypeScript, Vite, Material UI (MUI), React Router, Firebase, Vitest |
| **Mobile** | Ionic 8, Angular 20 (NgModules), Capacitor, Firebase, RxJS, Karma + Jasmine |
| **Backend** | Firebase Cloud Firestore |
| **Notificaciones** | Telegram Bot API |

---

## 📁 Estructura del proyecto (Monorepo)

```
qr-timbre-app/
├── AGENTS.md                 # Documentación de arquitectura para agentes
├── README.md
├── firestore.rules           # Reglas de seguridad de Firestore
├── apps/
│   ├── mobile/               # App Ionic + Angular (residentes)
│   │   └── src/app/
│   │       ├── home/         # Pantalla principal del residente
│   │       ├── login/        # Inicio de sesión
│   │       ├── ajustes/      # Preferencias (Telegram, tema)
│   │       └── services/     # auth, telegram, theme
│   └── web/                  # App React + Vite (visitantes y admin)
│       └── src/
│           ├── auth/         # Login y rutas protegidas
│           ├── firebase/     # Configuración de Firebase
│           ├── pages/        # Inicio, formulario de notificación
│           └── panel_admin/  # Dashboard y gestión de usuarios
```

> **No hay `package.json` en la raíz.** Cada app gestiona sus propias dependencias y scripts.

---

## 🚀 Instalación y ejecución local

### Requisitos previos
- [Node.js](https://nodejs.org/) (versión LTS recomendada) y npm
- Un proyecto de **Firebase** con Firestore habilitado
- (Opcional) Un **bot de Telegram** y su token para las notificaciones

Las credenciales de Firebase y el token de Telegram se configuran en:
- Mobile: `apps/mobile/src/environments/environment.ts`
- Web: `apps/web/src/firebase/config.tsx`

### 📱 App Mobile (`apps/mobile`)

```bash
cd apps/mobile
npm install
npm start          # ng serve — http://localhost:8100
```

Otros comandos:

```bash
npm run build      # Compila la app (ng build)
npm run test       # Tests con Karma + Jasmine
npm run lint       # Linter de Angular ESLint
```

### 🌐 App Web (`apps/web`)

```bash
cd apps/web
npm install
npm run dev        # vite — http://localhost:5173
```

Otros comandos:

```bash
npm run build      # tsc -b && vite build
npm run preview    # Previsualiza el build de producción
npm run test       # Tests con Vitest
npm run lint       # ESLint
```

---

## 👥 Integrantes del grupo

- Favio Rios
- Gonzalo Iglesias
- Kevin Villarreal
- Rodrigo Maidana
- Paola Velastiqui
- Sofía Serrano
---

> Proyecto desarrollado en el marco de la cursada del **IFTS N.° 11**.
