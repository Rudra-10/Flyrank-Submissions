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

## AI vs Me (Stage 7)

### My Prompt
"Imagine you acting as a System Architect, build your CRUD API, which should have the following: language and framework - Node.js with Express; having five endpoints - GET/, GET/health, GET /tasks, GET /tasks/:id , POST /tasks, PUT /tasks/:id, DELETE /tasks/:id.
It should have strict in-memory array and no external database or any sort of files. For a correct input validation, it should reject empty,missing titles with a 400 Bad Request. And it should have following status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found. And serve the file using Swagger UI at /docs route using swagger-ui-express. And build the file in ai-version folder ONLY."

### 1. What did the AI do better?
The AI applied highly defensive coding practices for type safety and edge cases:
* It introduced parsing limits using a strict radix 10 `parseInt(req.params.id, 10)`.
* It added parameter verification using `isNaN(taskId)` across all lookup paths, responding with a `400 Bad Request` if a non-integer string is provided.
* It explicitly declared `.status(200)` on all successful reads instead of defaulting to implicit Express behavior, ensuring deterministic network responses.

### 2. What did it get wrong or quietly ignore?
The AI suffered from severe contextual blindness and skipped parts of the application scope:
* **Breaking Bug:** Inside the `PUT /tasks/:id` route, it forced the condition `if (title === undefined)`, which crashed partial updates with a `400 Bad Request` whenever a client attempted to toggle the status without providing the title text.
* **Missing Feature:** It completely omitted the custom calculated `/stats` endpoint that was built into the native version.

### 3. What did the prompt forget to specify?
The prompt omitted an explicit declaration for object schema key constraints and partial payload requirements. Because the prompt did not specify structural field names, the AI silently hijacked the data model—swapping the property name `done` out for `completed`. It also showed that if you do not explicitly state that `PUT` payloads should support optional properties, the AI will copy/paste strict validation logic from `POST` routes.

---

**Rematch Update:** I modified the specification prompt to explicitly define an update payload that allows partial schema fields, and constrained the property naming conventions to use `done`. The second generation script handled status updates correctly without throwing unexpected 400 errors.