# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado

#### Backend

- **GetScheduleByIdUseCase**: Agora retorna itens enriquecidos com dados completos das lessons
  - Novo tipo `ScheduleItemWithLesson` que inclui a entidade `Lesson`
  - Busca paralela de lessons usando `Promise.all` para melhor performance
  - Validação de integridade: erro se lesson referenciada não existir
  - Arquivo: `backend/src/domains/schedule/usecases/GetScheduleByIdUseCase.ts`

- **CreateScheduleUseCase**: Retorna schedule com items criados
  - Novo tipo `CreateScheduleOutput` com `{ schedule, items }`
  - Busca items recém-criados após inserção no banco
  - Consistência: frontend sempre recebe dados completos
  - Arquivo: `backend/src/domains/schedule/usecases/CreateScheduleUseCase.ts`

- **Documentação Swagger**: Atualizada e expandida
  - Endpoint `GET /api/schedules/:id` documentado com retorno enriquecido
  - Endpoint `POST /api/schedules` com descrição detalhada
  - Correção de tipos: `integer` ao invés de `string uuid` para IDs
  - Descrições mais claras e completas

#### Frontend

- **ScheduleDetailPage**: Página completa de detalhes do cronograma
  - Header com título, descrição, período e ações
  - 4 cards de estatísticas: Total de aulas, Concluídas, Duração total, Progresso %
  - Aulas agrupadas por data com formatação por extenso em português
  - Cada aula mostra: título, horário, duração, posição, status de conclusão
  - Indicadores visuais: verde para concluídas, cinza para pendentes
  - Botões para marcar/desmarcar conclusão (UI pronta)
  - Estados de loading, error e empty state
  - Arquivo: `frontend/src/pages/Schedule/ScheduleDetailPage.tsx`

- **useScheduleDetails**: Hook para buscar cronograma com detalhes
  - Fetch automático ao montar componente
  - Gerenciamento de loading, error e data
  - Função `refetch` para recarregar dados
  - Tipagem forte com `ScheduleWithDetailsDTO`
  - Arquivo: `frontend/src/hooks/schedule/useScheduleDetails.ts`

- **useListSchedules**: Hook para listar cronogramas
  - Fetch automático de todos os cronogramas
  - Estados de loading e error
  - Função refetch para atualização
  - Arquivo: `frontend/src/hooks/schedule/useListSchedules.ts`

- **ScheduleListPage**: Página de listagem implementada
  - Grid responsivo de cards (1/2/3 colunas)
  - Informações por cronograma: título, descrição, período, duração, data de criação
  - Formatação de datas em português brasileiro
  - Estados de loading, error e empty state
  - Navegação para detalhes ao clicar no card
  - Arquivo: `frontend/src/pages/Schedule/ScheduleListPage.tsx`

- **HomePage**: Refatorada para usar componentes reutilizáveis
  - Substituição de elementos HTML nativos por componentes
  - Uso de `Button`, `Card` e `Icon` components
  - Consistência visual com resto da aplicação
  - Arquivo: `frontend/src/pages/Home/HomePage.tsx`

- **DTOs Expandidos**:
  - `ScheduleItemDTO`: Adicionado campo `startTime`
  - `ScheduleItemWithLessonDTO`: Novo tipo para items com lesson
  - `ScheduleWithDetailsDTO`: Novo tipo para schedule com items enriquecidos
  - Arquivos: `frontend/src/dtos/schedule/`

- **Documentação**:
  - README completo do frontend com arquitetura, funcionalidades e convenções
  - CLAUDE.md atualizado com seção detalhada de frontend
  - Descrição de componentes, hooks, contextos e estrutura
  - Documentação do design system e paleta de cores

### Modificado

#### Backend

- **Injeção de Dependências**: `GetScheduleByIdUseCase` agora recebe `lessonRepository`
  - Arquivo: `backend/src/infra/http/routes/schedule.routes.ts`

#### Frontend

- **Card Component**: Adicionado suporte para `onClick` prop
  - Aceita handler de click opcional
  - Cursor pointer automático quando onClick presente
  - Tipagem TypeScript: `MouseEvent<HTMLDivElement>`
  - Arquivo: `frontend/src/shared/ui/Card/Card.tsx`

