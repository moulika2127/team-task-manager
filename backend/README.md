# Team Task Manager - Backend

Backend API for Team Task Manager application built with Node.js, Express.js, and MySQL with Sequelize ORM.

## Installation

1. Navigate to backend folder
   ```
   cd backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Update `.env` with your MySQL database credentials
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=team_task_manager
   DB_DIALECT=mysql
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   ```

5. Make sure MySQL server is running

## Running the Server

```bash
npm start        # Production
npm run dev       # Development (with nodemon)
```

## Database Setup

The database tables are automatically created when the server starts (using Sequelize sync).

**Tables created:**
- `users` - User accounts with roles (admin/member)
- `projects` - Project records
- `project_members` - Many-to-many relationship between projects and members
- `tasks` - Task records
- `project_members` - Project membership tracking

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create project (Admin)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/:id/members` - Add member (Admin)
- `DELETE /api/projects/:id/members/:memberId` - Remove member (Admin)

### Tasks
- `POST /api/tasks` - Create task (Admin)
- `GET /api/tasks` - Get tasks
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin)
- `GET /api/tasks/dashboard/stats` - Get dashboard stats (Admin)

## Tech Stack

- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Environment Variables

See `.env.example` for all required environment variables.
