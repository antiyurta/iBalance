module.exports = {
  apps: [
    {
      name: "iBalanceFront",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: 3002,
      },
      env_local: {
        APP_ENV: "local", // APP_ENV=local
      },
      env_development: {
        APP_ENV: "dev", // APP_ENV=dev
      },
      env_production: {
        APP_ENV: "prod", // APP_ENV=prod
      },
    },
  ],
};
