const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initDB() {
  const client = await pool.connect();
  try {
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT FALSE
      );
    `);

    
    const res = await client.query('SELECT COUNT(*) FROM tasks;');
    const count = parseInt(res.rows[0].count, 10);

    
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


async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  initDB,
  query,
};