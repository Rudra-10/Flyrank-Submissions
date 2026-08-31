# W3 Assignment: Containerize Your Stack (Task API)

A Task CRUD API backed by a PostgreSQL database running in a Docker container.

---

## Stage 0: A Real Database in One Command

### 1. Start Postgres in Docker with persistent volume
Run the official PostgreSQL container in the background with persistent volume `taskdata`:

```bash
docker run --name taskdb -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=tasks -p 5432:5432 -v taskdata:/var/lib/postgresql/data -d postgres
```

### 2. Verify Database Container
Check that the container is running:
```bash
docker ps
```

Open a `psql` interactive prompt inside the container:
```bash
docker exec -it taskdb psql -U postgres -d tasks
```
Inside psql, check tables and exit:
```sql
\dt
\q
```

### Stage 0 Git Commit
```bash
git add .gitignore README.md
git commit -m "Stage 0: Postgres in Docker + gitignore"
```

---

## Stage 1: Connect Your App (Secret, Driver, Table)

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
`.env` contents:
```env
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
PORT=3000
```

### 2. Install Dependencies & Start App
```bash
npm install
npm start
```

### 3. Verification & Checkpoints
- **Startup Connection**: The server connects to PostgreSQL via `DATABASE_URL` with no error.
- **Auto Table Creation & Seeding**: The `tasks` table is automatically created (`id SERIAL PRIMARY KEY, title TEXT, done BOOLEAN`) and seeded with 3 initial tasks only if empty.
- **Check via psql**:
  ```bash
  docker exec -it taskdb psql -U postgres -d tasks -c "\dt"
  docker exec -it taskdb psql -U postgres -d tasks -c "SELECT * FROM tasks;"
  ```
- **Restarting verification**: Restart the app multiple times (`npm start`); verify that the row count remains exactly 3.

### Stage 1 Git Commit
```bash
git add .
git commit -m "Stage 1: connect via .env and create table"
```
