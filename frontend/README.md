# CronogramaTropa - Frontend

Interface web moderna para gerenciamento de cronogramas de estudo, construída com React, TypeScript e Tailwind CSS seguindo princípios de Clean Code e SOLID.

## 🚀 Tecnologias

- **React 19.2.0** - Biblioteca UI com hooks e componentes funcionais
- **TypeScript 5.9.3** - Tipagem estática para JavaScript
- **Vite 7.2.4** - Build tool rápido com HMR
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **React Router DOM** - Roteamento SPA
- **Axios** - Cliente HTTP para API
- **@dnd-kit** - Drag and drop acessível
- **date-fns** - Manipulação de datas
- **Yup** - Validação de schemas

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev      # Inicia servidor de desenvolvimento (http://localhost:5173)
npm run build    # Build de produção
npm run lint     # Executa ESLint
npm run preview  # Preview do build de produção
```

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/          # Componentes específicos de features
│   └── schedule/       # Componentes de cronograma
│       └── ManualScheduleForm/
├── contexts/           # React Context para estado global
│   ├── ManualScheduleContext.tsx
│   └── ToastContext.tsx
├── dtos/              # Data Transfer Objects (tipos da API)
│   ├── schedule/
│   └── course/
├── hooks/             # Custom hooks
│   ├── schedule/
│   └── common/
├── pages/             # Componentes de página
│   ├── Home/
│   └── Schedule/
├── services/          # Camada de serviços (API)
│   ├── api/
│   └── schedule/
├── shared/            # Componentes compartilhados
│   ├── ui/            # Componentes UI reutilizáveis
│   ├── layout/        # Componentes de layout
│   └── feedback/      # Loading, toasts, etc.
├── styles/            # Estilos globais e tema
└── utils/             # Utilitários e helpers
    ├── constants/
    ├── date/
    └── validation/
```

### Princípios Arquiteturais

**Clean Code**:
- Funções pequenas e focadas
- Nomes descritivos e significativos
- Componentes com responsabilidade única
- Código auto-documentado

**SOLID**:
- **S**ingle Responsibility - Cada componente/hook tem uma responsabilidade
- **O**pen/Closed - Componentes extensíveis via props, fechados para modificação
- **L**iskov Substitution - Componentes podem ser substituídos por suas variantes
- **I**nterface Segregation - Props interfaces específicas e enxutas
- **D**ependency Inversion - Dependência de abstrações (hooks, contexts)

**Reusabilidade**:
- Sistema de design consistente
- Componentes UI genéricos (`Button`, `Card`, `Icon`)
- Hooks customizados para lógica compartilhada
- Utilitários para operações comuns

## 📱 Funcionalidades

### 1. Criação Manual de Cronograma

Interface wizard em 3 etapas:

**Etapa 1: Informações Básicas**
- Título do cronograma
- Descrição (opcional)
- Data de início e fim

**Etapa 2: Seleção de Aulas**
- Busca por curso
- Visualização de aulas disponíveis
- Seleção de múltiplas aulas de diferentes cursos
- Painel de aulas selecionadas

**Etapa 3: Alocação no Calendário**
- Calendário semanal com drag-and-drop
- Arraste aulas para slots de horário
- Edição de horário e duração
- Visualização de aulas não alocadas
- Validação em tempo real

**Validações**:
- Título obrigatório (3-200 caracteres)
- Data de início < data de fim
- Pelo menos uma aula selecionada
- Todas as aulas devem estar alocadas
- Alocações dentro do período do cronograma

### 2. Listagem de Cronogramas

- Grid responsivo de cards
- Informações por cronograma:
  - Título e descrição
  - Período (início - fim)
  - Duração total em dias
  - Data de criação
- Estados de loading e erro
- Empty state com call-to-action
- Navegação para detalhes

### 3. Detalhes do Cronograma

**Cabeçalho**:
- Título e descrição
- Período do cronograma
- Botões de ação (voltar, deletar)

**Estatísticas**:
- Total de aulas
- Aulas concluídas
- Duração total (horas e minutos)
- Progresso percentual

**Cronograma de Aulas**:
- Aulas agrupadas por data
- Data por extenso em português
- Para cada aula:
  - Título da aula
  - Horário de início
  - Duração
  - Número da aula
  - Status de conclusão
  - Botão para marcar como concluída

