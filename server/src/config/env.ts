import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT || 5000),

  NODE_ENV:
    process.env.NODE_ENV || 'development',

  JWT_SECRET:
    process.env.JWT_SECRET ||
    'super-secret-jwt-key-citizen-intelligence-2026',

  JWT_EXPIRES_IN:
    process.env.JWT_EXPIRES_IN || '7d',

  // ========================================================
  // SUPABASE
  // ========================================================

  SUPABASE_URL:
    process.env.SUPABASE_URL || '',

  SUPABASE_ANON_KEY:
    process.env.SUPABASE_ANON_KEY || '',

  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // ========================================================
  // GROQ
  // ========================================================

  GROQ_API_KEY:
    process.env.GROQ_API_KEY || '',

  GROQ_CHAT_MODEL:
    process.env.GROQ_CHAT_MODEL,

  // ========================================================
  // GEMINI
  // ========================================================

  GEMINI_API_KEY:
    process.env.GEMINI_API_KEY || '',

  GEMINI_CHAT_MODEL:
    process.env.GEMINI_CHAT_MODEL ||
    'gemini-2.5-flash',

  // ========================================================
  // CHAT PROVIDER
  // ========================================================

  AI_CHAT_PROVIDER:
    (
      process.env.AI_CHAT_PROVIDER ||
      'groq'
    ).toLowerCase(),

  // ========================================================
  // CLIENT
  // ========================================================

  CLIENT_URL:
    process.env.CLIENT_URL ||
    'http://localhost:5173'
};