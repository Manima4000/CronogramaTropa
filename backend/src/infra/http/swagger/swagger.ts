import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cronograma Tropa API',
      version: '1.0.0',
      description: 'API para gerenciamento de cronogramas de estudos integrada com MemberKit',
      contact: {
        name: 'Cronograma Tropa',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    tags: [
      {
        name: 'Schedules',
        description: 'Gerenciamento de cronogramas de estudos',
      },
      {
        name: 'Sync',
        description: 'Sincronização de dados do MemberKit',
      },
    ],
    components: {
      schemas: {
        Schedule: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do cronograma',
            },
            title: {
              type: 'string',
              description: 'Título do cronograma',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Descrição do cronograma',
            },
            courseId: {
              type: 'string',
              description: 'ID do curso',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de início',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de término',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        ScheduleItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do item',
            },
            scheduleId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do cronograma',
            },
            lessonId: {
              type: 'string',
              description: 'ID da aula',
            },
            scheduledDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data agendada',
            },
            duration: {
              type: 'integer',
              description: 'Duração em minutos',
            },
            completed: {
              type: 'boolean',
              description: 'Se foi concluída',
            },
          },
        },
        CreateScheduleRequest: {
          type: 'object',
          required: ['title', 'startDate', 'endDate', 'items'],
          properties: {
            title: {
              type: 'string',
              description: 'Título do cronograma',
              example: 'Cronograma de Python',
            },
            description: {
              type: 'string',
              description: 'Descrição do cronograma',
              example: 'Cronograma para aprender Python em 30 dias',
            },
            courseId: {
              type: 'integer',
              nullable: true,
              description: 'ID do curso (opcional para cronogramas manuais)',
              example: null,
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de início',
              example: '2025-01-01T00:00:00Z',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de término',
              example: '2025-01-31T23:59:59Z',
            },
            items: {
              type: 'array',
              description: 'Itens do cronograma (aulas agendadas)',
              items: {
                type: 'object',
                required: ['lessonId', 'scheduledDate', 'startTime', 'duration'],
                properties: {
                  lessonId: {
                    type: 'integer',
                    description: 'ID da aula',
                    example: 123,
                  },
                  scheduledDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Data agendada',
                    example: '2025-01-01T00:00:00Z',
                  },
                  startTime: {
                    type: 'string',
                    description: 'Hora de início (formato HH:mm)',
                    example: '14:30',
                  },
                  duration: {
                    type: 'integer',
                    description: 'Duração em minutos',
                    example: 60,
                  },
                },
              },
            },
          },
        },
        SyncPartialRequest: {
          type: 'object',
          properties: {
            syncCategories: {
              type: 'boolean',
              description: 'Sincronizar categorias',
              example: true,
            },
            syncCourses: {
              type: 'boolean',
              description: 'Sincronizar cursos',
              example: true,
            },
            syncSections: {
              type: 'boolean',
              description: 'Sincronizar seções',
              example: false,
            },
            syncLessons: {
              type: 'boolean',
              description: 'Sincronizar aulas',
              example: false,
            },
            syncVideos: {
              type: 'boolean',
              description: 'Sincronizar vídeos',
              example: false,
            },
            syncClassrooms: {
              type: 'boolean',
              description: 'Sincronizar turmas',
              example: false,
            },
          },
        },
        SyncResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Se a sincronização foi bem-sucedida',
            },
            message: {
              type: 'string',
              description: 'Mensagem de retorno',
            },
            stats: {
              type: 'object',
              properties: {
                categoriesProcessed: {
                  type: 'integer',
                  description: 'Quantidade de categorias processadas',
                },
                coursesProcessed: {
                  type: 'integer',
                  description: 'Quantidade de cursos processados',
                },
                sectionsProcessed: {
                  type: 'integer',
                  description: 'Quantidade de seções processadas',
                },
                lessonsProcessed: {
                  type: 'integer',
                  description: 'Quantidade de aulas processadas',
                },
                videosProcessed: {
                  type: 'integer',
                  description: 'Quantidade de vídeos processados',
                },
                classroomsProcessed: {
                  type: 'integer',
                  description: 'Quantidade de turmas processadas',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            statusCode: {
              type: 'integer',
              description: 'Código HTTP do erro',
            },
          },
        },
      },
    },
  },
  apis: ['./src/infra/http/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log('📚 Swagger documentation available at http://localhost:3333/api-docs');
};
