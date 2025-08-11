# Render Deployment Guide (Combined Approach)

This guide will help you deploy your CurriculumCrafter application on Render with a combined frontend/backend service and PostgreSQL database, staying within the 2 free service limit.

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

## Step 2: Deploy Combined Frontend + Backend Service

1. **Create a new Web Service**:
   - Go to your Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Choose the repository containing your code

2. **Configure the Combined Service**:
   ```
   Name: curriculum-crafter-app
   Root Directory: render-deploy
   Runtime: Node
   Build Command: npm install && npm run build
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
   FRONTEND_URL=https://your-app-url.onrender.com
   ```

4. **Deploy the Combined Service**:
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://curriculum-crafter-app.onrender.com`)

## How It Works

The combined service:
- **Builds the frontend** into static files during deployment
- **Serves the API** at `/api/*` endpoints
- **Serves the frontend** at all other routes
- **Handles SPA routing** by serving `index.html` for non-API routes

## Environment Variables

### Combined Service Environment Variables:
```
NODE_ENV=production
PORT=10000
DB_HOST=dpg-d2cn5a3uibrs738lgm40-a
DB_PORT=5432
DB_NAME=curriculum_crafter
DB_USER=curriculum_user
DB_PASSWORD=S1uSM90oEdpwT6bnMZWUi4hGhx8fOz6j
FRONTEND_URL=https://your-app-url.onrender.com
```

## Step 3: Test Your Deployment

1. **Test the API**:
   ```
   curl https://your-app-url.onrender.com/health
   curl https://your-app-url.onrender.com/api/curriculum/all
   ```

2. **Test the Frontend**:
   - Visit your app URL in a browser
   - The frontend should load and communicate with the API

## Benefits of This Approach

1. **Uses only 2 free services**: PostgreSQL + Combined App
2. **Simpler deployment**: One service to manage
3. **Better performance**: No CORS issues between frontend/backend
4. **Cost-effective**: Stays within free tier limits

## Important Notes

### CORS Configuration
The combined service doesn't need CORS since everything is served from the same origin.

### Database Connection
- Use the **Internal Database URL** for faster, more secure connections
- The database credentials are ready to use from your PostgreSQL setup

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

3. **Frontend Not Loading**:
   - Check if the build completed successfully
   - Verify the static files are being served
   - Check the server logs

4. **API Communication Issues**:
   - Test the API endpoints directly
   - Check that the routes are properly registered
   - Monitor server logs

### Logs and Debugging:
- Use Render's built-in logging to debug issues
- Check both frontend and backend logs in the same service
- Monitor database connections

## Production Considerations

1. **Security**:
   - Use environment variables for all sensitive data
   - Enable HTTPS (automatic on Render)
   - Consider adding authentication

2. **Performance**:
   - Enable compression (already configured)
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

Your application should now be fully deployed and accessible via the combined service URL!
