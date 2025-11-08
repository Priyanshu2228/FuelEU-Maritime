# FuelEU Maritime Backend

## Overview
FuelEU Maritime is a full-stack application designed to manage and track fuel records in the maritime industry. This backend service is built using TypeScript and follows the hexagonal architecture pattern, ensuring a clean separation of concerns and maintainability.

## Technologies Used
- TypeScript
- Node.js
- Express
- Prisma (for database interactions)
- Docker (for containerization)
- Jest (for testing)

## Project Structure
The backend is organized into several key directories:
- **src**: Contains the main application code.
  - **config**: Configuration settings for the application.
  - **domain**: Contains entities, value objects, and events.
  - **application**: Use cases and Data Transfer Objects (DTOs).
  - **ports**: Interfaces for repositories and external services.
  - **adapters**: Implementations for controllers, HTTP, persistence, and messaging.
  - **infra**: Infrastructure-related code, including database client and logger.
  - **shared**: Utility functions.
  - **tests**: Integration tests for the application.

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FuelEU-Maritime/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the `.env.example` to `.env` and fill in the required values.

4. **Run the application**
   ```bash
   npm run start
   ```

5. **Run tests**
   ```bash
   npm run test
   ```

## Docker
To run the backend service in a Docker container, use the provided `Dockerfile`. Build and run the container with:
```bash
docker-compose up --build
```

## API Endpoints
The backend exposes several API endpoints for managing fuel records. Refer to the controller files for detailed information on available routes and their usage.

## Contribution
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.