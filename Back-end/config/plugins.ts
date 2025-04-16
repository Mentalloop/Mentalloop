export default ({ env }) => ({
  'users-permissions': {
    config: {
      // ./config/plugins.js
      jwtSecret: env('JWT_SECRET')
    },
  },
});