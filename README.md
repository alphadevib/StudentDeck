# StudentDeck

StudentDeck is a full-stack student management system. It has a **Spring Boot** REST API backed by MySQL and a **React + Vite** frontend. You can register and log in students (with JWT), manage student records, send SMS through Twilio, and look up the current weather through OpenWeatherMap.

## Features

- Student registration and login with JWT authentication (tokens expire after 5 minutes)
- Create, read, update and delete student records, with pagination and sorting
- Search students by name, roll number or email
- Send SMS notifications through Twilio
- Current weather lookup by city through OpenWeatherMap, with caching

## Tech Stack

| Layer    | Technology                                             |
|----------|--------------------------------------------------------|
| Backend  | Java 17, Spring Boot 4, Spring Data JPA, JJWT, Twilio SDK |
| Database | MySQL                                                  |
| Frontend | React 19, Vite, React Router, Axios                    |

## Project Structure

```
StudentDeck/
├── Backend/    # Spring Boot REST API (Maven)
│   └── src/main/java/com/anurag/aiml/
│       ├── controller/   # Student, SMS and Weather endpoints
│       ├── entity/       # JPA entities
│       ├── jwt/          # JWT generation and validation
│       ├── repo/         # Spring Data repositories
│       └── service/      # Business logic
└── Frontend/   # React + Vite client
    └── src/components/   # Login, Register, Home, Sms, Weather
```

## Getting Started

### Prerequisites

- JDK 17 or later
- MySQL 8 or later
- Node.js 20 or later and npm
- A Twilio account (for SMS) and an OpenWeatherMap API key (for weather)

### 1. Database

Create the database:

```sql
CREATE DATABASE aimlbc;
```

Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`).

### 2. Backend

Set these environment variables. Secrets are never committed to the repository.

| Variable              | Description                  | Default                              |
|-----------------------|------------------------------|--------------------------------------|
| `DB_URL`              | JDBC URL                     | `jdbc:mysql://localhost:3306/aimlbc` |
| `DB_USERNAME`         | Database user                | `root`                               |
| `DB_PASSWORD`         | Database password            | `root`                               |
| `TWILIO_ACCOUNT_SID`  | Twilio account SID           | required                             |
| `TWILIO_AUTH_TOKEN`   | Twilio auth token            | required                             |
| `TWILIO_PHONE_NUMBER` | Twilio sender number         | required                             |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key       | required                             |

Then run:

```bash
cd Backend
./mvnw spring-boot:run      # On Windows: mvnw.cmd spring-boot:run
```

The API runs at `http://localhost:8080`.

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| POST   | `/register`                   | Register a new student               |
| POST   | `/login`                      | Log in and receive a JWT             |
| GET    | `/get`                        | List all students                    |
| GET    | `/get/page`                   | Paginated list (`page`, `size`, `sortDirection`) |
| GET    | `/get/{id}`                   | Get a student by ID                  |
| PUT    | `/update/{id}`                | Update a student                     |
| DELETE | `/delete/{id}`                | Delete a student                     |
| GET    | `/search/name/{name}`         | Search by name                       |
| GET    | `/search/roll/{rollNumber}`   | Search by roll number                |
| GET    | `/search/email/{email}`       | Search by email                      |
| GET    | `/valid?token=...`            | Validate a JWT                       |
| GET    | `/verify`                     | Verify the `Authorization: Bearer` header |
| POST   | `/api/sms/send`               | Send an SMS (`phone`, `message`)     |
| GET    | `/city/{city}`                | Current weather for a city           |
