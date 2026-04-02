const { Pool } = require('pg');

const pool = new Pool({
    host: 'aws-1-us-east-2.pooler.supabase.com',
    user: 'postgres.eqkflovozdchzjonnjyr',
    password: 'meetingroombooking123',
    database: 'postgres',
    port: 6543,
    ssl: { rejectUnauthorized: false },
    family: 4,
});

module.exports = pool;
