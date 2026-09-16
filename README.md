# NewsHub

A modern, responsive news aggregation web application built with React. NewsHub delivers real-time global news headlines organized by category and country, featuring client-side search, article bookmarking, and reader modal views.

## Features

- **Category Filtering**: Browse headlines across multiple categories including General, Technology, Business, Entertainment, Sports, Science, and Health.
- **Regional Coverage**: Filter news from various regions, including India, the United States, the United Kingdom, and Australia.
- **Real-Time Search**: Instant client-side filtering by keyword, topic, or publisher name.
- **Saved Articles**: Bookmark articles for later reading with persistence via browser `localStorage`.
- **Reader Modal**: View expanded article summaries and metadata with direct links to original publisher coverage.
- **Resilient Data Layer**: Gracefully handles network and API rate limits with fallback dataset integration.

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6 (`HashRouter`)
- **HTTP Client**: Axios
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Tabler Icons

## Project Structure

```text
NewsHub-React.js/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   └── Home.jsx          # Main news dashboard and views
│   ├── App.css               # Application layout and styling
│   ├── App.js                # Root component and router configuration
│   ├── index.css             # Base stylesheet
│   └── index.js              # Application entry point
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v16 or higher recommended)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/animeshthomas/NewsHub-React.js.git
   cd NewsHub-React.js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:

```bash
npm start
```

The application will run locally at `http://localhost:3000`.

### Production Build

To build the project for production:

```bash
npm run build
```

The compiled output will be generated inside the `build/` directory.

## License

This project is licensed under the MIT License.
