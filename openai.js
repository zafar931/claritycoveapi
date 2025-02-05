const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Use a valid model name if "gpt-4o-mini" is not available
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "user", content: prompt },
      ],
    });

    // Return standardized response format
    res.json({ 
      choices: completion.choices 
    });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({
      error: error.message,
      code: error.code || 'SERVER_ERROR'
    });
  }
});

module.exports = router;
