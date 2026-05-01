# Copilot Instructions for Team Task Manager

## Project Overview
Team Task Manager is a full-stack web application built with React (frontend) and Node.js/Express (backend) for managing team projects and tasks with role-based access control.

## Tech Stack
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, MySQL, Sequelize ORM
- **Authentication**: JWT with bcryptjs password hashing
- **Database**: MySQL

## Project Structure
- `backend/` - Node.js/Express REST API
- `frontend/` - React.js single-page application
- `README.md` - Main project documentation

## Getting Started

### Backend
1. Navigate to `backend/` directory
2. Run `npm install`
3. Create `.env` file from `.env.example`
4. Update `.env` with MySQL database credentials:
   - DB_HOST: localhost (or your MySQL server)
   - DB_USER: root (or your MySQL user)
   - DB_PASSWORD: your_password
   - DB_NAME: team_task_manager
5. Run `npm run dev` to start development server (port 5000)

### Frontend
1. Navigate to `frontend/` directory
2. Run `npm install`
3. Run `npm start` (port 3000)

## Key Features to Maintain

### Authentication
- JWT-based authentication with Bearer tokens
- Password hashing with bcryptjs
- Role-based access control (Admin/Member)

### Admin Capabilities
- Create/manage projects
- Add/remove team members
- Create/assign/manage tasks
- View comprehensive dashboard

### Member Capabilities
- View assigned projects/tasks
- Update only their task status
- View personal dashboard

### Database Models
- User: id, name, email, password (hashed), role
- Project: id, name, description, adminId
- ProjectMember: id, projectId, userId (many-to-many)
- Task: id, title, description, projectId, assignedToId, status, priority, dueDate, createdById

## API Structure
All API endpoints are prefixed with `/api/` and follow RESTful conventions:
- `/api/auth/` - Authentication routes
- `/api/projects/` - Project management routes
- `/api/tasks/` - Task management routes

## Development Guidelines
- Use Sequelize ORM for database operations
- Use middleware for authentication protection and role authorization
- Validate all input data on both frontend and backend
- Implement proper error handling and status codes
- Use environment variables for sensitive configuration
- Follow RESTful API design principles

## Common Tasks
- To add a new feature: Create model, controller, routes, then frontend components
- To modify authentication: Update middleware/auth.js and context/AuthContext.js
- To add new routes: Create in routes/ directory and import in server.js
- To modify database: Update Sequelize model and run server (auto-sync)

## Testing Workflow
1. Start backend: `npm run dev` in backend directory
2. Start frontend: `npm start` in frontend directory
3. Create test accounts through signup
4. Test both admin and member roles
5. Verify role-based access restrictions work correctly
