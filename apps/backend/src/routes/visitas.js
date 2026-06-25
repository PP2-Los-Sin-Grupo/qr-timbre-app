const { Router } = require('express');
const { query } = require('../db');
const config = require('../config');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.rol === 'admin') {
      result = await query(
        `SELECT v.id, v.departamento_id, d.numero AS depto_numero, d.piso AS depto_piso,
                e.nombre AS edificio_nombre,
                v.mensaje, v.estado, v.metodo_notificacion, v.created_at
         FROM Visitas v
         JOIN Departamentos d ON d.id = v.departamento_id
         JOIN Edificios e ON e.id = d.edificio_id
         ORDER BY v.created_at DESC`
      );
    } else {
      result = await query(
        `SELECT v.id, v.departamento_id, d.numero AS depto_numero, d.piso AS depto_piso,
                e.nombre AS edificio_nombre,
                v.mensaje, v.estado, v.metodo_notificacion, v.created_at
         FROM Visitas v
         JOIN Departamentos d ON d.id = v.departamento_id
         JOIN Edificios e ON e.id = d.edificio_id
         WHERE d.edificio_id = @edificio_id
         ORDER BY v.created_at DESC`,
        { edificio_id: req.user.edificio_id }
      );
    }
    res.json(result.recordset);
  } catch (err) {
    console.error('Error listando visitas:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { departamento_id, mensaje } = req.body;
    if (!departamento_id) {
      return res.status(400).json({ error: 'departamento_id requerido' });
    }

    const deptoResult = await query(
      `SELECT d.id, d.numero, d.usuario_id, e.nombre AS edificio_nombre
       FROM Departamentos d
       JOIN Edificios e ON e.id = d.edificio_id
       WHERE d.id = @departamento_id`,
      { departamento_id }
    );

    if (deptoResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }

    const depto = deptoResult.recordset[0];

    const result = await query(
      `INSERT INTO Visitas (departamento_id, mensaje, estado, metodo_notificacion)
       OUTPUT INSERTED.id, INSERTED.created_at
       VALUES (@departamento_id, @mensaje, 'en_espera', 'telegram')`,
      { departamento_id, mensaje: mensaje || `Timbre activado - Depto ${depto.numero}` }
    );

    const visita = result.recordset[0];
    let notifyResult = { sent: false };

    if (depto.usuario_id) {
      const userResult = await query(
        'SELECT chat_id_telegram FROM Usuarios WHERE id = @usuario_id',
        { usuario_id: depto.usuario_id }
      );

      if (userResult.recordset.length > 0 && userResult.recordset[0].chat_id_telegram) {
        const chatId = userResult.recordset[0].chat_id_telegram;
        try {
          const response = await fetch(config.telegramNotifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId,
              message: visita.mensaje || `Timbre activado - Depto ${depto.numero}`,
            }),
          });
          const data = await response.json();
          notifyResult = { sent: true, response: data };
        } catch (fetchErr) {
          console.error('Error notificando a telegram:', fetchErr);
          notifyResult = { sent: false, error: 'Error al conectar con servicio de notificaciones' };
        }
      }
    }

    res.status(201).json({
      id: visita.id,
      departamento_id,
      depto_numero: depto.numero,
      mensaje: visita.mensaje,
      estado: 'en_espera',
      created_at: visita.created_at,
      notificacion: notifyResult,
    });
  } catch (err) {
    console.error('Error creando visita:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['en_espera', 'atendida', 'rechazada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Usar: en_espera, atendida o rechazada' });
    }

    const visitaResult = await query(
      `SELECT v.id, d.edificio_id FROM Visitas v
       JOIN Departamentos d ON d.id = v.departamento_id
       WHERE v.id = @id`,
      { id: req.params.id }
    );

    if (visitaResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }

    const visita = visitaResult.recordset[0];
    if (req.user.rol !== 'admin' && req.user.edificio_id !== visita.edificio_id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    await query('UPDATE Visitas SET estado = @estado WHERE id = @id', { estado, id: req.params.id });
    res.json({ ok: true, estado });
  } catch (err) {
    console.error('Error actualizando visita:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
