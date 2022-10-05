module.exports = {
  apps: [
    {
      script: 'server.js',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'DD/MM/YYYY HH:mm:ss:SSS',
      env_development: {
        name: 'sevenlake-api-dev',
        NODE_ENV: 'development'
      },
      env_staging: {
        name: 'sevenlake-api-staging',
        NODE_ENV: 'staging'
      },
    },
  ],
}
