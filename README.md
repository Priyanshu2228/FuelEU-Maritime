# FuelEU Maritime

FuelEU Maritime is a full-stack application designed to manage and track fuel records in compliance with the FuelEU Maritime regulations. This project is structured using hexagonal architecture, ensuring a clear separation of concerns between the different layers of the application.

## Project Structure

The project is divided into two main parts: the frontend and the backend.

### Frontend

The frontend is built using React and TypeScript, utilizing Vite as the build tool. It features a responsive user interface that allows users to interact with fuel records.

- **Main Technologies**: React, TypeScript, Vite
- **Key Features**:
  - User authentication
  - Dashboard for viewing fuel records
  - Forms for adding new fuel records

### Backend

The backend is built using Node.js and TypeScript, leveraging Express for the server framework and Prisma for database interactions. It provides a RESTful API for the frontend to communicate with.

- **Main Technologies**: Node.js, TypeScript, Express, Prisma
- **Key Features**:
  - CRUD operations for fuel records
  - Integration with external emissions services
  - Logging and error handling

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Docker (for containerization)
- PostgreSQL (or any other supported database)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd FuelEU-Maritime
   ```

2. Set up the backend:
   - Navigate to the backend directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Set up the database by configuring the `.env` file based on the `.env.example` provided.

3. Set up the frontend:
   - Navigate to the frontend directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```

### Running the Application

- To run the backend:
  ```
  cd backend
  npm run start
  ```

- To run the frontend:
  ```
  cd frontend
  npm run dev
  ```

### Docker

To run the application using Docker, you can use the provided `docker-compose.yml` file. This will set up both the frontend and backend services along with the database.

1. Build and run the containers:
   ```
   docker-compose up --build
   ```

