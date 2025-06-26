## Document ingestion

# NestJS Backend – User & Document Management System

A backend service built with **NestJS** to manage user authentication, document management, and ingestion controls. Designed with clean architecture, role-based access control (RBAC), and integration-ready endpoints.

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
| GET | `/user/all` | get all users |
| GET | `/user/id` | get user by id |
| POST | `/auth/login` | Login with JWT |

🧾 User Creation Note

When creating a user via the /register API, two roles are already pre-configured:
- Admin
- Viewer

Please provide a valid role ID when creating a user. You can use one of the following role IDs:

adminRoleId: ``b976f3c4-5551-4a23-82fd-23138abf5da2``

viewerRoleId: ``c56db4c0-1350-493a-a2d9-dc091d2c3019``

📌 Replace the role ID in your request body like so:

``` json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "securePassword123",
  "roleId": "adminRoleId"
}
```
If you're not sure which role ID to use, check your database or the role seeding logic.


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
