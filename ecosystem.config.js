module.exports = {
  apps: [{
    name: 'curriculum-crafter',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '-r tsx/register',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Performance settings
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    // Auto-restart settings
    watch: false,
    ignore_watch: ['node_modules'],
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Health check
    health_check_grace_period: 3000,
    // Restart policy
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
}; 