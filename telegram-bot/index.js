const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN no definido en las variables de entorno.');
  process.exit(1);
}

const DATA_FILE = path.resolve(__dirname, 'subscribers.json');
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

function loadSubscribers() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const arr = JSON.parse(raw);
    return new Set(arr);
  } catch (e) {
    return new Set();
  }
}

function saveSubscribers(set) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(Array.from(set), null, 2));
}

const subscribers = loadSubscribers();

if (ADMIN_CHAT_ID) {
  const idNum = Number(ADMIN_CHAT_ID);
  if (!isNaN(idNum)) {
    subscribers.add(idNum);
    saveSubscribers(subscribers);
    console.log('ADMIN_CHAT_ID añadido a suscriptores:', idNum);
  } else {
    console.warn('ADMIN_CHAT_ID no es un número válido:', ADMIN_CHAT_ID);
  }
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  subscribers.add(chatId);
  saveSubscribers(subscribers);
  bot.sendMessage(
    chatId,
    `✅ Registrado.\n\nTu ID de Telegram es: <b>${chatId}</b>\n\n` +
    'Enviá este número al administrador para vincular tu cuenta y recibir las notificaciones del timbre.',
    { parse_mode: 'HTML' }
  );
});

bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;
  if (subscribers.has(chatId)) {
    subscribers.delete(chatId);
    saveSubscribers(subscribers);
    bot.sendMessage(chatId, '🛑 Has sido dado de baja de las notificaciones.');
  } else {
    bot.sendMessage(chatId, 'No estabas registrado. Envía /start para suscribirte.');
  }
});

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint para enviar notificación a todos los suscriptores
app.post('/notify', async (req, res) => {
  const { message, chatId } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Falta campo "message" en el body.' });
  }

  // Si se indicó chatId en el body, enviar solo a ese chat (útil para pruebas)
  if (chatId) {
    try {
      await bot.sendMessage(chatId, message);
      return res.json({ ok: true, sentTo: 1, to: chatId });
    } catch (err) {
      console.error('Error enviando a', chatId, err && err.message ? err.message : err);
      return res.status(500).json({ ok: false, error: String(err) });
    }
  }

  const list = Array.from(subscribers);
  let sent = 0;
  for (const id of list) {
    try {
      await bot.sendMessage(id, message);
      sent++;
    } catch (err) {
      console.error('Error enviando a', id, err && err.message ? err.message : err);
    }
  }

  res.json({ ok: true, sentTo: sent });
});

app.get('/subscribers', (req, res) => {
  res.json({ count: subscribers.size, subscribers: Array.from(subscribers) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de notificaciones escuchando en puerto ${PORT}`);
});
