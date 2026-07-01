# AGENTS.md

Sistema de portero electrónico digital: dos apps separadas en monorepo básico, con backend serverless en Firebase.

## Arquitectura

```
apps/
├── mobile/     Ionic + Angular 20 - Para RESIDENTES (notificaciones, configuración)
└── web/        React + Vite     - Para VISITANTES (escanear QR, panel admin)
```

**Backend:** Cloud Firestore (colecciones `usuarios`, `departamentos`, `notificaciones`, `ratelimits`). Reglas en `firestore.rules`. Notificaciones a residentes vía **Telegram Bot API**.

**Flujo:** Visitante escanea QR en web → Selecciona depto → Se crea notificación en Firestore → Residente recibe el aviso en mobile y por Telegram.

## Comandos

Cada app tiene su propio `package.json`. **No hay package.json en root.**

### Mobile (`apps/mobile/`)

```bash
cd apps/mobile
npm install
npm start          # ng serve, puerto por defecto 8100
npm run build      # ng build
npm run test       # Karma + Jasmine
npm run lint       # Angular ESLint
```

**Notas:**
- Usa **NgModules tradicionales** (`standalone: false`), no standalone components
- Capacitor configurado pero sin plugins de cámara/QR aún
- ESLint: requiere sufijos `Page` o `Component`, prefijo `app-` en selectores

### Web (`apps/web/`)

```bash
cd apps/web
npm install
npm run dev        # vite, puerto por defecto 5173
npm run build      # tsc -b && vite build
npm run test       # Vitest (test) / test:watch (modo watch)
npm run lint       # ESLint flat config
npm run preview    # vite preview
```

**Notas:**
- React 19 + TypeScript 6
- UI con Material UI (MUI)
- ESLint flat config (eslint.config.js)
- Vite con plugin React estándar
- Tests con Vitest + Testing Library (config en vite.config.ts, setup en src/test/setup.ts)

## Convenciones

### Mobile (Angular/Ionic)
- Páginas: `*.page.ts` con clase `XxxPage`
- Componentes: `*.component.ts` con clase `XxxComponent`
- Selectores: `app-nombre` (kebab-case) para componentes, `appNombre` (camelCase) para directivas
- TypeScript estricto: `strict: true`, `noImplicitReturns: true`

### Web (React)
- TypeScript estricto habilitado
- ESM modules (`"type": "module"`)

## Notas de seguridad

- **No usa Firebase Authentication**: el login es propio y valida credenciales contra la colección `usuarios` (contraseñas hasheadas). Por eso `request.auth` siempre es null y las reglas no se apoyan en él. Aceptable para demo/educativo, no para producción.
- Credenciales de Firebase y token del bot de Telegram están en `apps/mobile/src/environments/environment.ts` y `apps/web/src/firebase/config.tsx`. No deberían versionarse en un entorno real.

## Qué falta / Pendiente

- No hay CI/CD configurado
- Mobile: Capacitor tiene appId genérico (`io.ionic.starter`)
- No hay integración de escaneo QR (cámara) implementada aún; el visitante accede a la web por URL
- El login propio (sin Firebase Auth) y las reglas abiertas de Firestore deberían endurecerse para producción