**Indicadores Visuais**:
- Verde para aulas concluídas
- Cinza para aulas pendentes
- Hover effects para melhor UX

## 🎨 Design System

### Paleta de Cores (Tema Militar)

```css
--color-military-green: #4a5d23        /* Primary */
--color-military-green-light: #6b8e23
--color-military-green-dark: #3a4a1a

--color-military-khaki: #bdb76b        /* Secondary */
--color-military-khaki-light: #d4d2a5
--color-military-khaki-dark: #9a9456

--color-military-dark: #2c3e17         /* Text */
--color-military-gray: #4f5d4c
--color-military-light-gray: #a8b5a1

--color-camo-brown: #8b7355            /* Accent */
--color-camo-sand: #c2b280
```

### Componentes UI

**Button**:
```tsx
<Button variant="primary|secondary|danger|ghost" size="sm|md|lg" loading={boolean} icon="icon-name">
  Texto
</Button>
```

**Card**:
```tsx
<Card padding="none|sm|md|lg" onClick={() => {}}>
  Conteúdo
</Card>
```

**Icon**:
```tsx
<Icon name="bootstrap-icon-name" size="sm|md|lg|xl" className="custom-classes" />
```

## 🔄 Gerenciamento de Estado

**Local State** - `useState` para estado de componente
**Context API** - Estado compartilhado entre componentes:
- `ManualScheduleContext` - Estado do formulário de criação
- `ToastContext` - Notificações globais

**Custom Hooks** - Encapsulam lógica de fetching:
- `useCreateSchedule` - Criar cronograma
- `useListSchedules` - Listar cronogramas
- `useScheduleDetails` - Detalhes do cronograma

## 📡 Integração com API

### Endpoints Utilizados

```typescript
POST   /api/schedules           # Criar cronograma
GET    /api/schedules           # Listar cronogramas
GET    /api/schedules/:id       # Detalhes do cronograma
DELETE /api/schedules/:id       # Deletar cronograma
GET    /api/schedules/:id/export/pdf  # Exportar PDF
```

### Serviços

```typescript
// services/schedule/ScheduleService.ts
class ScheduleService {
  create(data: CreateScheduleRequestDTO): Promise<ScheduleWithItemsDTO>
  list(): Promise<ScheduleDTO[]>
  getById(id: number): Promise<ScheduleWithDetailsDTO>
  delete(id: number): Promise<void>
  exportToPDF(id: number): Promise<Blob>
}
```

## 🧪 Validação

**Client-Side Validation** - Feedback imediato:
- Validação de formulários com Yup
- Mensagens de erro descritivas
- Destaque visual de campos inválidos

**Date Handling**:
- Uso de `date-fns` para manipulação
- Timezone-aware (UTC para API, local para UI)
- Formatos: YYYY-MM-DD (API), dd/MM/yyyy (UI)

## 🚧 Próximas Funcionalidades

- [ ] Marcar aulas como concluídas (backend integration)
- [ ] Edição de cronogramas existentes
- [ ] Filtros e busca na listagem
- [ ] Exportação de PDF funcional
- [ ] Dashboard com estatísticas gerais
- [ ] Notificações de aulas próximas
- [ ] Modo escuro

## 📝 Convenções de Código

**Nomenclatura**:
- Componentes: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase com prefixo `use` (`useMyHook.ts`)
- Utilitários: camelCase (`formatDate.ts`)
- Constantes: UPPER_SNAKE_CASE

**Organização de Imports**:
1. React e bibliotecas externas
2. Hooks customizados
3. Componentes
4. Utilitários e constantes
5. Types e interfaces

**Comentários**:
- JSDoc para componentes e funções públicas
- Comentários inline apenas quando necessário
- Código auto-explicativo preferido

## 🤝 Contribuindo

1. Siga os princípios SOLID e Clean Code
2. Use TypeScript com tipagem forte
3. Prefira componentes funcionais com hooks
4. Mantenha componentes pequenos e focados
5. Reutilize componentes existentes quando possível
6. Documente código complexo
7. Execute ESLint antes de commitar

## 📄 Licença

Este projeto é proprietário e confidencial.
