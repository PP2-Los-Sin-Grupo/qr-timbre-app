const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db');
const config = require('./config');

const authRoutes = require('./routes/auth');
const edificiosRoutes = require('./routes/edificios');
const departamentosRoutes = require('./routes/departamentos');
const usuariosRoutes = require('./routes/usuarios');
const visitasRoutes = require('./routes/visitas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/edificios', edificiosRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/visitas', visitasRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

async function start() {
  try {
    await getConnection();
    app.listen(config.port, () => {
      console.log(`Backend TimbreQR corriendo en puerto ${config.port}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

start();
