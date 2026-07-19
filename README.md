# Task CRUD API

A simple RESTful API for managing a to-do list, built with Node.js and Express. Data is stored in-memory.

## How to Install and Run
1. Install dependencies: `npm install`
2. Start the server: `node index.js`
3. The API will run on `http://localhost:3000`

## Endpoints

| CRUD Operation | HTTP Method | Endpoint | Meaning |
|---|---|---|---|
| Read (All) | GET | `/tasks` | List all tasks |
| Read (Single) | GET | `/tasks/:id` | Get a specific task by ID |
| Create | POST | `/tasks` | Add a new task |
| Update | PUT | `/tasks/:id` | Change a task's title or status |
| Delete | DELETE | `/tasks/:id` | Remove a task |

## Example Request (curl)
```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'