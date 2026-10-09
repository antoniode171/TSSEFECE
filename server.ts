import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Search Grounding endpoint for Telecom Field Data & Regulations
app.post('/api/telecom-search', async (req, res) => {
  try {
    const { query, siteContext } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const systemInstruction = `
Eres un Ingeniero Consultor Senior en Telecomunicaciones de Nokia y Tigo experto en Site Surveys, despliegue de redes móviles (4G LTE, 5G NR sub-6GHz y mmWave), plantas de fuerza DC (-48V), sistemas de puesta a tierra (RETIE, IEEE 142), ODFs y tendidos de fibra óptica.
Usa Google Search para obtener información actualizada, especificaciones técnicas exactas, normativas vigentes en Colombia/LatAm y datos técnicos de campo.
Responde de forma concisa, profesional, técnica y estructurada con viñetas claras y recomendaciones prácticas para técnicos de campo en smartphones.
`;

    const promptText = `
Contexto del Sitio Relevado:
${siteContext ? JSON.stringify(siteContext) : 'Auditoría general de estación base telecom'}

Pregunta o Consulta Técnica del Ingeniero en Campo:
${query}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || 'No se obtuvo respuesta del modelo.';
    
    // Extract search grounding metadata if available
    const searchChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        web: chunk.web || null,
      })) || [];
    
    const searchQueries =
      response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    return res.json({
      answer: text,
      grounding: {
        queries: searchQueries,
        sources: searchChunks.filter((c: any) => c.web && c.web.uri),
      },
    });
  } catch (error: any) {
    console.error('Error in /api/telecom-search:', error);
    return res.status(500).json({
      error: error?.message || 'Error al consultar información con Search Grounding',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
