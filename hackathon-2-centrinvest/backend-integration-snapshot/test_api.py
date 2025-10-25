#!/usr/bin/env python3
"""
Тестовый скрипт для проверки API создания встреч
"""

import requests
import json
from datetime import datetime, timedelta

# Конфигурация
API_BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test@user.com"
TEST_PASSWORD = "password123"

def test_api():
    print("🧪 Тестирование API создания встреч...")
    
    # 1. Регистрация/авторизация
    print("\n1. Авторизация...")
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    try:
        # Попробуем сначала авторизоваться
        response = requests.post(f"{API_BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            auth_data = response.json()
            token = auth_data["token"]
            print("✅ Авторизация успешна")
        else:
            # Если авторизация не удалась, попробуем зарегистрироваться
            print("⚠️ Авторизация не удалась, пробуем регистрацию...")
            register_data = {
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
                "firstName": "Тестовый",
                "lastName": "Пользователь"
            }
            response = requests.post(f"{API_BASE_URL}/auth/register", json=register_data)
            if response.status_code == 200:
                auth_data = response.json()
                token = auth_data["token"]
                print("✅ Регистрация успешна")
            else:
                print(f"❌ Ошибка регистрации: {response.status_code} - {response.text}")
                return
    except Exception as e:
        print(f"❌ Ошибка подключения к API: {e}")
        return
    
    # 2. Создание встречи
    print("\n2. Создание встречи...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Подготавливаем данные встречи
    start_time = datetime.now() + timedelta(hours=1)
    end_time = start_time + timedelta(hours=1)
    
    meeting_data = {
        "title": "Тестовая встреча",
        "description": "Описание тестовой встречи",
        "clientId": "00000000-0000-0000-0000-000000000001",
        "employeeId": "00000000-0000-0000-0000-000000000001",
        "meetingTypeId": "work_meeting",
        "startDate": start_time.isoformat(),
        "endDate": end_time.isoformat(),
        "location": "Офис",
        "address": "Москва, ул. Тестовая, д. 1",
        "priority": "standard",
        "isRecurring": False
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/meetings", json=meeting_data, headers=headers)
        if response.status_code == 200:
            meeting = response.json()
            print("✅ Встреча создана успешно!")
            print(f"   ID: {meeting['id']}")
            print(f"   Название: {meeting['title']}")
            print(f"   Статус: {meeting['status']}")
        else:
            print(f"❌ Ошибка создания встречи: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Ошибка при создании встречи: {e}")
    
    # 3. Получение списка встреч
    print("\n3. Получение списка встреч...")
    try:
        response = requests.get(f"{API_BASE_URL}/meetings", headers=headers)
        if response.status_code == 200:
            meetings = response.json()
            print(f"✅ Получено встреч: {len(meetings)}")
            for meeting in meetings:
                print(f"   - {meeting['title']} ({meeting['status']})")
        else:
            print(f"❌ Ошибка получения встреч: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Ошибка при получении встреч: {e}")

if __name__ == "__main__":
    test_api()
