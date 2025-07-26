# Deployment Guide

This guide covers deploying CurriculumCrafter to various platforms.

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/CurriculumCrafter.git
cd CurriculumCrafter

# Install dependencies
npm install

# Start development server
npm run dev
```

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Vercel will automatically detect the project structure

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Environment Variables**
   - No additional environment variables required for basic deployment

4. **Deploy**
   - Vercel will automatically deploy on every push to main branch

### Option 2: Netlify

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist/public`

3. **Deploy**
   - Netlify will automatically deploy on every push

### Option 3: Railway

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure**
   - Railway will automatically detect the Node.js project
   - Set the start command to: `npm start`

3. **Deploy**
   - Railway will automatically deploy on every push

### Option 4: Render

1. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository

2. **Build Settings**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Deploy**
   - Render will automatically deploy on every push

## Manual Server Deployment

### Using PM2 (Production)

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Monitor the application
pm2 monit

# View logs
pm2 logs
```

### Using Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build and Run**
```bash
docker build -t curriculumcrafter .
docker run -p 3000:3000 curriculumcrafter
```

## Environment Configuration

### Production Environment Variables

```bash
NODE_ENV=production
PORT=3000
```

### Database Configuration

The application uses SQLite by default, which is perfect for:
- Small to medium deployments
- Single-server setups
- Development and testing

For larger deployments, consider:
- Using a managed SQLite service
- Implementing database backups
- Setting up monitoring

## Performance Optimization

### Built-in Optimizations
- **React Query**: Efficient data fetching and caching
- **Vite**: Fast build times and optimized bundles
- **Tailwind CSS**: Purged CSS for minimal bundle size
- **SQLite**: Fast, reliable database operations

### Additional Optimizations
- **CDN**: Use a CDN for static assets
- **Caching**: Implement Redis for session caching (if needed)
- **Compression**: Enable gzip compression on your server
- **Monitoring**: Set up application monitoring

## Security Considerations

### Built-in Security
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper CORS setup
- **Error Handling**: Secure error responses

### Additional Security
- **HTTPS**: Always use HTTPS in production
- **Rate Limiting**: Implement rate limiting if needed
- **Security Headers**: Add security headers
- **Regular Updates**: Keep dependencies updated

## Backup and Recovery

### Database Backup
The application includes built-in export/import functionality:
- **Export**: Download complete database backup
- **Import**: Restore from backup file
- **Automatic**: Backups include all data and structure

### Manual Backup
```bash
# Copy the database file
cp curriculum.db curriculum.db.backup

# Or use SQLite backup
sqlite3 curriculum.db ".backup curriculum.db.backup"
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database Locked**
   ```bash
   # Check for database locks
   sqlite3 curriculum.db "PRAGMA busy_timeout = 5000;"
   ```

3. **Build Failures**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs
- **Development**: Logs appear in the terminal
- **Production**: Use PM2 logs or your hosting platform's log viewer

## Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/yourusername/CurriculumCrafter/issues)
2. Review the [README.md](README.md) for setup instructions
3. Check the [CHANGELOG.md](CHANGELOG.md) for recent changes

---

**CurriculumCrafter** - Simple deployment for a powerful curriculum management system. 