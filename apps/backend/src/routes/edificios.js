const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { query } = require('../db');
const config = require('../config');
const { authenticate, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/public', async (_req, res) => {
  try {
    const result = await query('SELECT id, nombre FROM Edificios ORDER BY nombre');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error listando edificios públicos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query('SELECT id, nombre, direccion, qr_uuid, created_at FROM Edificios ORDER BY nombre');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error listando edificios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query('SELECT id, nombre, direccion, qr_uuid, created_at FROM Edificios WHERE id = @id', { id: req.params.id });
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Edificio no encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error obteniendo edificio:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/qr/:qrUuid', async (req, res) => {
  try {
    const result = await query(
      `SELECT e.id, e.nombre, e.direccion,
              d.id AS depto_id, d.numero, d.piso
       FROM Edificios e
       LEFT JOIN Departamentos d ON d.edificio_id = e.id
       WHERE e.qr_uuid = @qrUuid`,
      { qrUuid: req.params.qrUuid }
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'QR inválido' });
    }

    const edificio = {
      id: result.recordset[0].id,
      nombre: result.recordset[0].nombre,
      direccion: result.recordset[0].direccion,
      qr_uuid: req.params.qrUuid,
      departamentos: [],
    };

    for (const row of result.recordset) {
      if (row.depto_id) {
        edificio.departamentos.push({ id: row.depto_id, numero: row.numero, piso: row.piso });
      }
    }

    res.json(edificio);
  } catch (err) {
    console.error('Error consultando QR:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

    const qr_uuid = uuidv4();
    const result = await query(
      `INSERT INTO Edificios (nombre, direccion, qr_uuid)
       OUTPUT INSERTED.id
       VALUES (@nombre, @direccion, @qr_uuid)`,
      { nombre, direccion: direccion || null, qr_uuid }
    );

    res.status(201).json({ id: result.recordset[0].id, nombre, direccion, qr_uuid });
  } catch (err) {
    console.error('Error creando edificio:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    await query(
      'UPDATE Edificios SET nombre = @nombre, direccion = @direccion WHERE id = @id',
      { nombre, direccion: direccion || null, id: req.params.id }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Error actualizando edificio:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await query('DELETE FROM Edificios WHERE id = @id', { id: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error eliminando edificio:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id/qr', async (req, res) => {
  try {
    const result = await query('SELECT qr_uuid FROM Edificios WHERE id = @id', { id: req.params.id });
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Edificio no encontrado' });

    const qrUuid = result.recordset[0].qr_uuid;
    const url = `${config.baseUrl}/?edificio=${qrUuid}`;

    const qrSvg = await QRCode.toString(url, { type: 'svg', margin: 2, color: { dark: '#6366f1', light: '#ffffff' } });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(qrSvg);
  } catch (err) {
    console.error('Error generando QR:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
