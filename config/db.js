const mysql = require('mysql2/promise');
require('dotenv').config();

const sslConfig = process.env.DB_SSL_CA_CONTENT 
  ? { ca: Buffer.from(process.env.DB_SSL_CA_CONTENT, 'utf8') }
  : { rejectUnauthorized: false };

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
