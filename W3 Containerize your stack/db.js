const { Pool } = require('pg');
require('dotenv').config();

// We use explicit credentials to bypass that local password error you were getting.
// When you move to Docker Compose (Stage 4), you can delete these explicit fields 
// and just use: connectionString: process.env.DATABASE_URL
const pool = new Pool({
  user: 'postgres',
  password: 'dev',
  host: 'localhost',
  database: 'tasks',
  port: 5433
});

async function initDB() {
  const client = await pool.connect();
  try {
    // 1. Create tasks table if it does not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT FALSE
      );
    `);

    // 2. Check if table is empty
    const res = await client.query('SELECT COUNT(*) FROM tasks;');
    const count = parseInt(res.rows[0].count, 10);

    // 3. Seed initial tasks only on first run if table is empty
    if (count === 0) {
      console.log('Seeding initial example tasks...');
      const seedTasks = [
        ['Learn Docker & Postgres', true],
        ['Connect Task API to containerized database', true],
        ['Complete all CRUD operations and deploy', false],
      ];

      for (const [title, done] of seedTasks) {
        await client.query(
          'INSERT INTO tasks (title, done) VALUES ($1, $2);',
          [title, done]
        );
      }
      console.log('Successfully seeded 3 example tasks.');
    } else {
      console.log(`Database already initialized with ${count} tasks.`);
    }
  } catch (err) {
    console.error('Error during database initialization:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Database helper function for queries
async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  initDB,
  query,
};