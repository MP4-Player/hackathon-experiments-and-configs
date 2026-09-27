# Hackathon Experiments and Configurations

Working materials from the hackathons I took part in: early experiments, data-preparation scripts and intermediate snapshots that did not make it into the final project repositories. The finished projects live in their own repositories; this one keeps the process that led to them.

| Folder | Hackathon | Date | Final project |
|---|---|---|---|
| [hackathon-1-electrictraffic](hackathon-1-electrictraffic) | Electricity consumption and tariff analysis | April 2025 | [electrictraffic-api](https://github.com/MP4-Player/electrictraffic-api), [electrictraffic-web](https://github.com/MP4-Player/electrictraffic-web) |
| [hackathon-2-centrinvest](hackathon-2-centrinvest) | Centr-Invest Bank, meeting planner (1st place) | October 2025 | [centrinvest-meeting-planner](https://github.com/MP4-Player/centrinvest-meeting-planner) |

## Hackathon 1: Electrictraffic (April 2025)

Preparation scripts written on the eve of the hackathon, before the API and the web app.

| File | What it does |
|---|---|
| [generate_synthetic_hourly_data.py](hackathon-1-electrictraffic/generate_synthetic_hourly_data.py) | Generates a synthetic hourly consumption report for one month in the format of a retail electricity bill: working days and weekends, actual volume, balancing-market price, retail mark-up, network services, total cost. Output: `generated_data.xlsx` |
| [demand_analysis.py](hackathon-1-electrictraffic/demand_analysis.py) | Loads monthly consumption CSV files of several enterprises (tries several encodings and column names), plots consumption with outliers highlighted, compares enterprises and analyses seasonality |
| [plot_monthly_demand.py](hackathon-1-electrictraffic/plot_monthly_demand.py) | Plots month-by-month values for each year from every CSV in `data/` and saves the charts next to the files |
| [data/demand_dataset_monthly.xlsx](hackathon-1-electrictraffic/data/demand_dataset_monthly.xlsx) | Monthly demand dataset: company, month, used and unused demand, energy consumption by tariff component (26 rows) |

```bash
pip install pandas numpy matplotlib seaborn openpyxl
python generate_synthetic_hourly_data.py
```

## Hackathon 2: Centr-Invest (October 2025)

[backend-integration-snapshot](hackathon-2-centrinvest/backend-integration-snapshot) is the state of the app on 25 October 2025, 21:24–21:43: between the "App v4" (mobile meetings interface) and "Final version" commits of [centrinvest-meeting-planner](https://github.com/MP4-Player/centrinvest-meeting-planner). It shows the moment the React frontend was switched from mock storage to the real FastAPI + PostgreSQL backend:

- `src/services/api.ts`: JWT auth headers and a common response handler instead of the mock storage service;
- `src/hooks/*`, `src/pages/dashboard/*`: pages reworked to call the API;
- `main.py`, `database_schema.sql`, `requirements.txt`, `start_backend.bat`: the first version of the backend;
- `test_api.py`, `TESTING_GUIDE.md`, `BACKEND_INTEGRATION.md`, `FIXES_SUMMARY.md`: API smoke test and integration notes.

Database credentials are read from environment variables (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSLMODE`); the host in the documentation is replaced with `<DB_HOST>`. `node_modules` and `.env` are not included.

```bash
npm install && npm run dev          # frontend
pip install -r requirements.txt
python main.py                      # backend
```

Team: [@meeporen](https://github.com/meeporen), [@vladuliksss](https://github.com/vladuliksss). My part: frontend, backend and help with the ML module.
