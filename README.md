# 🧠 AI Chat Backend (Node.js + Express + OpenAI + MongoDB)

This project provides a simple backend API for managing conversations between a user and an AI chatbot using OpenAI's GPT-4 model. Conversations are stored in MongoDB and retrieved via a RESTful API.

## 🚀 Features

- Store and manage chat history with unique `conversation_id`
- Generate responses using OpenAI's GPT-4
- MongoDB for persisting messages and timestamps
- CORS-enabled for frontend (e.g., React)
- Lightweight and clean architecture

## 📦 Technologies Used

- Node.js
- Express
- MongoDB + Mongoose
- OpenAI API (chat completions)
- CORS
- dotenv

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Dibyendu-13/ai-chatbot-backend.git
cd ai-chatbot-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the root directory and add:

```env
PORT=5001
OPENAI_API_KEY=your_openai_api_key
MONGO_DB_CONNECTION_STRING=your_mongodb_connection_string
```

### 4. Start the Server

```bash
node index.js
```

By default, it runs on `http://localhost:5001`.

## 🧪 API Endpoint

### `POST /chat`

**Request Body:**

```json
{
  "conversation_id": "abc123", // optional
  "message": "Hello, how are you?"
}
```

**Response:**

```json
{
  "conversation_id": "abc123",
  "reply": "I'm good, thank you! How can I help you today?"
}
```

If no `conversation_id` is provided, a new one will be generated and stored.

## 💡 Example Use Case

You can connect this backend to a frontend (e.g., React app) to build an interactive chatbot that remembers previous messages in the conversation thread.

## 📂 Folder Structure

```
.
├── server.js           # Main server file
├── package.json
└── .env               # API keys and secrets (not committed)
```

## 🛡️ Security Notes

- Never expose your `.env` file or commit it to version control.
- Restrict CORS to your actual frontend URL in production.
- Consider adding input sanitization, rate limiting, and error handling for production readiness.

## 📃 License

MIT — feel free to use and modify.
