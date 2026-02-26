/**
 * PM2 Ecosystem Configuration
 *
 * This file configures PM2 process manager for the Next.js AI Chatbot.
 * PM2 handles process monitoring, auto-restart, and log management.
 *
 * Usage:
 *   pnpm pm2:start    - Start the dev server with PM2
 *   pnpm pm2:stop     - Stop the PM2-managed process
 *   pnpm pm2:logs     - View logs in real-time
 *   pnpm pm2:status   - Check process status
 *
 * Logs are written to the logs/ directory in the project root.
 */
module.exports = {
  apps: [
    {
      name: "dev-server",
      // Run Next.js CLI directly so PM2 captures all logs properly.
      // Points to the JS entry point, not the shell wrapper in .bin/
      script: "./node_modules/next/dist/bin/next",
      args: ["dev", "--turbo"],
      cwd: ".",
      watch: false,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      log_type: "raw",
      error_file: "logs/dev-error.log",
      out_file: "logs/dev-out.log",
      log: "logs/dev-combined.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,
    },
  ],
};
