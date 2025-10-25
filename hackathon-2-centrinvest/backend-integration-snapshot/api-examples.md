# API Endpoints Examples

Этот файл содержит примеры API эндпоинтов, которые должен предоставлять бэкенд для работы с фронтендом.

## Аутентификация

### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

### POST /api/auth/register
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  },
  "message": "Registration successful"
}
```

## Встречи

### GET /api/meetings
**Query Parameters:**
- `page` (number): номер страницы
- `limit` (number): количество записей на странице
- `status` (string): статус встречи
- `priority` (string): приоритет
- `search` (string): поисковый запрос
- `dateFrom` (string): дата от (ISO)
- `dateTo` (string): дата до (ISO)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
        "title": "Встреча с клиентом",
        "description": "Обсуждение проекта",
        "clientId": "1",
        "clientName": "ООО Ромашка",
        "employeeId": "1",
        "employeeName": "Иван Иванов",
        "startDate": "2023-12-01T10:00:00Z",
        "endDate": "2023-12-01T11:00:00Z",
        "location": "Офис клиента",
        "address": "ул. Ленина, 1",
        "latitude": 55.7558,
        "longitude": 37.6176,
        "status": "scheduled",
        "priority": "vip",
        "isRecurring": false,
        "createdAt": "2023-11-30T10:00:00Z",
        "updatedAt": "2023-11-30T10:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### POST /api/meetings
```json
{
  "title": "Новая встреча",
  "description": "Описание встречи",
  "clientId": "1",
  "employeeId": "1",
  "startDate": "2023-12-01T10:00:00Z",
  "endDate": "2023-12-01T11:00:00Z",
  "location": "Офис",
  "address": "ул. Ленина, 1",
  "priority": "standard",
  "isRecurring": false
}
```

## Клиенты

### GET /api/clients
**Query Parameters:**
- `page` (number): номер страницы
- `limit` (number): количество записей на странице
- `priority` (string): приоритет клиента
- `status` (string): статус клиента
- `search` (string): поисковый запрос

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
        "firstName": "Иван",
        "lastName": "Петров",
        "email": "ivan@example.com",
        "phone": "+7 (999) 123-45-67",
        "company": "ООО Ромашка",
        "position": "Директор",
        "address": "ул. Ленина, 1, Москва",
        "latitude": 55.7558,
        "longitude": 37.6176,
        "priority": "vip",
        "status": "active",
        "createdAt": "2023-11-01T10:00:00Z",
        "updatedAt": "2023-11-30T10:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## Задачи

### GET /api/tasks
**Query Parameters:**
- `page` (number): номер страницы
- `limit` (number): количество записей на странице
- `status` (string): статус задачи
- `priority` (string): приоритет задачи
- `search` (string): поисковый запрос
- `dateFrom` (string): дата от (ISO)
- `dateTo` (string): дата до (ISO)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
        "title": "Подготовить презентацию",
        "description": "Создать презентацию для клиента",
        "clientId": "1",
        "clientName": "ООО Ромашка",
        "employeeId": "1",
        "employeeName": "Иван Иванов",
        "status": "pending",
        "priority": "high",
        "startDate": "2023-12-01T09:00:00Z",
        "endDate": "2023-12-01T17:00:00Z",
        "createdAt": "2023-11-30T10:00:00Z",
        "updatedAt": "2023-11-30T10:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## Карта

### GET /api/map/locations
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Встреча с клиентом",
      "type": "meeting",
      "latitude": 55.7558,
      "longitude": 37.6176,
      "address": "ул. Ленина, 1",
      "description": "Обсуждение проекта",
      "status": "scheduled",
      "priority": "vip"
    }
  ]
}
```

### GET /api/map/search
**Query Parameters:**
- `query` (string): адрес для поиска

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "address": "ул. Ленина, 1, Москва",
      "latitude": 55.7558,
      "longitude": 37.6176
    }
  ]
}
```

## Статистика

### GET /api/statistics
**Response:**
```json
{
  "success": true,
  "data": {
    "totalMeetings": 156,
    "completedMeetings": 142,
    "postponedMeetings": 8,
    "cancelledMeetings": 6,
    "totalTasks": 89,
    "completedTasks": 67,
    "pendingTasks": 22,
    "totalClients": 45,
    "vipClients": 12,
    "standardClients": 33
  }
}
```

## Обработка ошибок

Все эндпоинты должны возвращать ошибки в следующем формате:

```json
{
  "success": false,
  "message": "Описание ошибки",
  "errors": {
    "field": ["Сообщение об ошибке поля"]
  }
}
```

**HTTP Status Codes:**
- 200: Успешный запрос
- 201: Ресурс создан
- 400: Ошибка валидации
- 401: Не авторизован
- 403: Доступ запрещен
- 404: Ресурс не найден
- 500: Внутренняя ошибка сервера
