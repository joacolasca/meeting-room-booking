const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'anakin123',
    database: 'postgres',
    port: 5432,
});

module.exports = pool;
