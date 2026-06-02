module.exports = {
  apps: [
    {
      name: "gada-certify",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3005
      }
    }
  ]
};