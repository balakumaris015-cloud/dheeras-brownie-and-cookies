module.exports = {
  apps: [
    {
      name: "dheeras-bakery-api",
      script: "backend/src/server.js",
      cwd: "/var/www/dheeras-brownie-and-cookies",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      },
      error_file: "/var/log/dheeras-bakery-api/error.log",
      out_file: "/var/log/dheeras-bakery-api/output.log",
      time: true
    }
  ]
};
