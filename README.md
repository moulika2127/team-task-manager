# Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## Tech Stack

- **Frontend**: React.js, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Deployment**: Railway (optional)

## Features

### Authentication
- User signup and login
- JWT token-based authentication
- Password hashing with bcryptjs

### Admin Features
- Create and manage projects
- Add/remove team members
- Create and assign tasks
- Update task status
- Delete projects and tasks
- View comprehensive dashboard with statistics

### Member Features
- View assigned projects
- View assigned tasks
- Update task status for their assigned tasks
- View personal dashboard

### Task Management
- Create tasks with:
  - Title and description
  - Project association
  - User assignment
  - Status (Pending, In Progress, Completed)
  - Priority (Low, Medium, High)
  - Due date
- Track task progress
- Filter tasks by project

## Project Structure

```
Team Task Manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── ProjectMember.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Projects.js
│   │   │   ├── Tasks.js
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Projects.css
│   │   │   └── Tasks.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── README.md
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (local or remote server)
- npm or yarn

### Backend Setup

1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=team_task_manager
   DB_DIALECT=mysql
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   ```

5. Make sure MySQL is running

6. Start the server
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the application
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
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

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=team_task_manager
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Testing the Application

### Test Accounts (Create new accounts in signup)

1. Create an Admin account
2. Create a Member account
3. Admin can:
   - Create projects
   - Add members to projects
   - Create tasks
   - Assign tasks to members
   - View dashboard

4. Member can:
   - View assigned projects
   - View assigned tasks
   - Update task status

## Deployment

### Deploying to Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy backend and frontend as separate services
4. Update frontend API URL to point to production backend

## Future Enhancements

- Email notifications for task assignments
- File attachments on tasks
- Task comments and activity log
- Advanced filtering and search
- Mobile app version
- Dark mode
- Real-time updates with WebSocket
- Team chat feature
- Advanced reporting

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
