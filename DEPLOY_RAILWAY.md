# Team Task Manager - Railway Deployment Quick Start

## 🚀 Deploy in 5 Steps

### Step 1: Prepare Your Repository
```bash
# Make sure everything is committed to git
git status
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Create Railway Project
1. Visit [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Connect GitHub and select your repository
4. Railway will auto-detect Node.js

### Step 3: Add MySQL Database
1. Click **"+ Add"** in your Railway project
2. Select **"MySQL"** from the marketplace
3. Wait ~2 minutes for provisioning
4. Note the connection details Railway creates

### Step 4: Set Environment Variables
Click your **Web Service** → **Variables** tab and add:

```
NODE_ENV=production
JWT_SECRET=change-this-to-a-secure-random-string
CORS_ORIGIN=https://your-app-name.railway.app
DB_DIALECT=mysql
```

**Railroad automatically provides:**
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DB_NAME`
- `DATABASE_URL`

### Step 5: Deploy
1. Go to **Deployments** tab
2. Click **"Deploy"** on the latest commit
3. Wait for build to complete (3-10 minutes)
4. Once deployed, click the domain link to access your app

## 📋 Configuration Summary

### Backend (`server.js`)
- ✅ Serves React frontend as static files
- ✅ Handles API routes at `/api/*`
- ✅ Uses environment variables for database
- ✅ CORS configured for production

### Frontend (`src/services/api.js`)
- ✅ Auto-detects API URL in production
- ✅ Uses `window.location.origin/api` for API calls
- ✅ Supports custom `REACT_APP_API_URL` environment variable

### Database (`config/db.js`)
- ✅ Supports Railway's MySQL connection variables
- ✅ Auto-creates tables on startup
- ✅ Connection pooling configured

## 🔐 Important Security Notes

1. **Change JWT_SECRET**: Generate a strong random string
   ```bash
   # Generate random secret in terminal:
   openssl rand -base64 32
   ```

2. **Use HTTPS only**: Railway provides SSL automatically

3. **Keep API keys safe**: Never commit `.env` files

4. **Set CORS properly**: Update `CORS_ORIGIN` to your domain

## 🧪 Testing After Deployment

1. **Check Health**: Visit `https://your-app.railway.app/api/health`
   - Should return: `{"success":true,"message":"Server is running"}`

2. **Test Signup**: Create a new account

3. **Test Login**: Log in with the created account

4. **Test Admin Functions**: Create projects and tasks

5. **Monitor Logs**: Use Railway dashboard's logs tab for debugging

## 📊 Common Deployment Times

- Initial build: 3-5 minutes
- Database setup: 1-2 minutes
- Total first deployment: 5-10 minutes
- Subsequent deployments: 2-3 minutes (if code unchanged)

## ❌ Troubleshooting

### Build Fails
- Check that both `package.json` files exist
- Ensure all dependencies are installed locally first
- Review build logs in Railway dashboard

### App Crashes Immediately
- Check database connection in logs
- Verify all environment variables are set
- Test database credentials work

### API Returns 404
- Ensure API routes are prefixed with `/api/`
- Check that backend is running on correct port
- Verify CORS settings

### Frontend Not Loading
- Build logs will show if React build failed
- Check `frontend/build` exists locally
- Verify `server.js` serves static files correctly

## 🎯 Next Steps

1. ✅ Deploy application
2. ✅ Test all features work
3. ✅ Set up custom domain (optional)
4. ✅ Configure monitoring alerts
5. ✅ Set up auto-deploy on git push (optional)

## 📚 Additional Resources

- [Full Deployment Guide](./RAILWAY_DEPLOYMENT.md)
- [Railway Documentation](https://docs.railway.app)
- [Environment Variables Reference](#-important-security-notes)

---

**App will be available at**: `https://your-project-name.railway.app`

Good luck! 🎉
