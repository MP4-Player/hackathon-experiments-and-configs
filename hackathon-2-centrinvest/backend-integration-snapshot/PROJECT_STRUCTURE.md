# Структура проекта - Мобильный интерфейс встреч

## Обзор архитектуры

```
ХАХАТОН (2)/ХАХАТОН/
│
├── src/
│   ├── components/
│   │   ├── meetings/               ✨ НОВОЕ
│   │   │   ├── MeetingTypesTab.tsx      - Вкладка типов встреч
│   │   │   ├── ScheduleTab.tsx          - Вкладка расписания
│   │   │   ├── MeetingFormModal.tsx     - Форма создания/редактирования
│   │   │   └── index.ts                 - Экспорт компонентов
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   └── ui/
│   │       ├── AnimatedBackground.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Kaleidoscope.tsx
│   │       └── SafeIcon.tsx
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── MeetingsPage.tsx         🔄 ОБНОВЛЕНО - Главная страница встреч
│   │   │   ├── ClientsPage.tsx
│   │   │   ├── TasksPage.tsx
│   │   │   ├── MapPage.tsx
│   │   │   └── StatisticsPage.tsx
│   │   │
│   │   └── LandingPage.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMeetings.ts
│   │   ├── useClients.ts
│   │   └── useTasks.ts
│   │
│   ├── services/
│   │   ├── api.ts                       🔄 ОБНОВЛЕНО - API endpoints
│   │   └── authService.ts
│   │
│   ├── types/
│   │   └── index.ts                     🔄 ОБНОВЛЕНО - TypeScript типы
│   │
│   ├── utils/
│   │   └── test-utils.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                        🔄 ОБНОВЛЕНО - Мобильные стили
│
├── public/
│   └── vite.svg
│
├── API_ENDPOINTS.md                     ✨ НОВОЕ - Документация API
├── MOBILE_MEETINGS_GUIDE.md             ✨ НОВОЕ - Руководство пользователя
├── MOBILE_SETUP.md                      ✨ НОВОЕ - Быстрый старт
├── CHANGELOG_MOBILE.md                  ✨ НОВОЕ - История изменений
├── SUMMARY.md                           ✨ НОВОЕ - Итоговое резюме
├── PROJECT_STRUCTURE.md                 ✨ НОВОЕ - Этот файл
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Детальная структура компонентов

### 1. MeetingsPage (Главная страница)

```
MeetingsPage.tsx
├── Header (Заголовок и табы)
│   ├── "Типы встреч" tab
│   └── "Расписание" tab
│
├── MeetingTypesTab (когда активна)
│   ├── Header Controls
│   │   ├── Кнопка "Сохранить"
│   │   └── Кнопка "Создать встречу"
│   │
│   ├── Unassigned Meetings (Встречи без типа)
│   │   └── MeetingCard[]
│   │
│   └── Meeting Type Categories (7 типов)
│       ├── Рабочие совещания
│       │   └── MeetingCard[]
│       ├── Встречи с партнерами
│       │   └── MeetingCard[]
│       ├── Встречи с клиентами
│       │   └── MeetingCard[]
│       ├── Брифинг
│       │   └── MeetingCard[]
│       ├── Презентация продукта
│       │   └── MeetingCard[]
│       ├── Бизнес ланч
│       │   └── MeetingCard[]
│       └── Иное
│           └── MeetingCard[]
│
├── ScheduleTab (когда активна)
│   ├── Header Controls
│   │   ├── Кнопка "Сохранить"
│   │   └── Кнопка "Оптимизировать маршрут"
│   │
│   ├── Schedule List (Верхняя часть)
│   │   └── ScheduleItemCard[]
│   │       ├── Порядковый номер
│   │       ├── Drag handle
│   │       ├── Детали встречи
│   │       └── Время в пути
│   │
│   └── Map (Нижняя часть)
│       ├── Placeholder
│       └── API endpoint готов
│
└── MeetingFormModal (модальное окно)
    ├── Форма создания/редактирования
    ├── Валидация
    └── Кнопки действий
```

## Поток данных

```
User Action (UI)
    ↓
Component (React)
    ↓
Event Handler
    ↓
API Service (services/api.ts)
    ↓
Mock Data / Backend API
    ↓
Response
    ↓
Update State (React Hooks)
    ↓
Re-render UI
```

## Типы данных

### MeetingType
```typescript
'work_meeting' | 'partner_meeting' | 'client_meeting' |
'briefing' | 'product_presentation' | 'business_lunch' | 'other'
```

### MeetingWithType
```typescript
{
  id: string
  title: string
  description: string
  clientName: string
  location: string
  address: string
  startDate: string
  endDate: string
  priority: 'standard' | 'vip'
  meetingType?: MeetingType
  order?: number
}
```

### ScheduleItem
```typescript
{
  id: string
  meetingId: string
  meeting: MeetingWithType
  order: number
  estimatedTravelTime?: number
  distance?: number
}
```

## API Endpoints

### Meetings
- `GET /api/meetings` - Получить список встреч
- `POST /api/meetings` - Создать встречу
- `PUT /api/meetings/:id` - Обновить встречу
- `DELETE /api/meetings/:id` - Удалить встречу
- `PATCH /api/meetings/:id/type` - Обновить тип встречи

### Schedule & Routes
- `POST /api/meetings/optimize-route` - Оптимизировать маршрут
- `POST /api/meetings/schedule-map-locations` - Получить точки на карте
- `PUT /api/meetings/schedule-order` - Обновить порядок встреч

## Стилизация

### Tailwind CSS классы
```css
.btn-primary      - Основная кнопка
.btn-secondary    - Вторичная кнопка
.btn-accent       - Акцентная кнопка
.card             - Карточка
.input-field      - Поле ввода
```

### Кастомные классы (index.css)
```css
.draggable-item   - Drag & Drop элемент
.drag-over        - Состояние при наведении
.meeting-card     - Карточка встречи
.schedule-item    - Элемент расписания
```

## Responsive Breakpoints

```
Mobile:  < 640px   (sm)
  └── 1 колонка карточек
  └── Touch-friendly элементы
  └── Полноэкранные модалки

