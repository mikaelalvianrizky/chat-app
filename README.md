
# Chat App with OpenAI Integration, Sessions, and Dark/Light Theme

This project is a multi-user chat application with OpenAI integration. Users can:
- Login and authenticate.
- Create and select multiple chat sessions (rooms) to start new topics.
- Interact with an AI using OpenAI's Chat Completion API (using `gpt-4o-mini`).
- Provide feedback (thumbs up/down) on AI responses.
- Toggle between dark and light themes—with the light mode using a pastel color scheme.

---

## Features

- **User Authentication:** Simple login (demo-based) with token storage.
- **Session-Based Chat:** Create new sessions and select from existing sessions.
- **OpenAI Integration:** Send messages to OpenAI's API and get intelligent responses.
- **Feedback Mechanism:** Rate AI responses with thumbs up/down.
- **Theme Toggle:** Switch between dark mode and light mode (light mode uses pastel colors).

---

## Technologies

- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express.
- **Database:** PostgreSQL using Prisma ORM.
- **Authentication:** Basic JWT (example implementation).
- **AI Integration:** OpenAI Chat Completion API.

---

## Project Structure

```
chat-app/
├── client/                # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Chat.js
│   │   ├── ChatSessions.js
│   │   ├── Navbar.js
│   │   ├── pastel.css     # Custom pastel color overrides for light mode
│   │   └── ...            # Other components and assets
│   └── package.json
├── server/                # Express Backend
│   ├── prisma/
│   │   └── schema.prisma  # Prisma schema for database models
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── chatSessions.js
│   │   └── chatFeedback.js
│   ├── .env               # Environment variables (do not commit)
│   ├── index.js           # Express entry point
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** (v14+ recommended)
- **npm** (v6+ recommended)
- **PostgreSQL** installed and running (local or remote)
- **OpenAI API Key** ([Sign up at OpenAI](https://platform.openai.com/signup/))

---

## 1. Setting Up the Database

1. **Run the PostgreSQL server.** Run the following command in your console:
   ```bash
   docker-compose up --build -d
   ```
2. **Create a PostgreSQL database.** For example, run the following SQL in your PostgreSQL console:
   ```sql
   CREATE DATABASE chat_app_db;
   ```
3. **Configure the database URL.**  
   In the `server/.env` file, add:
   ```dotenv
   DATABASE_URL="postgresql://user:password@localhost:5432/chat_app_db?schema=public"
   ```
4. **Define your data models.**  
   In `server/prisma/schema.prisma`, define your models. Example:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model User {
     id           Int           @id @default(autoincrement())
     username     String        @unique
     password     String
     chatSessions ChatSession[]
   }

   model ChatSession {
     id        Int           @id @default(autoincrement())
     userId    Int
     title     String?
     createdAt DateTime      @default(now())
     messages  ChatHistory[]
     user      User          @relation(fields: [userId], references: [id])
   }

   model ChatHistory {
     id            Int           @id @default(autoincrement())
     chatSessionId Int
     userMessage   String
     aiMessage     String
     createdAt     DateTime      @default(now())
     feedbacks     ChatFeedback[]
     chatSession   ChatSession   @relation(fields: [chatSessionId], references: [id])
   }

   model ChatFeedback {
     id            Int         @id @default(autoincrement())
     chatHistoryId Int
     rating        String      // "up" or "down"
     createdAt     DateTime    @default(now())
     chatHistory   ChatHistory @relation(fields: [chatHistoryId], references: [id])
   }
   ```
5. **Migrate and generate the Prisma client.**  
   In the `server/` folder, run:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

---

## 2. Setting Up the Server

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```
2. **Create a `.env` file** in the `server/` folder with:
   ```dotenv
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   DATABASE_URL="postgresql://user:password@localhost:5432/chat_app_db?schema=public"
   OPENAI_API_KEY=your_openai_api_key
   ```
3. **Start the server:**
   ```bash
   npm start
   ```
   The server should be running on `http://localhost:5000`.

---

## 3. Setting Up the Client

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```
2. **Include Bootstrap and custom CSS:**
   - If using npm, ensure Bootstrap is installed and imported in your `src/index.js`:
     ```jsx
     import 'bootstrap/dist/css/bootstrap.min.css';
     ```
   - Also, import your custom `pastel.css` in components that need it (e.g., `Login.js`).
3. **Start the React development server:**
   ```bash
   npm start
   ```
   The client should run on `http://localhost:3000`.

---

## 4. Running the Application

- **Backend:**  
  In the `server/` folder:
  ```bash
  npm start
  ```
- **Frontend:**  
  In the `client/` folder:
  ```bash
  npm start
  ```
- **Access the App:**  
  Open your browser and navigate to `http://localhost:3000`.

---

## 5. Usage

1. **Login:**  
   - Open the app at `http://localhost:3000` and use the login form.
   - The login form adapts its style based on the theme (pastel colors for light mode and dark styling for dark mode).
2. **Chat Sessions:**  
   - After login, create a new chat session or select an existing one.
3. **Chat:**  
   - In the chat room, send messages and receive AI responses.
   - Provide feedback using the thumbs up/down buttons next to each AI response.
4. **Theme Toggle:**  
   - Use the theme switch button in the navbar to toggle between dark and light modes.
   - In light mode, the login form and other components will display pastel colors.

---

## 6. API Endpoints Overview

- **Authentication:**  
  - `POST /api/auth/login` – Authenticate user and return a token.
- **Chat:**  
  - `POST /api/chat` – Send a user message and get an AI response.
- **Chat Sessions:**  
  - `GET /api/chat/sessions?userId=:userId` – Retrieve all chat sessions for a user.
  - `POST /api/chat/sessions` – Create a new chat session.
- **Feedback:**  
  - `POST /api/chat/feedback` – Submit feedback (thumbs up/down) for an AI response.

---

## 7. Customization & Deployment

- **Styling:**  
  Customize the pastel colors in `client/src/pastel.css` to match your preferences.
- **Security:**  
  Enhance authentication, add password hashing, and secure your JWT implementation.
- **Deployment:**  
  Deploy the backend on platforms like Heroku, AWS, or DigitalOcean. Deploy the frontend on services like Netlify or Vercel, and update API URLs as needed.

---

## 8. Contributing

Feel free to fork the repository, open issues, or submit pull requests for:
- Improved UI/UX.
- Advanced user management and security.
- Additional features such as fine-tuning using feedback.

---

## 9. License

This project is licensed under the [MIT License](LICENSE).

---

**Enjoy your Chat App with OpenAI integration!**
