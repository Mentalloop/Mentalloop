import { factories } from "@strapi/strapi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default factories.createCoreController("api::empresa.empresa", ({ strapi }) => ({
  async login(ctx) {
    const { email, senha } = ctx.request.body;

    if (!email || !senha) {
      return ctx.badRequest("E-mail e senha são obrigatórios");
    }

    // Buscar empresa pelo e-mail
    const empresa = await strapi.db.query("api::empresa.empresa").findOne({
      where: { email },
    });

    if (!empresa) {
      return ctx.badRequest("Empresa não encontrada");
    }

    // Validar a senha (caso esteja criptografada, usar bcrypt)
    const isValidPassword = await bcrypt.compare(senha, empresa.senha);

    if (!isValidPassword) {
      return ctx.badRequest("Credenciais inválidas");
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: empresa.id, email: empresa.email },
      strapi.config.get("plugin.users-permissions.jwtSecret"),
      { expiresIn: "7d" }
    );

    return ctx.send({ token, empresa });
  },

  async find(ctx) {
    // Buscar todas as empresas
    const empresas = await strapi.db.query("api::empresa.empresa").findMany();
    ctx.send(empresas);
  },
}));
