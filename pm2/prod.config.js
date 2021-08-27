const path = require("path")

require("dotenv").config({ path: "../.env" })

module.exports = {
  apps: [
    {
      name: "Webahead library backend",
      script: path.resolve(__dirname, "../src", "run-server.js"),
      out_file: path.resolve(__dirname, "../", "logs", "output-pm2.log"),
      error_file: path.resolve(__dirname, "../", "logs", "error-pm2.log"),
      merge_logs: true,
      autorestart: true,
      min_uptime: 10000,
      max_restarts: 5,
      watch: false,
    },
  ],
}
