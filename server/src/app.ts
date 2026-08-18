import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import { ENV } from './config/env';
import {
  errorHandler
} from './middleware/errorHandler.middleware';

import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import complaintRoutes from './routes/complaint.routes';
import officerRoutes from './routes/officer.routes';
import adminRoutes from './routes/admin.routes';
import analyticsRoutes from './routes/analytics.routes';
import chatRoutes from './routes/chat.routes';

const app =
  express();

// ==========================================================
// SECURITY
// ==========================================================

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// ==========================================================
// CORS
// ==========================================================

app.use(
  cors({
    origin:
      ENV.CLIENT_URL,

    credentials: true
  })
);

// ==========================================================
// BODY PARSING
// ==========================================================

app.use(
  express.json({
    limit: '50mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb'
  })
);

// ==========================================================
// UPLOADS
// ==========================================================

app.use(
  '/uploads',
  express.static(
    path.join(
      process.cwd(),
      'uploads'
    )
  )
);

// ==========================================================
// HEALTH
// ==========================================================

app.get(
  '/health',
  (_req, res) => {

    res.json({

      status: 'online',

      timestamp:
        new Date().toISOString(),

      service:
        'AI-Powered Citizen Call Intelligence Platform Backend',

      groqConfigured:
        !!ENV.GROQ_API_KEY,

      geminiConfigured:
        !!ENV.GEMINI_API_KEY,

      chatProvider:
        ENV.AI_CHAT_PROVIDER,

      chatModel:
        ENV.AI_CHAT_PROVIDER === 'gemini'
          ? ENV.GEMINI_CHAT_MODEL
          : ENV.GROQ_CHAT_MODEL,

      supabaseConfigured:
        !!(
          ENV.SUPABASE_URL &&
          ENV.SUPABASE_ANON_KEY
        )
    });
  }
);

// ==========================================================
// API ROUTES
// ==========================================================

app.use(
  '/api/v1/auth',
  authRoutes
);

app.use(
  '/api/v1/ai',
  aiRoutes
);

app.use(
  '/api/v1/complaints',
  complaintRoutes
);

app.use(
  '/api/v1/officer',
  officerRoutes
);

app.use(
  '/api/v1/admin',
  adminRoutes
);

app.use(
  '/api/v1/analytics',
  analyticsRoutes
);

// ==========================================================
// CITIZEN CHATBOT
// ==========================================================

app.use(
  '/api/v1/chat',
  chatRoutes
);

// ==========================================================
// GLOBAL ERROR HANDLER
// ==========================================================

app.use(
  errorHandler
);

// ==========================================================
// SERVER
// ==========================================================

if (
  process.env.NODE_ENV !== 'test'
) {

  app.listen(
    ENV.PORT,
    () => {

      console.log(
        '===================================================='
      );

      console.log(
        ' Citizen Call Intelligence API Server Running'
      );

      console.log(
        ` Port: http://localhost:${ENV.PORT}`
      );

      console.log(
        ` Health: http://localhost:${ENV.PORT}/health`
      );

      console.log(
        ` Groq STT Key: ${
          ENV.GROQ_API_KEY
            ? 'Present'
            : 'Missing'
        }`
      );

      console.log(
        ` Gemini Key: ${
          ENV.GEMINI_API_KEY
            ? 'Present'
            : 'Missing'
        }`
      );

      console.log(
        ` Chat Provider: ${ENV.AI_CHAT_PROVIDER}`
      );

      console.log(
        ` Chat Model: ${
          ENV.AI_CHAT_PROVIDER === 'gemini'
            ? ENV.GEMINI_CHAT_MODEL
            : ENV.GROQ_CHAT_MODEL
        }`
      );

      console.log(
        ` Supabase DB: ${
          ENV.SUPABASE_URL
            ? 'Configured'
            : 'In-Memory Store Mode'
        }`
      );

      console.log(
        '===================================================='
      );
    }
  );
}

export default app;