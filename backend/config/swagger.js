// src/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários',
      version: '1.0.0',
      description: 'API para gerenciamento de usuários com autenticação Firebase',
      contact: {
        name: 'Suporte',
        email: 'suporte@exemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT do Firebase Authentication'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            id_firebase: { type: 'string', example: 'abc123def456' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            data_nascimento: { type: 'string', format: 'date', example: '1990-01-01' }
          }
        },
        UsuarioInput: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            senha: { type: 'string', example: '123456' },
            data_nascimento: { type: 'string', format: 'date', example: '1990-01-01' }
          }
        },
        UsuarioUpdate: {
          type: 'object',
          properties: {
            nome: { type: 'string', example: 'João Silva Atualizado' },
            email: { type: 'string', example: 'joao.novo@email.com' }
          }
        },
        Erro: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' }
          }
        }
      }
    },
    tags: [
      { name: 'Usuários', description: 'Operações relacionadas a usuários' }
    ]
  },
  apis: ['./src/server.js'], // Aponta para seu server.js
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };