const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const config = require('../config');

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { edificio_id, nombre, email, password, telefono, rol, departamento_id } = req.body;

    if (!edificio_id || !nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const existing = await query('SELECT id FROM Usuarios WHERE email = @email', { email });
    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO Usuarios (edificio_id, nombre, email, password_hash, telefono, rol)
       OUTPUT INSERTED.id
       VALUES (@edificio_id, @nombre, @email, @password_hash, @telefono, @rol)`,
      { edificio_id, nombre, email, password_hash, telefono: telefono || null, rol: rol || 'propietario' }
    );

    const userId = result.recordset[0].id;

    if (departamento_id) {
      await query(
        'UPDATE Departamentos SET usuario_id = @usuario_id WHERE id = @departamento_id',
        { usuario_id: userId, departamento_id }
      );
    }

    const token = jwt.sign(
      { id: userId, email, rol: rol || 'propietario', edificio_id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({ id: userId, nombre, email, token, edificio_id, departamento_id: departamento_id || null });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const result = await query(
      `SELECT id, nombre, email, password_hash, rol, edificio_id FROM Usuarios WHERE email = @email`,
      { email }
    );

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.recordset[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol, edificio_id: user.edificio_id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol, edificio_id: user.edificio_id, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
