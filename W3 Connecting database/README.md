# FlyRank Backend Internship: Task API (SQLite Integration)

This is a RESTful API for managing tasks, built with Express.js. In this week's iteration, the storage layer has been upgraded from in-memory arrays to a persistent SQLite database.

## How to Run the Project

To run this project from a clean clone, execute the following commands in your terminal:

```bash
npm install
node index.js
The server will start on http://localhost:3000.
```

## Database Architecture
Why SQLite was chosen: SQLite was chosen because it operates as a single file, requires zero separate server setup, and ensures that data survives server restarts.

Where the database lives: The data is stored locally in a file named tasks.db. This file is created automatically the first time the application runs. It is explicitly added to .gitignore so that anyone cloning the repository starts with a fresh database, and the initial seed script will automatically populate it with three starter tasks.

## SQL Exploration
During development, I interacted with the database directly using DB Browser for SQLite.

One of the queries I ran manually was:

``` bash
SELECT COUNT(*) FROM tasks;
```
Result: This query returned the total integer count of all rows currently existing in the tasks table, proving that the database was accurately tracking the API's input. 


## Database Proof
Below is a screenshot of the tasks.db file opened in DB Browser, displaying the table structure and current rows:

![DB Browser Screenshot](./screenshot.png)


## AI vs Me

## 🤖 Stage 6: The AI Rematch

**The Prompt I Used:**
> "Act as a senior Node.js backend engineer. Migrate an existing in-memory Express.js CRUD API for a task list to a persistent SQLite database using the better-sqlite3 library. 
> Strict Specifications: Auto-create a tasks.db file and a tasks table if missing. Check the row count on startup and seed 3 tasks only if empty. Implement GET, POST, PUT, and DELETE endpoints. Strictly use parameterized queries (?) for all variables. Return a 404 HTTP status for unknown IDs, and a 400 status for invalid titles."

**Code Review:**
After running `git diff --no-index index.js ai-version/index.js`, I found three key differences:
1. **Missing Documentation:** The AI completely removed my Swagger/OpenAPI setup (`swagger-ui-express`). Because I forgot to specify it in my prompt, the AI stripped it out entirely.
2. **Path Resolution:** The AI used Node's built-in `path` module (`path.join(__dirname, 'tasks.db')`) to create an absolute path for the database file.
3. **Environment Variables:** The AI implemented `const PORT = process.env.PORT || 3000;`, whereas I had hardcoded the port to `3000`.