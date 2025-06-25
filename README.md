## Document ingestion

# NestJS Backend – User & Document Management System

A backend service built with **NestJS** to manage user authentication, document management, and ingestion controls. Designed with clean architecture, role-based access control (RBAC), and integration-ready endpoints to communicate with a Python ingestion service.

---

## 🚀 Features

### ✅ Authentication

- User registration, login, and logout
- JWT-based authentication
- Role-based access control

### ✅ Document Management

- Create, read, update, and delete documents
- Upload documents (file buffer storage supported)

### ✅ Ingestion System

- **Trigger ingestion** manually via API (or webhook)
- **Track ingestion status** and view content if completed

---

## 🛠️ Tech Stack

| Layer | Tools / Libraries |
| --- | --- |
| Backend Framework | [NestJS](https://nestjs.com/) |
| Language | TypeScript |
| Auth | JWT (Passport.js) |
| DB  | PostgreSQL |
| ORM | Prisma |
| Architecture | Modular (supporting microservices) |

---

Install dependencies:

```bash
cd document-ingestion
npm install
```

Setup environment variables:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
JWT_SECRET="secretKey"
```

Run prisma migrations and seed

```bash
npm run prisma:migration:deploy
npm run prisma:generate
npm run prisma:seed
```

To start the server:

```bash
npm run start:dev
```

## 📦 API Overview

### 🔐 Auth APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/user/register` | Register a user |
| POST | `/auth/login` | Login with JWT |

### 📄 Document APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/document/upload` | Create/upload document |
| GET | `/document/:id` | Get a specific document |
| PATCH | `/document/:id` | Update document |

### 🔄 Ingestion APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/ingestion/:id` | Get parsed content and status |

## 🧩 Future Enhancements

- Integration with external storage (S3, GCP)
  
- Multi-tenant document support
  
- Implementing gRPC for other service communication