# Implementação de Cronograma Manual - Documentação Técnica

## Visão Geral

Sistema completo de criação manual de cronogramas de estudo com interface drag-and-drop, permitindo aos usuários selecionar aulas específicas de múltiplos cursos e alocar manualmente no calendário.

## Arquitetura

### Princípios Aplicados

- **SOLID**: Cada componente tem responsabilidade única
- **Clean Code**: Código legível, comentado e bem estruturado
- **Separation of Concerns**: Lógica de negócio separada da apresentação
- **Type Safety**: TypeScript garantindo tipos corretos em todo o código

### Estrutura de Pastas

```
frontend/src/
├── components/schedule/ManualScheduleForm/
│   ├── ManualScheduleForm.tsx           # Componente principal (integração)
│   ├── ScheduleBasicInfo.tsx            # Informações básicas (passo 1)
│   ├── CourseAndLessonSelector.tsx      # Seleção de cursos e aulas (passo 2)
│   ├── SelectedLessonsPanel.tsx         # Painel de aulas selecionadas
│   ├── UnallocatedLessonsPanel.tsx      # Aulas não alocadas (arrastar)
│   ├── WeekCalendar.tsx                 # Calendário com DnD (passo 3)
│   ├── WeekCalendarHeader.tsx           # Cabeçalho com navegação
│   ├── WeekCalendarGrid.tsx             # Grid de dias x horários
│   ├── WeekCalendarFooter.tsx           # Footer com informações
│   ├── TimeSlot.tsx                     # Slot droppable
│   ├── LessonCard.tsx                   # Card draggable de aula
│   └── EditAllocationModal.tsx          # Modal de edição
├── contexts/
│   └── ManualScheduleContext.tsx        # Estado global do cronograma manual
├── hooks/schedule/
│   ├── useWeekNavigation.ts             # Navegação semanal
│   └── useTimeSlots.ts                  # Geração de slots de tempo
├── utils/
│   ├── validation/manualScheduleValidation.ts  # Validações
│   └── date/formatDate.ts               # Formatação de datas
└── pages/Schedule/
    └── CreateSchedulePage.tsx           # Página com seletor de modo
```

## Componentes Principais

### 1. ManualScheduleContext

**Responsabilidade**: Gerenciar estado global do cronograma manual

**State**:
- `title`, `description`: Informações básicas
- `startDate`, `endDate`: Período do cronograma
- `studyDaysPerWeek`, `hoursPerDay`: Configurações
- `selectedCourses`: Set de IDs de cursos selecionados
- `expandedSections`: Set de IDs de seções expandidas
- `selectedLessons`: Map de aulas selecionadas
- `allocations`: Map de alocações no calendário

**Métodos**:
- `setBasicInfo()`: Atualizar informações básicas
- `toggleCourse()`, `toggleSection()`, `toggleLesson()`: Seleção
- `allocateLesson()`, `removeAllocation()`, `updateAllocation()`: Gestão de alocações
- `getUnallocatedLessons()`, `isLessonAllocated()`: Helpers

### 2. ManualScheduleForm

**Responsabilidade**: Integrar todos os subcomponentes e gerenciar fluxo

**Funcionalidades**:
- Validação completa antes do submit
- Transformação de state em DTO
- Tratamento de erros com Toast
- Loading overlay durante criação
- Navegação guiada por passos (1, 2, 3)

### 3. WeekCalendar

**Responsabilidade**: Calendário semanal com drag-and-drop

**Tecnologias**:
- `@dnd-kit/core` para drag-and-drop
- `PointerSensor` com threshold de 8px
- `DragOverlay` para preview durante drag

**Funcionalidades**:
- Navegação entre semanas
- Respeita limites de startDate/endDate
- Alocação via drag-and-drop
- Clique em aula para editar (modal)

### 4. Validação

**Arquivo**: `utils/validation/manualScheduleValidation.ts`

**Regras**:
- Título obrigatório (máx 200 chars)
- Datas obrigatórias (fim > início)
- Dias por semana: 1-7
- Horas por dia: 1-24
- Mínimo 1 aula selecionada
- Todas as aulas devem estar alocadas
- Alocações dentro do período do cronograma

**Funções Utilitárias**:
- `validateManualSchedule()`: Validação completa
- `getFieldErrors()`: Erros de um campo específico
- `getFirstFieldError()`: Primeiro erro de um campo
- `groupErrorsByField()`: Agrupar erros por campo

## Hooks Customizados

### useWeekNavigation

```typescript
interface UseWeekNavigationReturn {
  currentWeekStart: Date;
  weekDays: Date[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  navigatePreviousWeek: () => void;
  navigateNextWeek: () => void;
}
```

**Responsabilidade**: Gerenciar navegação entre semanas respeitando limites

### useTimeSlots

```typescript
useTimeSlots({ hoursPerDay: number, startHour?: number }): string[]
```

