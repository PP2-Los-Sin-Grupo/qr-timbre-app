const msnodesqlv8 = require('msnodesqlv8');
const config = require('./config');

const CONN_STRING = `Driver={ODBC Driver 17 for SQL Server};Server=${config.db.server},${config.db.port};Database=${config.db.database};Trusted_Connection=yes;`;

let connection = null;

async function getConnection() {
  if (connection) return connection;

  return new Promise((resolve, reject) => {
    msnodesqlv8.open(CONN_STRING, (err, conn) => {
      if (err) {
        console.error('Error conectando a SQL Server:', err.message);
        return reject(err);
      }
      console.log('Conectado a SQL Server');
      connection = conn;
      resolve(conn);
    });
  });
}

function convertSql(sql, params) {
  const names = [];
  const seen = new Set();
  const regex = /@(\w+)/g;
  let match;

  const converted = sql.replace(/@(\w+)/g, (_, name) => {
    if (!seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
    return '?';
  });

  const values = names.map(k => (params[k] !== undefined ? params[k] : null));
  return { sql: converted, values };
}

async function query(text, params = {}) {
  const conn = await getConnection();
  const { sql, values } = convertSql(text, params);

  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, rows) => {
      if (err) return reject(err);
      resolve({ recordset: rows || [] });
    });
  });
}

async function close() {
  if (connection) {
    connection.close();
    connection = null;
  }
}

module.exports = { getConnection, query, close };
