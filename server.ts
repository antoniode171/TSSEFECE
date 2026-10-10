import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Enable trust proxy for reverse proxies (Nginx, Traefik, Cloudflare, AWS ALB, GCP Cloud Run)
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));

// CORS headers for universal cross-server compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Health check endpoints for Docker, Kubernetes, AWS ECS, GCP Cloud Run, Render, Railway
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    nodeVersion: process.version,
    platform: process.platform,
  });
});

// Search Grounding endpoint for Telecom Field Data & Regulations
app.post('/api/telecom-search', async (req, res) => {
  try {
    const { query, siteContext } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: '⚠️ **Aviso de Configuración del Servidor**: La variable `GEMINI_API_KEY` no está configurada en este servidor.\n\nPara activar las consultas en tiempo real con Google Search Grounding:\n1. Agregue `GEMINI_API_KEY=su_clave_aqui` a las variables de entorno o al archivo `.env`.\n2. Reinicie el servicio.\n\n*Nota: Todas las demás funciones de inspección, cálculo eléctrico, planos y exportación PDF funcionan de manera autónoma en su servidor.*',
        grounding: { queries: [], sources: [] },
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

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
  const distPath = path.resolve(__dirname, 'dist');
  const distIndexExists = fs.existsSync(path.resolve(distPath, 'index.html'));

  // In AI Studio dev mode, DISABLE_HMR is set to 'true'. When developing, use Vite middleware.
  // In production builds (or when dist/ exists and not running dev mode), serve the compiled app directly.
  const isAiStudioDev = process.env.DISABLE_HMR === 'true' && process.env.NODE_ENV !== 'production';

  if (!isAiStudioDev && (process.env.NODE_ENV === 'production' || distIndexExists)) {
    // Universal production static server
    app.use(express.static(distPath, {
      maxAge: '1h',
      etag: true,
    }));

    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });

    console.log(`[Production Mode] Serving pre-compiled static assets from ${distPath}`);
  } else {
    // Development mode with Vite SPA middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`[Development Mode] Vite SPA middleware mounted`);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Site Survey Telecom Pro server running at http://${HOST}:${PORT}`);
  });

  // Graceful shutdown handling for Docker, Kubernetes, PM2, systemd
  const handleShutdown = (signal: string) => {
    console.log(`${signal} received. Closing HTTP server gracefully...`);
    server.close(() => {
      console.log('HTTP server closed. Process exiting.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer();
