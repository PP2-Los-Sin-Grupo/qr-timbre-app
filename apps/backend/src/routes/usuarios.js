const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.rol === 'admin') {
      result = await query(
        `SELECT id, edificio_id, nombre, email, telefono, chat_id_telegram, rol, created_at
         FROM Usuarios ORDER BY nombre`
      );
    } else {
      result = await query(
        `SELECT id, edificio_id, nombre, email, telefono, chat_id_telegram, rol, created_at
         FROM Usuarios WHERE edificio_id = @edificio_id ORDER BY nombre`,
        { edificio_id: req.user.edificio_id }
      );
    }
    res.json(result.recordset);
  } catch (err) {
    console.error('Error listando usuarios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.edificio_id, u.nombre, u.email, u.telefono,
              u.chat_id_telegram, u.rol, u.created_at,
              d.numero AS depto_numero, d.piso AS depto_piso,
              e.nombre AS edificio_nombre
       FROM Usuarios u
       LEFT JOIN Departamentos d ON d.usuario_id = u.id
       LEFT JOIN Edificios e ON e.id = u.edificio_id
       WHERE u.id = @id`,
      { id: req.params.id }
    );
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = result.recordset[0];
    if (req.user.rol !== 'admin' && req.user.edificio_id !== user.edificio_id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error obteniendo usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { nombre, email, telefono, chat_id_telegram, password } = req.body;

    if (req.user.id !== parseInt(req.params.id) && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No puedes modificar este usuario' });
    }

    const setClauses = [];
    const params = { id: req.params.id };

    if (nombre !== undefined) {
      setClauses.push('nombre = @nombre');
      params.nombre = nombre;
    }
    if (email !== undefined) {
      setClauses.push('email = @email');
      params.email = email;
    }
    if (telefono !== undefined) {
      setClauses.push('telefono = @telefono');
      params.telefono = telefono;
    }
    if (chat_id_telegram !== undefined) {
      setClauses.push('chat_id_telegram = @chat_id_telegram');
      params.chat_id_telegram = chat_id_telegram;
    }
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      setClauses.push('password_hash = @password_hash');
      params.password_hash = password_hash;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    await query(`UPDATE Usuarios SET ${setClauses.join(', ')} WHERE id = @id`, params);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await query('DELETE FROM Usuarios WHERE id = @id', { id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error eliminando usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
