# FuelEU Maritime Frontend Documentation

## Overview
FuelEU Maritime is a full-stack application designed to manage and track fuel records in the maritime industry. This frontend application is built using React and TypeScript, leveraging Vite as the build tool for a fast and efficient development experience.

## Project Structure
The frontend application follows a hexagonal architecture, which separates the core business logic from the external interfaces. Below is the structure of the frontend directory:

```
frontend
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── components          # Reusable UI components
│   │   ├── layout         # Layout components (Header, Footer)
│   │   └── ui             # UI components (Button)
│   ├── domain             # Domain models
│   │   └── models
│   │       └── FuelRecord.ts
│   ├── hooks              # Custom hooks
│   │   └── useAuth.ts
│   ├── pages              # Application pages
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   └── Home.tsx
│   ├── ports              # Interfaces for data access
│   │   └── FuelRepository.ts
│   ├── services           # Business logic
│   │   └── fuelService.ts
│   ├── store              # State management
│   │   └── index.ts
│   ├── tests              # Unit tests
│   │   └── App.test.tsx
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point for the application
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd FuelEU-Maritime/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm run dev
```
This will start the application on `http://localhost:3000` (or another port if specified).

### Building for Production
To create a production build, run:
```
npm run build
```
The build artifacts will be stored in the `dist` directory.

## Features
- User authentication and authorization
- Dashboard for viewing fuel records
- Home page with an overview of the application
- Responsive design with reusable components

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.