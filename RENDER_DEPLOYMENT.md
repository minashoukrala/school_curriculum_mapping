# Render Deployment Guide

This guide will help you deploy your CurriculumCrafter application on Render with the decoupled frontend/backend architecture.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **PostgreSQL Database**: You'll need a PostgreSQL database (Render provides this)

## Step 1: Set Up PostgreSQL Database on Render

1. **Create a new PostgreSQL service**:
   - Go to your Render dashboard
   - Click "New" → "PostgreSQL"
   - Choose a name (e.g., `curriculum-crafter-db`)
   - Select your preferred region
   - Choose a plan (Free tier works for development)
   - Click "Create Database"

2. **Get your database credentials**:
   - Once created, go to your database dashboard
   - Copy the following information:
     - **Internal Database URL** (for backend)
     - **External Database URL** (for local development)
     - **Database Name**
     - **Username**
     - **Password**

## Step 2: Deploy the Backend API

1. **Create a new Web Service**:
   - Go to your Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Choose the repository containing your code

2. **Configure the Backend Service**:
   ```
   Name: curriculum-crafter-backend
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=your-postgres-host.render.com
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-username
   DB_PASSWORD=your-password
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```

4. **Deploy the Backend**:
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://curriculum-crafter-backend.onrender.com`)

## Step 3: Deploy the Frontend

1. **Create another Web Service**:
   - Go to your Render dashboard
   - Click "New" → "Web Service"
   - Connect the same GitHub repository

2. **Configure the Frontend Service**:
   ```
   Name: curriculum-crafter-frontend
   Root Directory: frontend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm run preview
   ```

3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy the Frontend**:
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://curriculum-crafter-frontend.onrender.com`)

## Step 4: Update Environment Variables

After both services are deployed, update the environment variables:

### Backend Environment Variables:
```
NODE_ENV=production
PORT=10000
DB_HOST=your-postgres-host.render.com
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### Frontend Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Step 5: Database Initialization

1. **Access your PostgreSQL database**:
   - Go to your database dashboard on Render
   - Use the "Connect" button to get connection details
   - You can use a tool like pgAdmin or DBeaver to connect

2. **Initialize the database**:
   - The backend will automatically create tables on first run
   - Or you can run the migration scripts manually

## Step 6: Test Your Deployment

1. **Test the Backend API**:
   ```
   curl https://your-backend-url.onrender.com/health
   ```

2. **Test the Frontend**:
   - Visit your frontend URL in a browser
   - Check that it can communicate with the backend

## Important Notes

### CORS Configuration
The backend is already configured to accept requests from the frontend URL. Make sure the `FRONTEND_URL` environment variable is set correctly.

### Database Connection
- Use the **Internal Database URL** for the backend (faster, more secure)
- Use the **External Database URL** for local development

### Environment Variables Priority
1. Render environment variables (production)
2. `.env` files (development)
3. Default values

### Scaling
- **Free tier**: Services may sleep after inactivity
- **Paid tiers**: Services stay running 24/7
- **Database**: Consider upgrading for production use

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify the build commands are correct

2. **Database Connection Issues**:
   - Verify database credentials
   - Check if the database is accessible from your service
   - Ensure the database is running

3. **CORS Errors**:
   - Verify `FRONTEND_URL` is set correctly
   - Check that the frontend URL matches exactly

4. **API Communication Issues**:
   - Verify `VITE_API_URL` is set correctly
   - Check that the backend is running
   - Test the API endpoints directly

### Logs and Debugging:
- Use Render's built-in logging to debug issues
- Check both frontend and backend logs
- Monitor database connections

## Production Considerations

1. **Security**:
   - Use environment variables for all sensitive data
   - Enable HTTPS (automatic on Render)
   - Consider adding authentication

2. **Performance**:
   - Enable caching where appropriate
   - Monitor database performance
   - Consider CDN for static assets

3. **Monitoring**:
   - Set up health checks
   - Monitor error rates
   - Track response times

## Support

If you encounter issues:
1. Check Render's documentation
2. Review the build and runtime logs
3. Test locally to isolate issues
4. Contact Render support if needed

Your application should now be fully deployed and accessible via the frontend URL!
