# Medical Quiz Master

A fully offline medical quiz application for MBBS students.

## How to run this application locally

1. Clone the repository
```sh
git clone <YOUR_REPOSITORY_URL>
```

2. Navigate to the project directory
```sh
cd <PROJECT_DIRECTORY>
```

3. Install dependencies
```sh
npm install
```

4. Start the development server
```sh
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Features

- Multiple medical subjects
- Practice and exam modes
- Question bookmarking
- Import/Export questions via Excel
- Progress tracking

## Building for Production

To create a production build:

```sh
npm run build
```

The built files will be in the `dist` directory. You can serve these files using any static file server.

## Offline Usage

This application is designed to work completely offline. All data is stored in your browser's local storage, and no internet connection is required after the initial setup.