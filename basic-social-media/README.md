# Basic Social Media

**Basic Social Media** is a simple social media application that includes essential features such as:

- User profiles
- Chat functionality
- Posting and commenting

The frontend is built with [Next.js](https://nextjs.org), and the backend runs as a separate Node.js server.

---

## Tech Stack & Libraries

### Frontend (Next.js + React):

- `Next.js` – framework for server-rendered React apps
- `React` 19 – for building UI components
- `axios` – for HTTP requests
- `socket.io-client` – real-time communication
- `framer-motion` & `motion` – animations
- `@lucia-auth/adapter-sqlite` – authentication adapter
- `Tailwind CSS` – utility-first styling

### Backend (Node.js + Express):

- `express` – server framework
- `lucia` – authentication library
- `better-sqlite3` – database layer
- `socket.io` – real-time server
- `bcrypt` – password hashing
- `cors`, `cookie`, `cookie-parser` – middleware utilities
- `@oslojs/crypto`, `@oslojs/encoding` – low-level crypto utilities
- `uuid` – for generating unique IDs

---

## Requirements

- Node.js >= 18.x
- npm >= 9.x

---

## Installation

Install dependencies by running the following command **separately** in both the main project folder and the `backend` folder:

```bash
npm install
```

---

## Running the Application

To start the application, use the following commands in separate terminals:

1. Start the frontend (in the main project folder):

```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

2. Start the backend (in the backend folder):

```bash
npm start
```

The backend server will typically run on http://localhost:8080 or another specified port.

Make sure to update the constants in `constants/app-info.js` to match your specific configuration (e.g., API URLs, feature flags, etc.).

This project is licensed for educational and personal use.
