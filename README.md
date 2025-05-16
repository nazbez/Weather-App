![API CI](https://github.com/nazbez/Weather-App/actions/workflows/weather-api-ci.yml/badge.svg)

# Weather App

![Node.js](https://img.shields.io/badge/node.js-20.x-green)
![Express](https://img.shields.io/badge/express-4.x-blue)
![PostgreSQL](https://img.shields.io/badge/postgres-15.x-blueviolet)
![Dockerized](https://img.shields.io/badge/docker-ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 🌤️ Project Overview

A full-featured Node.js + Express API that allows users to subscribe to hourly or daily weather updates via email. Users must confirm their email to receive updates. The project uses a cron-based scheduler to fetch weather data from WeatherAPI and send email updates.

## 📘 API Overview

| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| POST   | /api/subscribe           | Subscribe to weather updates   |
| GET    | /api/confirm/:token      | Confirm email subscription     |
| GET    | /api/unsubscribe/:token  | Unsubscribe from updates       |
| GET    | /api/weather?city=City   | Get current weather for a city |

## 💻 Local Development Guide

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional, but recommended)

### Setup (without Docker)

```bash
npm install
cp .env.example .env
# Fill in your Gmail credentials, DB connection string and WEATHER_API_KEY in .env
npx sequelize-cli db:migrate
npm run dev
```

### Setup with Docker

```bash
docker-compose up --build
```

Then visit:

- API: [http://localhost:3000](http://localhost:3000)
- Subscription form: [http://localhost:3000/subsription.html](http://localhost:3000/subscribe.html)
- Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- PgAdmin: [http://localhost:5050](http://localhost:5050)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Mail**: Nodemailer (Gmail)
- **Scheduling**: node-cron
- **Weather API**: weatherapi.com
- **Swagger**: OpenAPI 3.0 (YAML)
- **Tests**: Jest
- **Dev Tools**: ESLint, Prettier, Docker, VSCode

## 🐳 Docker Compose Services

- `api`: Node.js Express app
- `db`: PostgreSQL 15
- `pgadmin`: Database GUI (optional)

## ✅ Continuous Integration (CI)

This project uses GitHub Actions for CI:

- Automatically installs dependencies
- Lints code with ESLint
- Runs unit tests using Jest

You can find the workflow file at .github/workflows/weather-api-ci.yml and view the CI status badge at the top of this README.

## 📜 License

MIT License — feel free to use, modify, and share.

---

Made with ❤️ by Nazar Bezuhlyi
