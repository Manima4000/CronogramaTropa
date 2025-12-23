# Arquitetura do Backend - Cronograma Tropa

## 📐 Princípios Aplicados

### SOLID

1. **S - Single Responsibility Principle (Responsabilidade Única)**
   - Cada classe/módulo tem UMA única responsabilidade
   - Exemplo: `CreateScheduleUseCase` só cria cronogramas

2. **O - Open/Closed Principle (Aberto/Fechado)**
   - Aberto para extensão, fechado para modificação
   - Exemplo: Novos providers podem ser adicionados sem alterar código existente

3. **L - Liskov Substitution Principle (Substituição de Liskov)**
   - Implementações podem ser substituídas por suas interfaces
   - Exemplo: `PrismaScheduleRepository` pode ser substituído por outra implementação de `IScheduleRepository`

4. **I - Interface Segregation Principle (Segregação de Interface)**
   - Interfaces específicas e coesas
   - Exemplo: `IScheduleRepository`, `IScheduleItemRepository` separados

5. **D - Dependency Inversion Principle (Inversão de Dependência)**
   - Dependência de abstrações, não de implementações
   - Exemplo: Use cases dependem de interfaces, não de repositórios concretos

### Clean Architecture + DDD

- **Separação em camadas**
- **Independência de frameworks**
- **Testabilidade**
- **Independência de UI e Database**

## 📁 Estrutura de Pastas

```
src/
├── domains/                    # Camada de Domínio (Regras de Negócio)
│   ├── schedule/
│   │   ├── entities/          # Entidades do domínio
│   │   │   ├── Schedule.ts
│   │   │   └── ScheduleItem.ts
│   │   ├── repositories/      # Interfaces dos repositórios
│   │   │   ├── IScheduleRepository.ts
│   │   │   └── IScheduleItemRepository.ts
│   │   └── usecases/          # Casos de uso (regras de negócio)
│   │       ├── CreateScheduleUseCase.ts
│   │       ├── GetScheduleByIdUseCase.ts
│   │       ├── ListSchedulesUseCase.ts
│   │       ├── DeleteScheduleUseCase.ts
│   │       └── ExportScheduleToPDFUseCase.ts
│   ├── course/
│   │   └── repositories/
│   │       └── ICourseRepository.ts
│   └── lesson/
│       └── repositories/
│           └── ILessonRepository.ts
│
├── infra/                      # Camada de Infraestrutura
│   ├── database/
│   │   └── prisma/
│   │       ├── prisma.ts      # Configuração do Prisma Client
│   │       └── repositories/  # Implementações dos repositórios
│   │           ├── PrismaScheduleRepository.ts
│   │           ├── PrismaScheduleItemRepository.ts
│   │           ├── PrismaCourseRepository.ts
│   │           └── PrismaLessonRepository.ts
│   ├── http/                  # Camada HTTP (Express)
│   │   ├── controllers/
│   │   │   └── ScheduleController.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   └── schedule.routes.ts
│   │   └── middlewares/
│   │       └── errorHandler.ts
│   └── providers/             # Providers externos
│       ├── memberkit/
│       │   ├── MemberkitProvider.ts
│       │   └── dtos/          # DTOs para mapear API Memberkit
│       │       ├── MemberkitCategoryDTO.ts
│       │       ├── MemberkitCourseDTO.ts
│       │       ├── MemberkitSectionDTO.ts
│       │       ├── MemberkitLessonDTO.ts
│       │       └── MemberkitClassroomDTO.ts
│       └── pdf/
│           └── PDFProvider.ts
│
├── shared/                     # Camada Compartilhada
│   ├── interfaces/            # Interfaces compartilhadas
│   │   ├── IMemberkitProvider.ts
│   │   └── IPDFProvider.ts
│   ├── errors/                # Tratamento de erros
│   │   └── AppError.ts
│   └── utils/                 # Utilitários
│
└── server.ts                  # Ponto de entrada da aplicação
```

## 🗄️ Modelo de Dados

### Tabelas Principais

1. **Category** - Categorias dos cursos
2. **Course** - Cursos disponíveis
3. **CategoryCourse** - Tabela de linkagem (N:N)
4. **Section** - Módulos/Seções dos cursos
5. **Lesson** - Aulas de cada seção
6. **Video** - Vídeos associados às aulas
7. **Classroom** - Turmas disponíveis
8. **Schedule** - Cronogramas criados
9. **ScheduleItem** - Itens de cada cronograma

### Relacionamentos

```
Category N <---> N Course (através de CategoryCourse)
Course 1 <---> N Section
Section 1 <---> N Lesson
Lesson 1 <---> 1 Video
Course 1 <---> N Schedule
Schedule 1 <---> N ScheduleItem
Lesson 1 <---> N ScheduleItem
```

## 🔄 Fluxo de Dados

### Exemplo: Criar Cronograma

```
HTTP Request
    ↓
ScheduleController
    ↓
CreateScheduleUseCase (Use Case - Regra de Negócio)
    ↓
IScheduleRepository (Interface)
    ↓
PrismaScheduleRepository (Implementação)
    ↓
Prisma Client
    ↓
PostgreSQL Database
```

## 📦 DTOs (Data Transfer Objects)

### Propósito

Os DTOs mapeiam a resposta da API Memberkit para os dados que serão salvos no banco.

**API Memberkit retorna:**
```json
{
  "id": "123",
  "title": "Matemática",
  "extra_field_1": "...",
  "extra_field_2": "...",
  "nested_data": {...}
}
```

**DTO extrai apenas:**
```json
{
  "id": "123",
  "title": "Matemática"
}
```

## 🚀 Como Executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Editar .env com suas credenciais
```

### 3. Executar migrations
```bash
npx prisma migrate dev
```

### 4. Iniciar servidor
```bash
npm run dev
```

## 📝 Endpoints Disponíveis

### Schedules

- `POST /api/schedules` - Criar cronograma
- `GET /api/schedules` - Listar cronogramas
- `GET /api/schedules/:id` - Buscar cronograma por ID
- `DELETE /api/schedules/:id` - Deletar cronograma
- `GET /api/schedules/:id/export/pdf` - Exportar cronograma em PDF

## 🧪 Próximos Passos

1. Implementar sincronização com API Memberkit
2. Implementar algoritmo de distribuição de aulas no cronograma
3. Adicionar biblioteca de geração de PDF (PDFKit ou Puppeteer)
4. Adicionar validação de dados (class-validator)
5. Adicionar testes unitários e de integração
6. Implementar container de DI (TSyringe ou InversifyJS)
7. Adicionar documentação Swagger/OpenAPI

## 📚 Referências

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
