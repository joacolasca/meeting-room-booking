const pool = require('./config/db');

async function testConnection() {
    const result = await pool.query('SELECT NOW()');
    console.log(result.rows);
}

testConnection();
