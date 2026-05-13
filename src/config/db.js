const mysql = require('mysql2/promise');
const { Pool: PgPool } = require('pg');
require('dotenv').config();

const dbType = process.env.DB_TYPE || 'mysql';
let pool;

if (dbType === 'neon' || dbType === 'postgres') {
    pool = new PgPool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // Neon connection check
    pool.connect()
        .then(client => {
            console.log('✅ Connected to Neon (PostgreSQL) successfully.');
            client.release();
        })
        .catch(err => console.error('❌ Neon (PostgreSQL) connection error:', err));
} else {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // MySQL connection check
    pool.getConnection()
        .then(conn => {
            console.log('✅ Connected to MySQL successfully.');
            conn.release();
        })
        .catch(err => console.error('❌ MySQL connection error:', err));
}

// Unified query executor
const execute = async (sql, params = []) => {
    if (dbType === 'neon' || dbType === 'postgres') {
        // Convert MySQL '?' placeholders to PostgreSQL '$1, $2, etc.'
        let index = 1;
        const pgSql = sql.replace(/\?/g, () => `$${index++}`);
        const result = await pool.query(pgSql, params);
        
        // Mock MySQL-like return structure for compatibility
        return [result.rows, result];
    } else {
        return await pool.execute(sql, params);
    }
};

module.exports = {
    pool,
    execute,
    dbType
};