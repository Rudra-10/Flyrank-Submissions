const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const { initDB, query } = require('./db');

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

app.get('/tasks', async (req, res) => {
    try {
        const result = await query('SELECT * FROM tasks ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

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

app.post('/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: "Title is required and cannot be empty" });
        }

        const result = await query(
            'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *',
            [title.trim(), false]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT update a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) return res.status(400).json({ error: "Invalid ID format" });

        const checkResult = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const currentTask = checkResult.rows[0];
        const { title, done } = req.body;
        const newTitle = title !== undefined ? title.trim() : currentTask.title;
        const newDone = done !== undefined ? Boolean(done) : currentTask.done;

        if (title !== undefined && newTitle === '') {
            return res.status(400).json({ error: "Title cannot be empty" });
        }

        const updateResult = await query(
            'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
            [newTitle, newDone, taskId]
        );

        res.status(200).json(updateResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) return res.status(400).json({ error: "Invalid ID format" });

        const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});