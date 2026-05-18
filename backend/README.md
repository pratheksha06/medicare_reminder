# Medicare Reminder — Backend

Spring Boot REST API for the Medicare Reminder & Healthcare Management System.

## Prerequisites
- Java 17+
- Maven 3.8+
- MongoDB running on `localhost:27017`

## Setup

1. **Configure** `src/main/resources/application.properties`:
   - Set your Gmail SMTP credentials (or any SMTP)
   - Set your Twilio credentials for SMS
   - MongoDB URI (default: `mongodb://localhost:27017/medicare_db`)

2. **Run**
   ```bash
   mvn spring-boot:run
   ```
   Server starts on `http://localhost:8080`

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get JWT token |

### Patient — `/api/patient` *(requires PATIENT role)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/medicines` | Get / Add medicine reminders |
| PUT | `/medicines/{id}` | Update medicine |
| DELETE | `/medicines/{id}` | Delete medicine |
| PATCH | `/medicines/{id}/dose` | Mark dose taken/missed |
| GET | `/medicines/dose-logs` | Get dose history |
| GET | `/medicines/adherence` | Get adherence stats |
| GET/POST | `/appointments` | Get / Book appointments |
| PATCH | `/appointments/{id}/cancel` | Cancel appointment |
| GET/POST | `/health-records` | Get / Add health records |
| DELETE | `/health-records/{id}` | Delete health record |
| GET/POST | `/caretakers` | Get / Add caretakers |
| PATCH | `/caretakers/{id}/toggle-notify` | Toggle caretaker notifications |
| DELETE | `/caretakers/{id}` | Remove caretaker |
| POST | `/emergency/sos` | Send SOS to caretakers |

### Doctor — `/api/doctor` *(requires DOCTOR role)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | Get my appointments |
| PATCH | `/appointments/{id}/status` | Approve/Reject appointment |
| GET/POST | `/prescriptions` | Get / Issue prescriptions |
| GET | `/patients` | Get my patients |
| GET | `/patients/{id}/adherence` | Get patient adherence |

### Admin — `/api/admin` *(requires ADMIN role)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | System stats |
| GET | `/patients` | All patients |
| GET | `/doctors` | All doctors |
| PATCH | `/users/{id}/toggle-status` | Activate/Deactivate user |
| DELETE | `/users/{id}` | Delete user |
| GET | `/appointments` | All appointments |

## Authentication
All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

## Roles
- `PATIENT` — access to patient endpoints
- `DOCTOR` — access to doctor endpoints
- `ADMIN` — access to all endpoints
