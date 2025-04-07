module.exports = {
  apps: [{
    name: 'geometr-landing',
    script: 'npm',
    args: 'run dev',
    watch: true,
    env: {
      NODE_ENV: 'development',
    }
  }]
} 