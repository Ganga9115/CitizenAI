import 'dotenv/config';
import axios from 'axios';

async function testGroqModels() {

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.log('GROQ_API_KEY is missing');
    return;
  }

  try {

    const response = await axios.get(
      'https://api.groq.com/openai/v1/models',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    console.log('\n========== AVAILABLE GROQ MODELS ==========\n');

    for (const model of response.data.data) {
      console.log(model.id);
    }

    console.log(
      '\n===========================================\n'
    );

  } catch (error: any) {

    console.error(
      'Groq model list failed:'
    );

    console.error(
      error.response?.data ||
      error.message
    );
  }
}

testGroqModels();