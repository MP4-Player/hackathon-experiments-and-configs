# API Endpoints Documentation

## Встречи (Meetings)

### Оптимизация маршрута
**Endpoint:** `POST /api/meetings/optimize-route`

**Описание:** Оптимизирует порядок встреч для минимизации времени в пути и расстояния.

**Request Body:**
```json
{
  "meetingIds": ["meeting-1", "meeting-2", "meeting-3"],
  "startLocation": {
    "latitude": 55.7558,
    "longitude": 37.6176,
    "address": "Москва, Красная площадь"
  }
}
```

**Response:**
```json
{
  "optimizedSchedule": [
    {
      "id": "schedule-1",
      "meetingId": "meeting-1",
      "meeting": {
        "id": "meeting-1",
        "title": "Встреча с клиентом",
        "clientName": "ООО Ромашка",
        "location": "Офис клиента",
        "address": "ул. Ленина, 1",
        "latitude": 55.7558,
        "longitude": 37.6176,
        "startDate": "2025-10-25T10:00:00Z",
        "endDate": "2025-10-25T11:00:00Z",
        "priority": "vip",
        "meetingType": "client_meeting"
      },
      "order": 1,
      "estimatedTravelTime": 15,
      "distance": 2500
    }
  ],
  "totalDistance": 15000,
  "totalTravelTime": 45,
  "totalDuration": 240
}
```

### Получение точек на карте для расписания
**Endpoint:** `POST /api/meetings/schedule-map-locations`

**Описание:** Возвращает координаты всех встреч из расписания для отображения на карте.

**Request Body:**
```json
{
  "scheduleItems": [
    {
      "id": "schedule-1",
      "meetingId": "meeting-1",
      "meeting": { ... },
      "order": 1
    }
  ]
}
```

**Response:**
```json
[
  {
    "id": "schedule-1",
    "order": 1,
    "latitude": 55.7558,
    "longitude": 37.6176,
    "address": "ул. Ленина, 1",
    "title": "Встреча с клиентом",
    "type": "meeting"
  }
]
```

### Обновление типа встречи
**Endpoint:** `PATCH /api/meetings/:id/type`

**Описание:** Обновляет тип встречи.

**Request Body:**
```json
{
  "meetingType": "client_meeting"
}
```

**Response:**
```json
{
  "success": true,
  "meeting": {
    "id": "meeting-1",
    "meetingType": "client_meeting",
    ...
  }
}
```

### Массовое обновление порядка встреч
**Endpoint:** `PUT /api/meetings/schedule-order`

**Описание:** Обновляет порядок встреч в расписании.

**Request Body:**
```json
{
  "scheduleItems": [
    {
      "meetingId": "meeting-1",
      "order": 1
    },
    {
      "meetingId": "meeting-2",
      "order": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "updatedCount": 2
}
```

## Типы встреч (Meeting Types)

Доступные типы встреч:
- `work_meeting` - Рабочие совещания
- `partner_meeting` - Встречи с партнерами
- `client_meeting` - Встречи с клиентами
- `briefing` - Брифинг
- `product_presentation` - Презентация продукта
- `business_lunch` - Бизнес ланч
- `other` - Иное

## Карта (Map)

### Получение маршрута между точками
**Endpoint:** `POST /api/map/route`

**Описание:** Рассчитывает маршрут между несколькими точками (для будущей интеграции с картами).

**Request Body:**
```json
{
  "waypoints": [
    {
      "latitude": 55.7558,
      "longitude": 37.6176,
      "address": "Точка А"
    },
    {
      "latitude": 55.7600,
      "longitude": 37.6200,
      "address": "Точка Б"
    }
  ]
}
```

**Response:**
```json
{
  "route": {
    "distance": 5000,
    "duration": 15,
    "polyline": "encoded_polyline_string",
    "steps": [
      {
        "distance": 1000,
        "duration": 3,
        "instruction": "Поверните направо на ул. Ленина"
      }
    ]
  }
}
```

## Примечания

1. Все эндпоинты требуют аутентификации через JWT токен в заголовке `Authorization: Bearer <token>`
2. Даты передаются в формате ISO 8601 (например: `2025-10-25T10:00:00Z`)
3. Координаты указываются в формате WGS84 (широта и долгота в градусах)
4. Расстояния указываются в метрах
5. Время указывается в минутах

## Коды ошибок

- `400` - Неверный запрос (невалидные данные)
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Интеграция с картами

Для интеграции с картами рекомендуется использовать:
- **Google Maps API** - для маршрутизации и отображения карт
- **Yandex Maps API** - альтернатива для российского рынка
- **OpenStreetMap + OSRM** - открытое решение

Эндпоинт `POST /api/map/route` должен быть интегрирован с одним из этих сервисов для получения реальных маршрутов.
