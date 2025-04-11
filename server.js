const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { OpenAI } = require('openai');  // Import OpenAI
const cors = require('cors');  // Import CORS
require('dotenv').config();  // Load .env file

// Initialize OpenAI API with the key from .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Using environment variable
});

// Initialize Express App
const app = express();

// Use CORS to allow requests from your React frontend on port 3000
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from React frontend
  methods: ['GET', 'POST'], // Allow only GET and POST methods
  allowedHeaders: ['Content-Type'], // Allow content type header
}));

app.use(bodyParser.json());

// MongoDB Connection using environment variable
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB Schema and Model
const conversationSchema = new mongoose.Schema({
    conversation_id: { type: String, required: true, unique: true },
    messages: [{ type: String }],
    timestamps: [{ type: Date }]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Helper function to generate random conversation ID
function generateRandomId() {
    return Math.random().toString(36).substring(7);
}

// AI Response Generator
async function generateAIResponse(message) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',  // Use the appropriate model here
        messages: [
            {
                role: 'user',
                content: message,
            },
        ],
    });
    return response.choices[0].message.content.trim();
}

// POST Route to handle conversations
app.post('/chat', async (req, res) => {
    const { conversation_id, message } = req.body;

    let conversation;

    // If a conversation_id is provided, retrieve it from the database
    if (conversation_id) {
        conversation = await Conversation.findOne({ conversation_id });
    } else {
        // If no conversation_id is provided, create a new conversation
        conversation = new Conversation({
            conversation_id: generateRandomId(),
            messages: [],
            timestamps: []
        });
        await conversation.save();
    }

    // Store the user's message and timestamp
    conversation.messages.push(message);
    conversation.timestamps.push(new Date());

    // Get AI's response to the user's message
    const aiResponse = await generateAIResponse(message);

    // Store AI's response and timestamp
    conversation.messages.push(aiResponse);
    conversation.timestamps.push(new Date());

    // Save conversation
    await conversation.save();

    // Send back the conversation ID and AI's reply
    res.json({ conversation_id: conversation.conversation_id, reply: aiResponse });
});

// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
