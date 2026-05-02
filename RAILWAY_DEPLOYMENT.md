# Railway Deployment Guide for Team Task Manager

## Prerequisites

1. **Railway Account**: Sign up at [Railway.app](https://railway.app)
2. **Git Repository**: Your project should be on GitHub
3. **Environment Variables**: Set up the required environment variables

## Deployment Steps

### Step 1: Create a Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Connect your GitHub account and select this repository
5. Railway will automatically detect the Node.js backend

### Step 2: Add MySQL Database Plugin

1. In your Railway project, click **"Add"** or **"+ New"**
2. Search for **"MySQL"** and select it
3. Wait for the database to be provisioned (usually 1-2 minutes)
4. Railway will automatically set environment variables:
   - `MYSQL_URL` - Complete connection string
   - `DATABASE_URL` - Also available
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DB_NAME`

### Step 3: Set Environment Variables

Click on your **Web Service** and go to the **Variables** tab. Add the following:

```
NODE_ENV=production
PORT=
DB_DIALECT=mysql
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=https://your-railway-domain.railway.app
```

**Important**: Railway provides `MYSQL_URL` automatically. The app is configured to use it.

### Step 4: Configure Database Connection (if needed)

The backend config is already set to use Railway's variables. If the default doesn't work, you can:

1. Use `MYSQL_URL` directly (format: `mysql://user:password@host:port/database`)
2. Or use individual variables: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB_NAME`

### Step 5: Build and Deploy

1. **Update Deploy Command**: Go to your service settings and ensure the start command is:
   ```
   npm start
   ```

2. **Build Settings**: Railway should auto-detect `package.json`. If not:
   - Build command: `npm run build && cd frontend && npm run build`
   - Or let Railway handle it automatically

3. The deployment will:
   - Install dependencies in `/backend`
   - Start the Node.js server
   - Serve the React frontend from the backend

### Step 6: Configure Frontend Build

Since both frontend and backend are served together:

1. The frontend will be built and served as static files
2. API requests will automatically use the same domain
3. Environment variables are set in the `Procfile` build process

## Connection String Examples

If using direct MySQL URL:
```
mysql://root:password@railway-mysql-host:3306/team_task_manager
```

## Troubleshooting

### Deployment Fails
- Check the **Deployments** tab for error logs
- Ensure all dependencies are listed in `package.json`
- Verify environment variables are set correctly

### Database Not Connecting
- Click on the MySQL plugin to view its environment variables
- Use the `MYSQL_URL` provided by Railway
- Check the connection pool settings in `backend/config/db.js`

### Frontend Not Loading
- Ensure the build is completed before deployment
- Check that `frontend/build/index.html` exists
- Verify CORS settings in `backend/server.js`

### API Endpoints Return 404
- Ensure the API routes are properly prefixed with `/api/`
- Check the backend logs for routing errors
- Verify the database is connected

## Production URL

Your application will be available at:
```
https://your-service-name.railway.app
```

This domain is provided by Railway. You can add a custom domain in the **Domains** settings.

## Post-Deployment Checklist

- [ ] Database is connected and synced
- [ ] Frontend loads correctly
- [ ] Login/Signup works
- [ ] API endpoints respond correctly
- [ ] JWT tokens are being issued
- [ ] Role-based access control works
- [ ] Tasks can be created and updated
- [ ] Projects can be managed

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| NODE_ENV | production | Yes |
| DB_HOST | From Railway MySQL | Yes |
| DB_USER | From Railway MySQL | Yes |
| DB_PASSWORD | From Railway MySQL | Yes |
| DB_NAME | From Railway MySQL | Yes |
| JWT_SECRET | Your secret key | Yes |
| PORT | (Auto-set by Railway) | No |
| CORS_ORIGIN | Your Railway domain | Yes |
| DB_DIALECT | mysql | Yes |

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [MySQL Connection Pooling](https://github.com/sequelize/sequelize)

## Support

For issues:
1. Check Railway deployment logs
2. Review backend logs with `railway logs`
3. Test API endpoints locally before deploying
4. Check database connection with the health endpoint: `/api/health`
