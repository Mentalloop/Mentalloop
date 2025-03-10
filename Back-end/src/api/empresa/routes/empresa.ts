export default {
    routes: [
      {
        method: "POST",
        path: "/empresa/login",
        handler: "empresa.login",
        config: {
          auth: false, // Se precisar de autenticação, mudar para true
          policies: [],
          middlewares: [],
        },
      },
      {
        method: "GET",
        path: "/empresas", // Substitua pelo endpoint que você deseja
        handler: "empresa.find",
        config: {
          auth: false,
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  