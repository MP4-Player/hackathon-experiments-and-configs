import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Настройки генерации
start_date = datetime(2025, 1, 1)
end_date = datetime(2025, 1, 31)
hours_range = range(24)  # Часы в сутках

# Создаем DataFrame с датами и часами
date_range = pd.date_range(start_date, end_date, freq='D')
data = []
for date in date_range:
    # Определяем день недели (0-пн, 6-вс)
    weekday = date.weekday()
    day_type = 'Рабочий' if weekday < 5 else 'Выходной'  # Пн-Пт рабочие, Сб-Вс выходные
    
    for hour in hours_range:
        data.append({
            'Дата': date + timedelta(hours=hour),
            '№ часа': hour,
            'день недели': day_type
        })
df = pd.DataFrame(data)

# Генерация значений
def generate_values(day_type):
    if day_type == 'Выходной':
        volume = np.random.uniform(30, 50, 1)[0]
        price = np.random.uniform(1.1, 1.6, 1)[0]
    else:
        volume = np.random.uniform(40, 150, 1)[0]
        price = np.random.uniform(1.2, 2.5, 1)[0]
    return volume, price

# Заполняем данные
df[['Фактический объем', 'Цена ЭЭ на БР руб/кВт*ч']] = df.apply(
    lambda x: generate_values(x['день недели']), axis=1, result_type='expand'
)

# Фиксированные значения
df['Плановый объем'] = 0
df['Сбытовая надбавка (цена ЭЭ на БР) руб/кВт*ч'] = 1.00275
df['Цена 2-став. услуг руб/кВт*ч'] = 0.14823
df['Прочие услуги руб/кВт*ч'] = 0.00481

# Расчетные поля
df['Итого цена руб/кВт*ч'] = df[[
    'Цена ЭЭ на БР руб/кВт*ч',
    'Сбытовая надбавка (цена ЭЭ на БР) руб/кВт*ч',
    'Цена 2-став. услуг руб/кВт*ч',
    'Прочие услуги руб/кВт*ч'
]].sum(axis=1)

df['Стоимость ЭЭ'] = df['Фактический объем'] * df['Итого цена руб/кВт*ч']
df['Фактическая мощность, кВт'] = ''  # Пустые значения
df['Мощность на передачу, кВт'] = ''  # Пустые значения

# Форматирование
df['Дата'] = df['Дата'].dt.strftime('%d.%m.%Y')
df = df.round({
    'Фактический объем': 6,
    'Цена ЭЭ на БР руб/кВт*ч': 5,
    'Итого цена руб/кВт*ч': 5,
    'Стоимость ЭЭ': 2
})

# Переупорядочиваем столбцы
columns_order = [
    'Дата', 'день недели', '№ часа', 'Плановый объем', 'Фактический объем',
    'Цена ЭЭ на БР руб/кВт*ч', 'Сбытовая надбавка (цена ЭЭ на БР) руб/кВт*ч',
    'Цена 2-став. услуг руб/кВт*ч', 'Прочие услуги руб/кВт*ч',
    'Итого цена руб/кВт*ч', 'Стоимость ЭЭ', 'Фактическая мощность, кВт',
    'Мощность на передачу, кВт'
]
df = df[columns_order]

# Создаем заголовки
header = pd.DataFrame([[
    'Дата', 'день недели', '№ часа', 'Плановый объем', 'Фактический объем',
    'Цена ЭЭ на БР руб/кВт*ч', 'Сбытовая надбавка (цена ЭЭ на БР) руб/кВт*ч',
    'Цена 2-став. услуг руб/кВт*ч', 'Прочие услуги руб/кВт*ч',
    'Итого цена руб/кВт*ч', 'Стоимость ЭЭ', 'Фактическая мощность, кВт',
    'Мощность на передачу, кВт'
]])

# Добавляем пустые строки
empty_rows = pd.DataFrame([['']*len(columns_order)]*3, columns=columns_order)

# Добавляем номера столбцов (1-13)
column_numbers = pd.DataFrame([list(range(1, 14))], columns=columns_order)

# Собираем итоговый DataFrame
final_df = pd.concat([
    empty_rows,
    header,
    column_numbers,
    df
], ignore_index=True)

# Сохраняем в Excel
final_df.to_excel('generated_data.xlsx', index=False, header=False)