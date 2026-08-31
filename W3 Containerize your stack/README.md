run command:
docker run --name taskdb -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=tasks \
 -p 5432:5432 -v taskdata:/var/lib/postgresql/

 