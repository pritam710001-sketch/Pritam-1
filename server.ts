import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Translation endpoint with grammatical reasoning
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLang, targetLangName, documentTitle } = req.body;
      if (!text || !targetLang) {
        return res.status(400).json({ error: 'Missing text or targetLang parameter' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });
      }

      const ai = new GoogleGenAI();
      const prompt = `You are a certified professional academic translator and competitive examination specialist.
Translate the following imported document page into ${targetLangName || targetLang}.

RULES FOR LOGICAL AND GRAMMATICAL ACCURACY:
1. Scan every word and sentence with thorough grammatical and logical thinking.
2. In Indian languages (e.g. Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Odia, Malayalam, Punjabi), enforce standard Subject-Object-Verb (SOV) order and appropriate formal academic register.
3. Preserve all document layout, headings, section titles, numbered lists (1., 2., 3.), bullet points (•, -), formulas, questions, and options.
4. Keep technical and mathematical symbols intact.
5. Translate faithfully without adding any conversational banter, conversational pleasantries, or preamble.
6. Note: Do not describe or change any images, diagrams, or figures; translate only textual and formulaic content.

Document Content:
"""
${(text || '').slice(0, 10000)}
"""`;

      const contents: any[] = [];
      const { imageBase64, imageMimeType } = req.body;
      if (imageBase64 && typeof imageBase64 === 'string') {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        contents.push({
          inlineData: {
            data: cleanBase64,
            mimeType: imageMimeType || 'image/jpeg'
          }
        });
      }
      contents.push(prompt);

      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let translatedText = '';
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
          });
          translatedText = response.text?.trim() || '';
          if (translatedText) {
            break;
          }
        } catch (mErr: any) {
          lastError = mErr;
          console.warn(`Model ${model} unavailable (${mErr?.message || mErr}), trying next candidate...`);
        }
      }

      if (!translatedText && lastError) {
        throw lastError;
      }

      return res.json({ success: true, translatedText });
    } catch (err: any) {
      console.warn('Gemini API Translation fallback triggered:', err?.message || err);
      return res.status(502).json({ error: err?.message || 'Gemini model unavailable' });
    }
  });

  // Mount Vite middlewares in development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Application server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
