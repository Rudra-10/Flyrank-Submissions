const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

// Notice we are importing from './db' now, and using initDB (capital B) and query!
const { initDB, query } = require('./db');

// Initialize database on startup
initDB().catch(console.error);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get('/health', (req, res) => {
    res.json({ "status": "ok" });
});

// ==========================================
// STAGE 2: READ FROM POSTGRES
// ==========================================

// GET all tasks (using your new query helper!)
app.get('/tasks', async (req, res) => {
    try {
        const result = await query('SELECT * FROM tasks ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET a single task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            return res.status(400).json({ error: "Task ID must be a valid integer" });
        }

        const result = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});