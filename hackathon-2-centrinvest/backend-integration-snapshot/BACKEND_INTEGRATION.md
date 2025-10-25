# Meeting Management System

Система управления встречами с полной интеграцией frontend и backend.

## Структура проекта

- `main.py` - FastAPI backend с полным набором endpoints
- `database_schema.sql` - SQL скрипт для создания базы данных
- `requirements.txt` - Python зависимости
- `src/` - React frontend приложение

## Установка и запуск

### Backend (FastAPI)

1. Установите Python зависимости:
```bash
pip install -r requirements.txt
```

2. Создайте базу данных PostgreSQL и выполните SQL скрипт:
```bash
psql -h <DB_HOST> -U api_user -d meeting_db -f database_schema.sql
```

3. Запустите backend сервер:
```bash
python main.py
```

Backend будет доступен по адресу: http://localhost:8000

### Frontend (React)

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. Запустите frontend:
```bash
npm run dev
```

Frontend будет доступен по адресу: http://localhost:5173

## API Endpoints

### Аутентификация
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему
- `POST /auth/logout` - Выход из системы

### Клиенты
- `GET /clients` - Получить список клиентов
- `POST /clients` - Создать клиента
- `GET /clients/{id}` - Получить клиента по ID
- `PUT /clients/{id}` - Обновить клиента
- `DELETE /clients/{id}` - Удалить клиента

### Задачи
- `GET /tasks` - Получить список задач
- `POST /tasks` - Создать задачу
- `GET /tasks/{id}` - Получить задачу по ID
- `PUT /tasks/{id}` - Обновить задачу
- `DELETE /tasks/{id}` - Удалить задачу

### Встречи
- `GET /meetings` - Получить список встреч
- `POST /meetings` - Создать встречу
- `GET /meetings/{id}` - Получить встречу по ID
- `PUT /meetings/{id}` - Обновить встречу
- `DELETE /meetings/{id}` - Удалить встречу

### Типы встреч
- `GET /meeting-types` - Получить типы встреч
- `POST /meeting-types` - Создать тип встречи

### Статистика
- `GET /statistics` - Получить статистику

### Оптимизация маршрутов
- `POST /meetings/optimize-route` - Оптимизировать маршрут встреч

## База данных

Система использует PostgreSQL с следующими таблицами:
- `users` - Пользователи системы
- `clients` - Клиенты
- `meetings` - Встречи
- `meeting_types` - Типы встреч
- `tasks` - Задачи
- `schedule_items` - Элементы расписания

## Особенности

1. **JWT аутентификация** - Безопасная аутентификация с токенами
2. **CORS поддержка** - Настроена для работы с frontend
3. **Полная CRUD функциональность** - Для всех сущностей
4. **Фильтрация и поиск** - Во всех списках
5. **Пагинация** - Для больших объемов данных
6. **Валидация данных** - С помощью Pydantic
7. **Обработка ошибок** - Централизованная обработка

## Тестирование

Для тестирования API используйте:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Развертывание

1. Обновите настройки базы данных в `main.py`
2. Установите переменные окружения для production
3. Используйте production WSGI сервер (например, Gunicorn)
4. Настройте reverse proxy (например, Nginx)
