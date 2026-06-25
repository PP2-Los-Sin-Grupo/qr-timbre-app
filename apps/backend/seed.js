const { query } = require('./src/db');
const bcrypt = require('bcryptjs');

async function seed() {
  const existing = await query("SELECT COUNT(*) AS cnt FROM Edificios");
  if (existing.recordset[0].cnt > 0) {
    console.log('La base ya tiene datos. Ejecutá "node seed.js --force" para resetear.');
    process.exit(0);
  }

  const force = process.argv.includes('--force');
  if (force) {
    await query("DELETE FROM Visitas");
    await query("DELETE FROM Departamentos");
    await query("DELETE FROM Usuarios");
    await query("DELETE FROM Edificios");
    console.log('Datos anteriores eliminados');
  }

  const bld = await query(
    "INSERT INTO Edificios (nombre, direccion, qr_uuid) OUTPUT INSERTED.id VALUES (@n, @d, @q)",
    { n: 'Edificio Principal', d: 'Av. Siempre Viva 742', q: 'a1b2c3d4-0000-0000-0000-000000000001' }
  );
  const eid = bld.recordset[0].id;

  const hash = await bcrypt.hash('admin123', 10);
  await query(
    "INSERT INTO Usuarios (edificio_id, nombre, email, password_hash, telefono, rol) OUTPUT INSERTED.id VALUES (@eid, @n, @e, @p, @t, @r)",
    { eid, n: 'Administrador', e: 'admin@timbreqr.com', p: hash, t: null, r: 'admin' }
  );

  for (let i = 1; i <= 8; i++) {
    await query(
      "INSERT INTO Departamentos (edificio_id, numero, piso) VALUES (@eid, @num, @p)",
      { eid, num: i.toString(), p: Math.ceil(i / 2) }
    );
  }

  console.log('Seed completado ✅');
  console.log('  Admin: admin@timbreqr.com / admin123');
  console.log('  8 departamentos creados');
  process.exit(0);
}

seed().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
