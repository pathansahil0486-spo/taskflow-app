# Todo App - Frontend (React)

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set REACT_APP_API_URL to your backend URL
```

### 3. Run the app
```bash
# Development
npm start

# Production build
npm run build
```

The app will open at **http://localhost:3000**

---

## 📁 Project Structure

```
src/
├── components/
│   ├── FilterBar.js          # Search + filter controls
│   ├── FilterBar.module.css
│   ├── LoadingSpinner.js     # Full-screen / inline spinner
│   ├── Navbar.js             # Top navigation with user menu
│   ├── Navbar.module.css
│   ├── StatsBar.js           # Task statistics + progress bar
│   ├── StatsBar.module.css
│   ├── TodoForm.js           # Create / Edit modal form
│   ├── TodoForm.module.css
│   ├── TodoItem.js           # Single todo row
│   └── TodoItem.module.css
├── context/
│   ├── AuthContext.js        # Auth state (login/register/logout)
│   └── TodoContext.js        # Todo CRUD + filter state
├── pages/
│   ├── AuthPage.module.css   # Shared styles for Login & Register
│   ├── DashboardPage.js      # Main todo list view
│   ├── DashboardPage.module.css
│   ├── LoginPage.js
│   ├── ProfilePage.js        # Edit profile + change password
│   ├── ProfilePage.module.css
│   └── RegisterPage.js
├── utils/
│   └── api.js                # Axios instance + all API calls
├── App.js                    # Router + providers
├── index.css                 # Global design system
└── index.js                  # React entry point
```

## ✨ Features

- **Authentication** — Register, login, JWT-protected routes
- **Dashboard** — View all tasks with greeting and stats
- **Create / Edit Tasks** — Title, description, priority, category, due date
- **Filters** — By status (all/pending/done), priority, category, search
- **Bulk Actions** — Complete all, clear completed
- **Profile Page** — Edit name, change password
- **Responsive** — Works on mobile, tablet, desktop
- **Dark theme** — Premium dark UI with smooth animations

## 🔧 Key Dependencies

| Package | Purpose |
|---------|---------|
| react-router-dom | Client-side routing |
| axios | HTTP requests to backend |
| react-hot-toast | Toast notifications |
| date-fns | Date formatting |
