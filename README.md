# Crypto Portfolio Manager

## Description
Crypto Portfolio Manager is a backend service for managing a cryptocurrency portfolio. It allows users to manage their cryptocurrency holdings, simulate transactions, and view supported assets.

## Setup Instructions

### Prerequisites
- Docker
- Docker Compose

### Getting Started
1. **Clone the repository:**
```sh
git clone [your-repository-url]
```

2. **Navigate to the project directory:**
```sh
cd crypto-portfolio-manager
```

3. **Start the application:**
```sh
docker-compose up --build
```

This command builds the Docker images and starts the services defined in the `docker-compose.yml`, including the backend service and MongoDB.

## API Endpoints and Usage

### User Management
1. **User Onboarding (Registration):**
- **Endpoint:** `POST /onboarding`
- **Description:** Register a new user.
- **Payload:** `{ "email": "user@example.com", "password": "yourpassword" }`
- **Example:**
  ```sh
  curl -X POST http://localhost:3000/onboarding \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
  ```

2. **User Sign-In:**
- **Endpoint:** `POST /sign-in`
- **Description:** Authenticate an existing user and retrieve a JWT token.
- **Payload:** `{ "email": "user@example.com", "password": "123456" }`
- **Example:**
  ```sh
  curl -X POST http://localhost:3000/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'
  ```

### Portfolio Management
1. **Currently supported assets:**
- **Endpoint:** `GET /supported-assets`
- **Description:** Retrieves a list of supported assets that can be managed by the application.
- **Example:**
  ```sh
  curl -X GET http://localhost:3000/supported-assets
  ```

2. **Add Asset to Portfolio:**
- **Endpoint:** `POST /api/portfolio`
- **Description:** Add a new cryptocurrency to the user's portfolio.
- **Payload:** `{ "asset": "BTC", "quantity": 1.5 }`
- **Headers:** Authorization: Bearer [JWT Token]
- **Example:**
  ```sh
  curl -X POST http://localhost:3000/api/portfolio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [JWT Token]" \
  -d '{"asset": "BTC", "quantity": 1.5}'
  ```

3. **Update Asset Quantity:**
- **Endpoint:** `PUT /api/portfolio/:asset`
- **Description:** Update the quantity of a cryptocurrency in the portfolio.
- **Payload:** `{ "quantity": 2.0 }`
- **Headers:** Authorization: Bearer [JWT Token]
- **Example:**
  ```sh
  curl -X PUT http://localhost:3000/api/portfolio/btc \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [JWT Token]" \
  -d '{"quantity": 2.0}'
  ```

4. **Delete Asset from Portfolio:**
- **Endpoint:** `DELETE /api/portfolio/:asset`
- **Description:** Remove a cryptocurrency from the portfolio.
- **Headers:** Authorization: Bearer [JWT Token]
- **Example:**
  ```sh
  curl -X DELETE http://localhost:3000/api/portfolio/btc \
  -H "Authorization: Bearer [JWT Token]"
  ```

5. **Retrieve Portfolio State:**
- **Endpoint:** `GET /api/portfolio`
- **Description:** Get the current state of the user's portfolio.
- **Headers:** Authorization: Bearer [JWT Token]
- **Example:**
  ```sh
  curl -X GET http://localhost:3000/api/portfolio \
  -H "Authorization: Bearer [JWT Token]"
  ```

### Transaction Simulation
1. **Place a Transaction:**
- **Endpoint:** `POST /api/transactions/place-transaction`
- **Description:** Simulate buy/sell transactions of cryptocurrencies.
- **Payload:** `{ "type": "sell", "asset": "BTC", "quantity": 0.5 }`
- **Headers:** Authorization: Bearer [JWT Token]
- **Example:**
  ```sh
  curl -X POST http://localhost:3000/api/transactions/place-transaction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [JWT Token]" \
  -d '{"type": "sell", "asset": "BTC", "quantity": 0.5}'
  ```
