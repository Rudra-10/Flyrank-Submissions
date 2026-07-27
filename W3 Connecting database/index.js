const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const Database = require('better-sqlite3');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = new Database('tasks.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`).run();

const rowCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();

if (rowCount.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('learn express.js', 1);
  insert.run('complete assignment', 1);
  insert.run('watch FIFA finals', 0);
  console.log('Seeded database with 3 starting tasks.');
}

app.get('/',(req,res) =>{
    res.json({"name": "Task API", "version": "1.0", "endpoints": ["/tasks"]});
});

app.get('/health',(req,res)=>{
    res.json({"status": "ok"});
});

app.get ('/tasks', (req,res) =>{
    res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ "error": `Task ${taskId} not found` });
  }

  res.json(task);
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ "error": "Title is required and cannot be empty" });
    }

    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask = {
        id: nextId,
        title: title.trim(),
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ "error": `Task ${taskId} not found` });
  }
  
  const { title, done } = req.body;
  

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ "error": "Request body cannot be empty" });
  }
  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ "error": "Title cannot be empty" });
  }
  
  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = done;
  
  res.json(task);
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ "error": `Task ${taskId} not found` });
  }
  
  tasks.splice(taskIndex, 1);

  res.status(204).send();
});


app.get('/stats', (req, res) => {
  const total = tasks.length;
  
  const done = tasks.filter(task => task.done === true).length;
  
  const open = total - done;

  res.json({
    "total": total,
    "done": done,
    "open": open
  });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});