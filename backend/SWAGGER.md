# Documentação da API - Swagger

A API do Cronograma Tropa está documentada usando Swagger/OpenAPI 3.0.

## Acessando a Documentação

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse a documentação interativa do Swagger em:
```
http://localhost:3333/api-docs
```

## Endpoints Documentados

### Schedules (Cronogramas)

- `POST /api/schedules` - Criar um novo cronograma
- `GET /api/schedules` - Listar todos os cronogramas
- `GET /api/schedules/:id` - Buscar cronograma por ID
- `DELETE /api/schedules/:id` - Deletar cronograma
- `GET /api/schedules/:id/export/pdf` - Exportar cronograma para PDF

### Sync (Sincronização com MemberKit)

- `POST /api/sync` - Sincronizar todos os dados do MemberKit
- `POST /api/sync/partial` - Sincronizar dados específicos do MemberKit

## Funcionalidades do Swagger UI

A interface do Swagger permite:

1. **Visualizar** todos os endpoints disponíveis
2. **Testar** endpoints diretamente pelo navegador
3. **Ver exemplos** de requisições e respostas
4. **Entender** os schemas de dados
5. **Validar** parâmetros e corpo das requisições

## Exemplo de Uso - Criar Cronograma

1. Acesse `http://localhost:3333/api-docs`
2. Clique em `POST /api/schedules`
3. Clique em "Try it out"
4. Preencha o JSON de exemplo:
```json
{
  "title": "Cronograma de Python",
  "description": "Cronograma para aprender Python em 30 dias",
  "courseId": "course-123",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-31T23:59:59Z",
  "studyDaysPerWeek": 5,
  "hoursPerDay": 2
}
```
5. Clique em "Execute"

## Exemplo de Uso - Sincronizar Dados

1. Acesse `http://localhost:3333/api-docs`
2. Clique em `POST /api/sync`
3. Clique em "Try it out"
4. Clique em "Execute" (não precisa de body)
5. Ou use `POST /api/sync/partial` para sincronizar apenas algumas entidades:
```json
{
  "syncCategories": true,
  "syncCourses": true,
  "syncSections": false,
  "syncLessons": false,
  "syncVideos": false,
  "syncClassrooms": false
}
```

## Schemas Disponíveis

A documentação inclui schemas detalhados para:

- `Schedule` - Estrutura de um cronograma
- `ScheduleItem` - Item de um cronograma
- `CreateScheduleRequest` - Requisição para criar cronograma
- `SyncPartialRequest` - Requisição para sincronização parcial
- `SyncResponse` - Resposta da sincronização
- `Error` - Estrutura de erro padrão

## Configuração

A configuração do Swagger está em:
```
backend/src/infra/http/swagger/swagger.ts
```

A documentação dos endpoints está nos próprios arquivos de rotas usando anotações JSDoc:
- `backend/src/infra/http/routes/schedule.routes.ts`
- `backend/src/infra/http/routes/sync.routes.ts`
