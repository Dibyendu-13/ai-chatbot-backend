const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const conversationSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true, unique: true },
  messages: [{ type: String }],
  timestamps: [{ type: Date }]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

function generateRandomId() {
  return Math.random().toString(36).substring(7);
}

async function generateAIResponse(message) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
  });
  return response.choices[0].message.content.trim();
}

app.post('/chat', async (req, res) => {
  const { conversation_id, message } = req.body;
  let conversation;

  if (conversation_id) {
    conversation = await Conversation.findOne({ conversation_id });
  } else {
    conversation = new Conversation({
      conversation_id: generateRandomId(),
      messages: [],
      timestamps: []
    });
    await conversation.save();
  }

  conversation.messages.push(message);
  conversation.timestamps.push(new Date());

  const aiResponse = await generateAIResponse(message);

  conversation.messages.push(aiResponse);
  conversation.timestamps.push(new Date());

  await conversation.save();

  res.json({ conversation_id: conversation.conversation_id, reply: aiResponse });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
