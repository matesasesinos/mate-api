export default () => ({
    environment: process.env.APP_ENVIRONMENT || 'local',
    apiKey: process.env.API_KEY || 'sk_test_51Nx8K9LmP2qR4vW7yT3hJ6kL9mN2pQ5',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  });

  