- **Button Component**: Melhorias de acessibilidade visual
  - Botão primary com `!text-white` e `font-bold` para melhor contraste
  - Sombras adicionadas (`shadow-md`, `hover:shadow-lg`)
  - Cores hexadecimais diretas para garantir consistência
  - Arquivo: `frontend/src/shared/ui/Button/Button.tsx`

- **Header Component**: Correção de contraste de texto
  - Item ativo com `!text-white` e `font-bold`
  - Fundo alterado para `bg-military-khaki-light` no estado ativo
  - Melhor visibilidade da navegação ativa
  - Arquivo: `frontend/src/shared/layout/Header.tsx`

- **ManualScheduleForm**: Correção de serialização de datas
  - `scheduledDate` agora usa `formatDateForInput()` ao invés de `toISOString()`
  - Envia formato `YYYY-MM-DD` (sem timestamp)
  - Evita problemas de timezone UTC (03:00:00)
  - Arquivo: `frontend/src/components/schedule/ManualScheduleForm/ManualScheduleForm.tsx`

### Corrigido

#### Backend

- **CreateScheduleUseCase**: Agora retorna items junto com schedule
  - Resolvia apenas `Schedule`, causava erro no frontend ao acessar `result.schedule.id`
  - Frontend esperava `{ schedule, items }`, mas recebia apenas `Schedule`

#### Frontend

- **Erro ao criar cronograma**: `TypeError: Cannot read properties of undefined (reading 'id')`
  - Causa: Backend retornava `Schedule`, frontend esperava `{ schedule, items }`
  - Solução: Backend agora retorna formato correto

- **Horário 03:00:00 em scheduledDate**: Data sendo salva com hora
  - Causa: `.toISOString()` adiciona timezone UTC
  - Solução: Uso de `formatDateForInput()` para formato `YYYY-MM-DD`

- **Botão "Criar Cronograma" invisível**: Texto se camuflava com fundo
  - Causa: Cor do texto não tinha contraste suficiente
  - Solução: `!text-white` + `font-bold` + cores hexadecimais diretas

- **Item ativo no Header invisível**: Texto da página ativa com cor do fundo
  - Causa: Classes de texto sendo sobrescritas
  - Solução: `!text-white` com `!important` e `font-bold`

- **Lista de cronogramas vazia**: Página não buscava dados da API
  - Causa: Componente hardcoded sem chamada ao backend
  - Solução: Hook `useListSchedules` + renderização dinâmica

- **Card sem onClick**: Erro de build ao adicionar onClick em Card
  - Causa: Props interface não incluía onClick
  - Solução: Adicionado `onClick?: (event: MouseEvent<HTMLDivElement>) => void`

## Arquitetura e Princípios

### Backend (Clean Architecture + DDD)

- **Domain Layer**: Entidades e use cases sem dependências externas
- **Infrastructure Layer**: Implementações concretas (Prisma, Express, Providers)
- **Shared Layer**: Erros e interfaces compartilhadas
- **SOLID**: Cada use case tem uma responsabilidade única
- **Repository Pattern**: Interfaces no domínio, implementações na infra
- **Dependency Injection**: Manual nas rotas

### Frontend (SOLID + Clean Code)

- **Single Responsibility**: Componentes e hooks focados
- **Open/Closed**: Componentes extensíveis via props
- **Reusabilidade**: Sistema de componentes UI genéricos
- **Custom Hooks**: Lógica de fetching encapsulada
- **Context API**: Estado global quando necessário
- **TypeScript**: Tipagem forte em toda aplicação

## Tecnologias

### Backend
- Node.js + TypeScript 5.9.3
- Express 5.2.1
- Prisma 7.2.0
- PostgreSQL
- Swagger (swagger-jsdoc + swagger-ui-express)

### Frontend
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- Tailwind CSS 4.1.18
- React Router DOM
- Axios
- @dnd-kit (drag-and-drop)
- date-fns (manipulação de datas)

---

## Notas de Versão

### Compatibilidade

- Todas as mudanças são **compatíveis** com versões anteriores
- Endpoints existentes mantêm mesma assinatura
- Novos campos são opcionais ou têm defaults

### Migrações

Nenhuma migração de banco de dados necessária. As mudanças são apenas na camada de aplicação.

### Próximos Passos

- [ ] Implementar marcação de conclusão de aulas (backend)
- [ ] Implementar edição de cronogramas
- [ ] Implementar filtros e busca na listagem
- [ ] Exportação de PDF funcional
- [ ] Dashboard com estatísticas gerais
- [ ] Testes unitários e integração
