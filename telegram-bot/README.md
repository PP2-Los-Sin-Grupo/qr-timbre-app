# Servicio de notificaciones por Telegram

Este pequeño servicio registra chats que envían `/start` al bot y expone un endpoint HTTP para enviar notificaciones a todos los suscriptores.

Pasos de uso:

1. Copiá el archivo `.env.example` como `.env` y completá tu token de bot de Telegram:

```
TELEGRAM_BOT_TOKEN=tu-token-de-bot-aqui
PORT=3000
```

> ⚠️ **Importante**: No compartas el `.env` ni subas el token a GitHub. El `.env` ya está en `.gitignore`.

2. Instala dependencias e inicia el servicio:

```bash
cd telegram-bot
npm install
npm start
```

3. Desde Telegram, inicia una conversación con tu bot y envía `/start` para registrarte como receptor.

Nota: si querés no depender del registro, podés usar `ADMIN_CHAT_ID` para que el servicio envíe
siempre notificaciones a ese chat. Para conocer tu `chat id`, después de iniciar el bot y enviar `/start`
podés consultar `subscribers.json` o la ruta `/subscribers`:

```bash
curl http://localhost:3000/subscribers
```

Si la app web o móvil no puede alcanzar `http://localhost:3000`, cambialo por la IP de tu máquina
o usá `ngrok` para exponer el puerto.

4. Para enviar una notificación a todos los suscriptores, haz un POST a `/notify` con JSON `{ "message": "Tu mensaje" }`.

Ejemplo con `curl`:

```bash
curl -X POST http://localhost:3000/notify -H "Content-Type: application/json" -d '{"message":"Timbre activado"}'
```

Archivos creados:

- `index.js` - lógica del bot y endpoints.
- `subscribers.json` - almacena chats suscritos.
- `package.json` - dependencias y script `start`.
- `.env.example` - ejemplo de variables de entorno.
