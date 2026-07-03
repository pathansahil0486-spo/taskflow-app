# Todo App - Backend API

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your MongoDB URI and JWT secret
```

### 3. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user (protected) |
| PUT | /api/auth/profile | Update profile (protected) |
| PUT | /api/auth/password | Change password (protected) |

### Todos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all todos (with filters) |
| POST | /api/todos | Create new todo |
| GET | /api/todos/:id | Get single todo |
| PUT | /api/todos/:id | Update todo |
| DELETE | /api/todos/:id | Delete todo |
| DELETE | /api/todos/completed/clear | Clear all completed |
| PUT | /api/todos/toggle-all | Toggle all complete |
| GET | /api/todos/categories | Get all categories |

### Query Parameters (GET /api/todos)
- `completed` - true/false
- `priority` - low/medium/high
- `category` - category name
- `search` - search title
- `sort` - field to sort by (default: -createdAt)
- `page` - page number
- `limit` - items per page

## 🔐 Authentication
All todo routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```
