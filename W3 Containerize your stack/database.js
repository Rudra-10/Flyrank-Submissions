require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initDb() {
    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN DEFAULT FALSE
        );
    `);

    
    const result = await pool.query('SELECT COUNT(*) FROM tasks');
    
    if (parseInt(result.rows[0].count) === 0) {
        await pool.query(`
            INSERT INTO tasks (title, done) VALUES 
            ('Learn Express.js', false),
            ('Complete assignment', false),
            ('Watch FIFA finals', false);
        `);
        console.log("Database seeded with starter tasks.");
    } else {
        console.log("Database already contains tasks. Skipping seed.");
    }
}

module.exports = { pool, initDb };