**Responsabilidade**: Gerar array de slots de tempo (formato HH:mm)

## Fluxo de Uso

### Passo 1: Informações Básicas

1. Usuário preenche:
   - Título do cronograma
   - Descrição (opcional)
   - Data de início e término
   - Dias de estudo por semana
   - Horas por dia

### Passo 2: Seleção de Aulas

1. Usuário seleciona cursos (checkbox)
2. Expande seções para ver aulas
3. Seleciona aulas individuais ou "Selecionar todas" da seção
4. Aulas selecionadas aparecem no painel direito

### Passo 3: Alocação no Calendário

1. Aulas não alocadas aparecem no painel superior
2. Usuário arrasta aulas para slots no calendário
3. Clica em aulas alocadas para editar (hora, duração)
4. Remove alocações se necessário

### Passo 4: Criação

1. Usuário clica em "Validar" (opcional)
2. Sistema mostra erros ou sucesso
3. Usuário clica em "Criar Cronograma"
4. Sistema:
   - Valida todos os campos
   - Mostra loading overlay
   - Cria cronograma no backend
   - Redireciona para visualização

## Tratamento de Erros

### Toast Messages

- **Sucesso**: Validação OK, Cronograma criado
- **Erro**: Erros de validação, Falha na criação
- **Warning**: Validação com erros
- **Info**: Informações contextuais

### Loading States

- `LoadingOverlay`: Cobre tela durante criação
- Botões desabilitados durante loading
- Loading state nos hooks de dados

## Formatação de Datas

**Arquivo**: `utils/date/formatDate.ts`

**Funções Adicionadas**:
- `formatDateObject(date, pattern)`: Formatar Date object
- `formatDateObjectShort(date)`: "15 jan"
- `formatDateObjectFull(date)`: "15 jan 2024"
- `formatWeekday(date)`: "seg", "ter", etc
- `formatDateRange(start, end)`: "15 jan - 21 jan 2024"

## Integração com Backend

### DTO

```typescript
interface CreateScheduleRequestDTO {
  title: string;
  description?: string | null;
  courseId?: number | null;  // null para manual
  startDate: string;         // ISO 8601
  endDate: string;           // ISO 8601
  studyDaysPerWeek: number;
  hoursPerDay: number;
  items: ScheduleItemInputDTO[];
}

interface ScheduleItemInputDTO {
  lessonId: number;
  scheduledDate: string;     // ISO 8601
  startTime: string;         // HH:mm
  duration: number;          // minutos
}
```

### Transformação

```typescript
const dto: CreateScheduleRequestDTO = {
  ...state,
  startDate: state.startDate!.toISOString(),
  endDate: state.endDate!.toISOString(),
  items: Array.from(state.allocations.values()).map(allocation => ({
    lessonId: allocation.lessonId,
    scheduledDate: allocation.scheduledDate.toISOString(),
    startTime: allocation.startTime,
    duration: allocation.duration,
  })),
};
```

## Navegação

### Rotas

- `/`: HomePage com botões de acesso
- `/schedules`: Lista de cronogramas
- `/schedules/create`: Criação (modo automático/manual)
- `/schedules/:id`: Visualização de cronograma

### Header

Navegação global:
- Início
- Cronogramas
- Criar (acesso rápido)

## Melhorias Futuras

### Funcionalidades

- [ ] Arrastar para reorganizar aulas já alocadas
- [ ] Duplicar alocações para múltiplos dias
- [ ] Templates de cronograma
- [ ] Exportar/Importar cronograma
- [ ] Modo escuro

### Performance

- [ ] Virtualização da lista de aulas
- [ ] Debounce em validações em tempo real
- [ ] Lazy loading de seções/aulas

### UX

- [ ] Tour guiado para novos usuários
- [ ] Atalhos de teclado
- [ ] Undo/Redo
- [ ] Auto-save em localStorage

## Testes

### Como Testar

1. **Acesse** `/schedules/create`
2. **Escolha** Modo Manual
3. **Preencha** informações básicas
4. **Selecione** aulas de um ou mais cursos
5. **Arraste** aulas para o calendário
6. **Clique** em aulas alocadas para editar
7. **Valide** o cronograma
8. **Crie** e verifique no backend

### Casos de Teste

- ✓ Validação com campos vazios
- ✓ Validação com datas inválidas
- ✓ Seleção de múltiplos cursos
- ✓ Drag-and-drop funcionando
- ✓ Edição de alocações
- ✓ Remoção de alocações
- ✓ Criação bem-sucedida
- ✓ Tratamento de erros de API

## Dependências

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "date-fns": "^4.1.0"
}
```

## Autores

- Implementação: Claude Code
- Arquitetura: Clean Architecture + SOLID
- Data: Dezembro 2024

## Licença

Este projeto faz parte do CronogramaTropa.
