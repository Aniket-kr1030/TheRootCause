import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/moderation_db',
});

app.use(cors());
app.use(express.json());

// List of flagged spam terms for simple troll detection
const SPAM_KEYWORDS = ['fake', 'scam', 'spam', 'hack', 'sell product'];

// Upvote/Downvote with mandatory explanation comments
app.post('/votes', async (req, res) => {
  const { submissionId, voterId, voteType, reason } = req.body;

  // 1. Enforce validation rule: voting requires a constructive comment explaining why
  if (!reason || reason.trim().length < 15) {
    return res.status(400).json({
      error: 'A mandatory constructive comment (minimum 15 characters) is required to vote on submissions.'
    });
  }

  // 2. Perform simple automated troll / moderation filtering on the comment text
  const isTrollComment = SPAM_KEYWORDS.some(keyword => reason.toLowerCase().includes(keyword));
  const moderationStatus = isTrollComment ? 'flagged' : 'approved';

  try {
    // 3. Save Vote and Moderation audit to Database
    const query = `
      INSERT INTO votes (submission_id, voter_id, vote_value, comment, moderation_status, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [
      submissionId,
      voterId,
      voteType === 'up' ? 1 : -1,
      reason,
      moderationStatus
    ]);

    res.json({
      message: isTrollComment 
        ? 'Vote submitted but comment flagged automatically by moderation filter.' 
        : 'Vote and comment registered successfully.',
      vote: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      service: 'community-service',
      dbTime: dbCheck.rows[0].now,
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Community & Moderation Service running on port ${PORT}`);
});
