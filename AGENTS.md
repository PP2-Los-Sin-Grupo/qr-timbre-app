# AGENTS.md

Sistema de portero electrónico digital: dos apps separadas en monorepo básico.

## Arquitectura

```
apps/
├── mobile/     Ionic + Angular 20 - Para RESIDENTES (notificaciones, configuración)
└── web/        React + Vite     - Para VISITANTES (escanear QR, panel admin)
```

**Flujo:** Visitante escanea QR en web → Selecciona depto → Residente recibe push en mobile.

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
npm run lint       # ESLint flat config
npm run preview    # vite preview
```

**Notas:**
- React 19 + TypeScript 6
- ESLint flat config (eslint.config.js)
- Vite con plugin React estándar

## Convenciones

### Mobile (Angular/Ionic)
- Páginas: `*.page.ts` con clase `XxxPage`
- Componentes: `*.component.ts` con clase `XxxComponent`
- Selectores: `app-nombre` (kebab-case) para componentes, `appNombre` (camelCase) para directivas
- TypeScript estricto: `strict: true`, `noImplicitReturns: true`

### Web (React)
- TypeScript estricto habilitado
- ESM modules (`"type": "module"`)

## Qué falta / Pendiente

- No hay backend en este workspace (espera API externa)
- No hay CI/CD configurado
- No hay tests en web (solo script de lint)
- Mobile: Capacitor tiene appId genérico (`io.ionic.starter`)
- No hay integración de escaneo QR implementada aún
