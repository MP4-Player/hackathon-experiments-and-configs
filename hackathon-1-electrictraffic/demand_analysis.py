import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import glob
import os
import warnings

# Отключение предупреждений
warnings.filterwarnings("ignore")

# Настройка стиля графиков
plt.style.use('ggplot')  # Используем более надежный стиль
plt.rcParams['figure.figsize'] = (12, 6)
sns.set_palette("husl")

def load_and_prepare_data(file_path):
    """Загрузка и подготовка данных из CSV файла с обработкой ошибок"""
    try:
        # Пробуем разные кодировки для чтения файла
        encodings = ['utf-8', 'cp1251', 'latin1']
        
        for encoding in encodings:
            try:
                df = pd.read_csv(file_path, encoding=encoding)
                break
            except UnicodeDecodeError:
                continue
        
        # Проверяем наличие нужных колонок
        required_columns = {'month', 'year', 'volume'}
        if not required_columns.issubset(df.columns):
            # Пробуем альтернативные имена колонок
            column_mapping = {
                'mounse': 'month',
                'years': 'year'
            }
            df = df.rename(columns=column_mapping)
            
            if not required_columns.issubset(df.columns):
                print(f"Файл {file_path} не содержит нужных колонок")
                return None
        
        # Преобразование объема в числовой формат
        if df['volume'].dtype == object:
            df['volume'] = (
                df['volume']
                .astype(str)
                .str.replace('\xa0', '')  # Удаляем неразрывные пробелы
                .str.replace(' ', '')
                .str.replace(',', '.')
                .astype(float)
            )
        
        # Создание столбца с датой
        df['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'].astype(str) + '-01')
        
        return df.sort_values('date').dropna(subset=['volume'])
    
    except Exception as e:
        print(f"Ошибка при обработке файла {file_path}: {str(e)}")
        return None

def plot_enterprise_consumption(df, enterprise_name):
    """Построение графика потребления для одного предприятия"""
    if df is None or df.empty:
        print(f"Нет данных для предприятия {enterprise_name}")
        return
    
    plt.figure()
    ax = plt.gca()
    
    # Основной график
    line, = ax.plot(df['date'], df['volume'], marker='o', linestyle='-', linewidth=2, label='Потребление')
    
    # Выделение выбросов
    mean = df['volume'].mean()
    std = df['volume'].std()
    threshold = 2 * std
    outliers = df[(df['volume'] > mean + threshold) | (df['volume'] < mean - threshold)]
    
    if not outliers.empty:
        outlier_points = ax.scatter(
            outliers['date'], outliers['volume'], 
            color='red', s=100, label='Выбросы'
        )
        ax.legend(handles=[line, outlier_points])
    
    plt.title(f'Потребление электроэнергии: {enterprise_name}', fontsize=14)
    plt.xlabel('Дата', fontsize=12)
    plt.ylabel('Потребление (кВт)', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
    
    # Статистика
    print(f"\nСтатистика для {enterprise_name}:")
    print(df['volume'].describe())
    
    if not outliers.empty:
        print("\nОбнаружены выбросы:")
        print(outliers[['month', 'year', 'volume']])

def plot_comparison(all_data):
    """Сравнение потребления всех предприятий"""
    if not all_data:
        print("Нет данных для сравнения")
        return
    
    plt.figure(figsize=(14, 8))
    ax = plt.gca()
    
    lines = []
    labels = []
    
    for name, df in all_data.items():
        if df is not None and not df.empty:
            line, = ax.plot(df['date'], df['volume'], marker='o', linestyle='-', label=name)
            lines.append(line)
            labels.append(name)
    
    if lines:  # Только если есть данные для отображения
        ax.legend(lines, labels, bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.title('Сравнение потребления электроэнергии', fontsize=16)
        plt.xlabel('Дата', fontsize=12)
        plt.ylabel('Потребление (кВт)', fontsize=12)
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.show()
    else:
        print("Нет данных для построения графика сравнения")

def analyze_seasonality(all_data):
    """Анализ сезонности потребления"""
    if not all_data:
        print("Нет данных для анализа сезонности")
        return
    
    plt.figure(figsize=(14, 8))
    ax = plt.gca()
    
    lines = []
    labels = []
    
    for name, df in all_data.items():
        if df is not None and not df.empty:
            monthly_avg = df.groupby('month')['volume'].mean().reset_index()
            line, = ax.plot(
                monthly_avg['month'], 
                monthly_avg['volume'], 
                marker='o', 
                label=name
            )
            lines.append(line)
            labels.append(name)
    
    if lines:  # Только если есть данные для отображения
        ax.legend(lines, labels, bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.title('Сезонность потребления электроэнергии', fontsize=16)
        plt.xlabel('Месяц', fontsize=12)
        plt.ylabel('Среднее потребление (кВт)', fontsize=12)
        plt.grid(True, alpha=0.3)
        plt.xticks(range(1, 13))
        plt.tight_layout()
        plt.show()
    else:
        print("Нет данных для анализа сезонности")

def main():
    # Загрузка всех CSV файлов в директории
    files = glob.glob('*.csv')
    all_data = {}
    
    print("Обрабатываемые файлы:")
    for file in files:
        print(f"- {file}")
    
    for file in files:
        enterprise_name = os.path.splitext(os.path.basename(file))[0]
        df = load_and_prepare_data(file)
        
        if df is not None and not df.empty:
            all_data[enterprise_name] = df
            plot_enterprise_consumption(df, enterprise_name)
        else:
            print(f"Не удалось загрузить данные из {file}")
    
    # Сравнение и анализ
    plot_comparison(all_data)
    analyze_seasonality(all_data)

if __name__ == "__main__":
    main()