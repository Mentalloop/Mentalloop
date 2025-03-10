export default ({ env }) => ({
    // Outras configurações de plugins, se houver
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET'),
      },
    },
  });
  