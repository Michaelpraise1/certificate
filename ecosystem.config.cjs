module.exports = {
  apps: [
    {
      name: "gada-certify",
      script: "npx",
      args: "serve --name 'gada-certify' -- -s dist -l 3005",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
