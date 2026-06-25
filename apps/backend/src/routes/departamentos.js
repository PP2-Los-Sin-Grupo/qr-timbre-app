const { Router } = require('express');
const { query } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/public/:edificioId', async (req, res) => {
  try {
    const result = await query(
      `SELECT d.id, d.numero, d.piso, d.usuario_id
       FROM Departamentos d
       WHERE d.edificio_id = @edificioId
       ORDER BY d.piso, d.numero`,
      { edificioId: req.params.edificioId }
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error listando departamentos públicos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/edificio/:edificioId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT d.id, d.numero, d.piso, d.usuario_id,
              u.nombre AS residente_nombre,
              u.email AS residente_email,
              u.telefono AS residente_telefono,
              u.chat_id_telegram AS residente_chat_id
       FROM Departamentos d
       LEFT JOIN Usuarios u ON u.id = d.usuario_id
       WHERE d.edificio_id = @edificioId
       ORDER BY d.piso, d.numero`,
      { edificioId: req.params.edificioId }
    );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error listando departamentos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { edificio_id, numero, piso } = req.body;
    if (!edificio_id || !numero || piso === undefined) {
      return res.status(400).json({ error: 'edificio_id, numero y piso requeridos' });
    }

    const result = await query(
      `INSERT INTO Departamentos (edificio_id, numero, piso)
       OUTPUT INSERTED.id
       VALUES (@edificio_id, @numero, @piso)`,
      { edificio_id, numero: String(numero), piso }
    );

    res.status(201).json({ id: result.recordset[0].id, numero, piso });
  } catch (err) {
    if (err.number === 2627) {
      return res.status(409).json({ error: 'El número de departamento ya existe en este edificio' });
    }
    console.error('Error creando departamento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { numero, piso, usuario_id } = req.body;

    const check = await query('SELECT edificio_id FROM Departamentos WHERE id = @id', { id: req.params.id });
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Departamento no encontrado' });

    if (req.user.rol !== 'admin' && req.user.edificio_id !== check.recordset[0].edificio_id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    await query(
      `UPDATE Departamentos SET numero = @numero, piso = @piso, usuario_id = @usuario_id WHERE id = @id`,
      { numero: String(numero || ''), piso: piso ?? 0, usuario_id: usuario_id || null, id: req.params.id }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Error actualizando departamento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await query('DELETE FROM Departamentos WHERE id = @id', { id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error eliminando departamento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