Tablet:  640px - 1024px  (md)
  └── 2 колонки карточек
  └── Оптимизированное пространство

Desktop: > 1024px  (lg)
  └── 3 колонки карточек
  └── Hover эффекты
  └── Детальное отображение
```

## Drag & Drop Flow

```
1. User starts dragging (onDragStart)
   ↓
2. Set draggedItem state
   ↓
3. User drags over target (onDragOver)
   ↓
4. Prevent default & show feedback
   ↓
5. User drops (onDrop)
   ↓
6. Update item's category/order
   ↓
7. Clear draggedItem state
   ↓
8. Re-render with new positions
```

## State Management

### MeetingsPage State
```typescript
- activeTab: 'types' | 'schedule'
- isModalOpen: boolean
- editingMeeting: MeetingWithType | undefined
- modalMode: 'create' | 'edit'
```

### MeetingTypesTab State
```typescript
- localMeetings: MeetingWithType[]
- draggedMeeting: MeetingWithType | null
- deleteConfirm: string | null
```

### ScheduleTab State
```typescript
- localSchedule: ScheduleItem[]
- draggedItem: ScheduleItem | null
```

## Файловая структура по функционалу

### UI Components (Визуальные компоненты)
```
src/components/meetings/
├── MeetingTypesTab.tsx       - Отображение типов
├── ScheduleTab.tsx           - Отображение расписания
└── MeetingFormModal.tsx      - Форма создания/редактирования
```

### Business Logic (Бизнес-логика)
```
src/hooks/
└── useMeetings.ts            - Логика работы с встречами

src/services/
└── api.ts                    - API вызовы
```

### Type Definitions (Типы)
```
src/types/
└── index.ts                  - TypeScript интерфейсы
```

### Styling (Стили)
```
src/
└── index.css                 - Глобальные стили + мобильная адаптация
```

## Диаграмма взаимодействия

```
┌─────────────────────────────────────────────┐
│           MeetingsPage                      │
│  ┌─────────────────────────────────────┐   │
│  │  Tab: Типы встреч | Расписание      │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────┐  ┌─────────────────┐ │
│  │ MeetingTypesTab  │  │   ScheduleTab   │ │
│  │                  │  │                 │ │
│  │ • Drag & Drop    │  │ • Расписание   │ │
│  │ • 7 категорий    │  │ • Карта        │ │
│  │ • Редактирование │  │ • Оптимизация  │ │
│  └──────────────────┘  └─────────────────┘ │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │      MeetingFormModal                │  │
│  │  • Создание/редактирование           │  │
│  │  • Валидация                         │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│              API Service                    │
│  • optimizeRoute()                          │
│  • getScheduleMapLocations()                │
│  • updateMeetingType()                      │
│  • updateScheduleOrder()                    │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│         Backend / Mock Data                 │
└─────────────────────────────────────────────┘
```

## Зависимости проекта

### Core
- React 18
- TypeScript
- Vite

### UI
- Tailwind CSS
- Lucide React (иконки)

### Utilities
- React Router (навигация)
- React Query (для будущего API)

## Команды разработки

```bash
npm run dev        # Запуск dev сервера
npm run build      # Production сборка
npm run lint       # ESLint проверка
npm run preview    # Предпросмотр production
npm test           # Запуск тестов
```

## Соглашения о коде

### Именование файлов
- Компоненты: `PascalCase.tsx`
- Хуки: `useCamelCase.ts`
- Утилиты: `camelCase.ts`
- Типы: в `index.ts`

### Структура компонента
```typescript
// 1. Imports
import { ... } from '...'

// 2. Types/Interfaces
interface Props { ... }

// 3. Component
export const Component = (props: Props) => {
  // 4. State
  const [state, setState] = useState()

  // 5. Handlers
  const handleAction = () => { ... }

  // 6. Effects
  useEffect(() => { ... }, [])

  // 7. Render
  return (...)
}
```

## Следующие шаги разработки

1. ✅ UI компоненты - **Готово**
2. ✅ Drag & Drop - **Готово**
3. ✅ Мобильная адаптация - **Готово**
4. ✅ API структура - **Готово (mock)**
5. ⏳ Backend интеграция
6. ⏳ Карты (Google Maps / Yandex)
7. ⏳ Тесты (unit + e2e)
8. ⏳ Production deploy

---

**Актуально на:** 2025-10-25
**Версия:** 1.0.0
