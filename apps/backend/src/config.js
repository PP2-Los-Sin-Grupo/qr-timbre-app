require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 4000,
  db: {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    database: process.env.DB_NAME || 'TimbreQR',
  },
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  telegramNotifyUrl: process.env.TELEGRAM_NOTIFY_URL || 'http://localhost:3000/notify',
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
};

module.exports = config;
