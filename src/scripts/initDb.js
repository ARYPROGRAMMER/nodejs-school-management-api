const db = require('../config/db');

async function initDb() {
    try {
        if (db.dbType === 'neon' || db.dbType === 'postgres') {
            await db.execute(`
                CREATE TABLE IF NOT EXISTS schools (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    latitude FLOAT NOT NULL,
                    longitude FLOAT NOT NULL,
                    established_year INT,
                    status VARCHAR(50) DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        } else {
            const connection = await db.pool.getConnection();
            await connection.query(`
                CREATE TABLE IF NOT EXISTS schools (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    latitude FLOAT NOT NULL,
                    longitude FLOAT NOT NULL,
                    established_year INT,
                    status ENUM('active', 'inactive') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            connection.release();
        }
        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDb();