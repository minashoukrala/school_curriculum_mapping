# Aiven PostgreSQL Migration Guide

This guide will help you migrate your CurriculumCrafter application from Render PostgreSQL to Aiven PostgreSQL.

## ✅ Your Aiven Database Details

**Service Name**: `ecscurriculumdb`  
**Host**: `ecscurriculumdb-ecsdb.h.aivencloud.com`  
**Port**: `11045`  
**Database**: `defaultdb`  
**User**: `avnadmin`  
**Password**: `[Your Aiven Password]`  
**SSL**: `require`  

**Connection String**: 
```
postgresql://avnadmin:[Your Aiven Password]@ecscurriculumdb-ecsdb.h.aivencloud.com:11045/defaultdb?sslmode=require
```

## Why Migrate to Aiven?

- **Better free tier**: Aiven offers more generous free tier limits
- **No timeout issues**: Aiven services don't have the same timeout restrictions as Render
- **Better performance**: More reliable connection pooling and performance
- **Cost-effective**: Better pricing for production workloads

## Step 1: Set Up Aiven PostgreSQL

### 1.1 Create Aiven Account
1. Go to [Aiven.io](https://aiven.io)
2. Sign up for a free account
3. Verify your email

### 1.2 Create PostgreSQL Service
1. **Click "Create Service"**
2. **Select PostgreSQL** from the service types
3. **Choose your cloud provider** (AWS, GCP, Azure, etc.)
4. **Select a region** close to your users
5. **Choose a plan**:
   - **Free tier**: 1GB RAM, 10GB storage (good for development)
   - **Paid plans**: More resources for production
6. **Set service name**: `curriculum-crafter-db` (or your preferred name)
7. **Click "Create Service"**

### 1.3 Get Connection Details
Once your service is created:
1. **Go to the service overview page**
2. **Click "Connection Information"**
3. **Note down these details**:
   - **Host**: `your-service-name-your-project.aivencloud.com`
   - **Port**: Usually `12345` (custom port)
   - **Database**: `defaultdb`
   - **Username**: `avnadmin`
   - **Password**: (click "Show" to reveal)

## Step 2: Update Environment Variables

### 2.1 For Local Development
Update your `.env` file:

```bash
# Database Configuration
DB_TYPE=postgres
USE_SQLITE=false

# Aiven PostgreSQL Configuration
DATABASE_URL=postgresql://avnadmin:your_password@your-service-name-your-project.aivencloud.com:12345/defaultdb?sslmode=require

# Alternative: Individual variables
# DB_HOST=your-service-name-your-project.aivencloud.com
# DB_PORT=12345
# DB_NAME=defaultdb
# DB_USER=avnadmin
# DB_PASSWORD=your_password_here

# Environment
NODE_ENV=development
PORT=3000
```

### 2.2 For Production (Render)
Update your Render environment variables:

1. **Go to your Render dashboard**
2. **Select your web service**
3. **Go to "Environment" tab**
4. **Update these variables**:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://avnadmin:your_password@your-service-name-your-project.aivencloud.com:12345/defaultdb?sslmode=require
FRONTEND_URL=https://your-app-url.onrender.com
```

**Remove the old Render database variables**:
- `DB_HOST`
- `DB_PORT` 
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

## Step 3: Migrate Your Data

### 3.1 Export Data from Render
1. **Go to your Render PostgreSQL service**
2. **Use the connection details to export**:
   ```bash
   pg_dump "postgresql://curriculum_user:password@dpg-d2cn5a3uibrs738lgm40-a:5432/curriculum_crafter" > curriculum_backup.sql
   ```

### 3.2 Import Data to Aiven
1. **Use the Aiven connection details to import**:
   ```bash
   psql "postgresql://avnadmin:your_password@your-service-name-your-project.aivencloud.com:12345/defaultdb?sslmode=require" < curriculum_backup.sql
   ```

### 3.3 Alternative: Use Application Export/Import
1. **Export from your current app**:
   - Go to your app
   - Use the export functionality to download JSON backup
2. **Import to new database**:
   - Update environment variables
   - Use the import functionality to restore data

## Step 4: Test the Migration

### 4.1 Test Local Connection
```bash
# Start your application locally
npm run dev

# Check the logs for successful database connection
# Should see: "PostgreSQL database initialized successfully"
```

### 4.2 Test Production Deployment
1. **Deploy to Render** with new environment variables
2. **Check the deployment logs** for database connection success
3. **Test the application** functionality

## Step 5: Clean Up

### 5.1 Remove Render PostgreSQL Service
1. **Go to Render dashboard**
2. **Select your PostgreSQL service**
3. **Click "Delete"** (after confirming data migration)

### 5.2 Update Documentation
- Update any deployment guides
- Update team documentation
- Update monitoring/backup procedures

## Troubleshooting

### Connection Issues
- **SSL Mode**: Aiven requires SSL. Make sure `sslmode=require` is in your connection string
- **Firewall**: Ensure your IP is whitelisted in Aiven (if using IP restrictions)
- **Credentials**: Double-check username/password

### Performance Issues
- **Connection Pooling**: The app uses connection pooling (max 20 connections)
- **Indexes**: Database indexes are automatically created
- **Monitoring**: Use Aiven's monitoring dashboard to check performance

### Data Migration Issues
- **Schema Differences**: The app automatically creates tables if they don't exist
- **Encoding**: Ensure UTF-8 encoding for proper character handling
- **Backup**: Always keep a backup before migration

## Benefits After Migration

✅ **No more timeout issues**  
✅ **Better performance**  
✅ **More reliable connections**  
✅ **Better monitoring tools**  
✅ **Cost-effective scaling**  
✅ **24/7 availability**  

## Support

- **Aiven Documentation**: [https://docs.aiven.io/](https://docs.aiven.io/)
- **Aiven Support**: Available through their dashboard
- **Community**: Aiven has an active community forum

## Next Steps

1. **Monitor performance** for the first few days
2. **Set up automated backups** in Aiven
3. **Configure monitoring alerts** if needed
4. **Consider upgrading** to paid plan for production use
