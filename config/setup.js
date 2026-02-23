const pool = require('./db');

async function setupTables() {
  try {
    const conn = await pool.getConnection();

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS KodUser (
        uid VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 100000.00,
        phone VARCHAR(15) NOT NULL,
        role ENUM('customer', 'manager', 'admin') DEFAULT 'customer'
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS UserToken (
        tid INT AUTO_INCREMENT PRIMARY KEY,
        token TEXT NOT NULL,
        uid VARCHAR(50) NOT NULL,
        expairy DATETIME NOT NULL,
        FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tables created successfully');
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    process.exit(1);
  }
}

setupTables();
