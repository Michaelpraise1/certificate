module.exports = {
  apps: [
    {
      name: "react-app",
      script: "npx",
      args: "serve --name 'gada-certify' -- -s dist -l 3005",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
