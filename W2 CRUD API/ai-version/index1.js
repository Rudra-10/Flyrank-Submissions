const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express();
const port = 3000;

app.use(express.json());

// Serve Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// In-memory tasks database
const tasks = [
    { id: 1, title: 'learn express.js', completed: true },
    { id: 2, title: 'complete assignment', completed: true },
    { id: 3, title: 'watch FIFA finals', completed: false }
];

// GET /
app.get('/', (req, res) => {
    res.status(200).json({
        name: "Task CRUD API (AI Version)",
        version: "1.0.0",
        endpoints: [
            "GET /docs",
            "GET /health",
            "GET /tasks",
            "GET /tasks/:id",
            "POST /tasks",
            "PUT /tasks/:id",
            "DELETE /tasks/:id"
        ]
    });
});

// GET /health
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok" });
});

// GET /tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ error: "Task ID must be a valid integer" });
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }
    
    res.status(200).json(task);
});

// POST /tasks
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    
    // Validate title: missing (undefined) or empty/whitespace only
    if (title === undefined || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Title is required and cannot be empty" });
    }
    
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    
    const newTask = {
        id: nextId,
        title: title.trim(),
        completed: false
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ error: "Task ID must be a valid integer" });
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }
    
    const { title, completed } = req.body;
    
    // Validate title: missing (undefined) or empty/whitespace only
    if (title === undefined || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Title is required and cannot be empty" });
    }
    
    task.title = title.trim();
    if (completed !== undefined) {
        task.completed = Boolean(completed);
    }
    
    res.status(200).json(task);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ error: "Task ID must be a valid integer" });
    }
    
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }
    
    tasks.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
