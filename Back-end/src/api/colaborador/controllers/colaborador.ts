import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import jwt from 'jsonwebtoken';

export default factories.createCoreController('api::colaborador.colaborador', ({ strapi }) => ({
    async login(ctx: Context) {
        const { email, senha } = ctx.request.body;

        if (!email || !senha) {
            return ctx.badRequest('Email e senha são obrigatórios');
        }

        const colaborador = await strapi.query('api::colaborador.colaborador').findOne({
            where: { email },
            populate: { empresa: true, tasks: true }, // Popula a relação com a empresa e tasks
        });

        if (!colaborador) {
            return ctx.badRequest('Colaborador não encontrado');
        }

        const validPassword = await strapi
            .service('plugin::users-permissions.user')
            .validatePassword(senha, colaborador.senha);

        if (!validPassword) {
            return ctx.badRequest('Senha inválida');
        }

        // Adiciona o ID da empresa no token
        const token = jwt.sign(
            { id: colaborador.id, empresaId: colaborador.empresa?.id },
            strapi.config.get('plugin.users-permissions.jwtSecret'),
            { expiresIn: '1d' }
        );

        ctx.send({ token, colaborador });
    },

    async find(ctx: Context) {
        const token = ctx.request.headers.authorization?.split(' ')[1];

        if (!token) {
            return ctx.unauthorized('Token não fornecido');
        }

        try {
            const decoded = jwt.verify(
                token,
                strapi.config.get('plugin.users-permissions.jwtSecret')
            ) as jwt.JwtPayload; // Garante que decoded é um objeto

            const empresaId = decoded?.empresaId;

            if (!empresaId) {
                return ctx.unauthorized('Empresa não encontrada no token');
            }

            // Busca colaboradores apenas da empresa vinculada ao usuário logado
            const colaboradores = await strapi.db.query('api::colaborador.colaborador').findMany({
                where: { empresa: empresaId },
                populate: {
                    supervisor: true,
                    departamento: true,
                    tasks: true,
                },
            });

            ctx.send({ colaboradores });
        } catch (error) {
            return ctx.unauthorized('Token inválido');
        }
    },

    async findLoggedUserTasks(ctx: Context) {
        const token = ctx.request.headers.authorization?.split(' ')[1];
    
        if (!token) {
            return ctx.unauthorized('Token não fornecido');
        }
    
        try {
            const decoded = jwt.verify(
                token,
                strapi.config.get('plugin.users-permissions.jwtSecret')
            ) as jwt.JwtPayload;
    
            const colaboradorId = decoded?.id; // Recupera o ID do colaborador do token
    
            if (!colaboradorId) {
                return ctx.unauthorized('Colaborador não encontrado no token');
            }
    
            // Busca o colaborador logado e popula suas tasks
            const colaborador = await strapi.db.query('api::colaborador.colaborador').findOne({
                where: { id: colaboradorId },
                populate: {
                    tasks: true, // Popula as tasks relacionadas
                },
            });
    
            if (!colaborador) {
                return ctx.notFound('Colaborador não encontrado');
            }
    
            ctx.send({ colaborador });
        } catch (error) {
            console.error(error);
            return ctx.unauthorized('Token inválido');
        }
    },    
}));
