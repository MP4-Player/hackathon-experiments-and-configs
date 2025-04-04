import pandas as pd
import matplotlib.pyplot as plt
import os

def plot_csv_data(csv_folder, x_column='month', y_column='volume', year_column='years'):
    """
    Читает CSV файлы из указанной папки, строит графики данных (месяц, значение) для каждого года.

    Аргументы:
        csv_folder (str): Путь к папке, содержащей CSV файлы.
        x_column (str): Название столбца, содержащего месяцы.  По умолчанию 'месяц'.
        y_column (str): Название столбца, содержащего значения. По умолчанию 'значение'.
        year_column (str): Название столбца, содержащего годы. По умолчанию 'год'.
    """

    # Получаем список всех CSV файлов в папке
    csv_files = [f for f in os.listdir(csv_folder) if f.endswith('.csv')]

    if not csv_files:
        print(f"В папке {csv_folder} не найдено CSV файлов.")
        return

    for csv_file in csv_files:
        file_path = os.path.join(csv_folder, csv_file)
        try:
            # Читаем CSV файл в DataFrame
            df = pd.read_csv(file_path)

            # Преобразуем столбец с годом в строку, чтобы избежать проблем с типами данных
            df[year_column] = df[year_column].astype(str)

            # Группируем данные по годам
            for year, year_data in df.groupby(year_column):
                # Строим график для каждого года
                plt.figure(figsize=(10, 6))  # Увеличиваем размер графика для лучшей читаемости

                plt.plot(year_data[x_column], year_data[y_column], marker='o', linestyle='-')

                plt.title(f"График значений за {year} год (из {csv_file})")
                plt.xlabel(x_column)
                plt.ylabel(y_column)
                plt.grid(True)  # Добавляем сетку для удобства просмотра
                plt.xticks(rotation=45, ha="right")  # Поворачиваем метки на оси X для читаемости

                # Сохраняем график в файл (опционально)
                output_filename = f"{os.path.splitext(csv_file)[0]}_{year}.png"
                plt.savefig(os.path.join(csv_folder, output_filename))  # сохраняем графики в той же папке, что и CSV файлы
                print(f"График для {year} года из {csv_file} сохранен как {output_filename}")

                plt.tight_layout() # Автоматически корректирует параметры подграфиков для размещения в графике
                plt.show()  # Отображаем график на экране

        except FileNotFoundError:
            print(f"Файл не найден: {file_path}")
        except pd.errors.EmptyDataError:
            print(f"Файл {file_path} пуст.")
        except KeyError as e:
            print(f"Ошибка: Столбец '{e}' не найден в файле {file_path}. Убедитесь, что названия столбцов указаны верно.")
        except Exception as e:
            print(f"Произошла ошибка при обработке файла {file_path}: {e}")


# Пример использования:
if __name__ == "__main__":
    # Укажите путь к папке, содержащей CSV файлы
    folder_path = "data"  # Замените на фактический путь к вашей папке

    # Создаем папку data, если её не существует.  Это для примера, в реальности она должна существовать.
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Создана папка {folder_path}. Поместите в неё ваши CSV файлы.")
    else:
        plot_csv_data(folder_path) # Вызываем функцию для построения графиков.
