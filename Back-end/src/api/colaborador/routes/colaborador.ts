export default {
  routes: [
    {
      method: "POST",
      path: "/colaborador/login",
      handler: "colaborador.login",
      config: {
        auth: false, // Se precisar de autenticação, mudar para true
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/colaboradores", // Substitua pelo endpoint que você deseja
      handler: "colaborador.find",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/colaborador/logged-tasks',
      handler: 'colaborador.findLoggedUserTasks',
      config: {
        auth: {}, // Apenas usuários autenticados podem acessar
      },
    },
    
  ],
};
