# Docker

This folder contains support files for container builds.

Use the root `docker-compose.yml` file to create a local development environment:

```bash
docker compose up --build
```

Services:
- `frontend` on port `3000`
- `backend` on port `5000`
- `nlp-service` on port `8000`
- `mongo` on port `27017`
