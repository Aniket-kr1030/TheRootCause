import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/user_db',
});

app.use(cors());
app.use(express.json());

// OAuth Login Placeholder
app.post('/login/oauth', async (req, res) => {
  const { provider, token } = req.body;
  // Implement Google OAuth 2.0 validation flow here
  res.json({
    message: `OAuth login placeholder via ${provider}`,
    user: { id: 'u_1', name: 'John Doe', email: 'john@example.com' },
    token: 'jwt_token_stub',
  });
});

// User Verification (e.g. CAPTCHA/Phone Hashing)
app.post('/verify', async (req, res) => {
  const { captchaToken, phone } = req.body;
  res.json({ verified: true, message: 'Verification successful' });
});

// Health check and database sanity check
app.get('/health', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      service: 'identity-service',
      dbTime: dbCheck.rows[0].now,
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Identity Service running on port ${PORT}`);
});
