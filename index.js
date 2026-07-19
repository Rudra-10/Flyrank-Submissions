const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const tasks = [
    { id: 1, title: 'learn express.js', completed: true },
    { id: 2, title: 'complete assignment', completed: true },
    { id: 3, title: 'watch FIFA finals', completed: false }
];

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});