@echo off
echo Установка зависимостей...
npm install

echo.
echo Запуск приложения...
echo Приложение будет доступно по адресу: http://localhost:3000
echo.
echo Данные для входа:
echo Email: admin@example.com
echo Пароль: Admin1
echo.
npm run dev
pause
