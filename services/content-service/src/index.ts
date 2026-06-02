import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import amqp from 'amqplib';
import multer from 'multer';
import exifr from 'exifr';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/content_db',
});

// MinIO S3 client connection config
const s3 = new AWS.S3({
  endpoint: process.env.MINIO_ENDPOINT || 'http://minio:9000',
  accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

app.use(cors());
app.use(express.json());

let channel: amqp.Channel | null = null;

// Connect to RabbitMQ
async function connectQueue() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
    channel = await conn.createChannel();
    await channel.assertQueue('content_created');
    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.warn('RabbitMQ connection failed. Messages will not be sent to queue.');
  }
}
connectQueue();

// Submission with EXIF handling & image upload
app.post('/submissions', upload.single('media'), async (req, res) => {
  const { title, description, category, authorId } = req.body;
  const file = req.file;
  
  let exifData = null;
  let mediaUrl = '';

  try {
    if (file) {
      // 1. Extract EXIF data (GPS/Camera settings) to verify location
      try {
        exifData = await exifr.parse(file.buffer);
      } catch (exifErr) {
        console.warn('No valid EXIF metadata found in media file');
      }

      // 2. Upload file to MinIO (S3) bucket
      const bucketName = 'media-uploads';
      const key = `${Date.now()}_${file.originalname}`;
      
      await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();
      
      mediaUrl = `${process.env.MINIO_PUBLIC_URL || 'http://localhost:9000'}/${bucketName}/${key}`;
    }

    // 3. Save submission to PostgreSQL
    const query = `
      INSERT INTO submissions (title, description, category, author_id, media_url, exif_metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [
      title,
      description,
      category,
      authorId || 'u_anonymous',
      mediaUrl,
      exifData ? JSON.stringify(exifData) : null
    ]);

    const newSubmission = result.rows[0];

    // 4. Publish Event to Message Queue
    if (channel) {
      channel.sendToQueue('content_created', Buffer.from(JSON.stringify(newSubmission)));
    }

    res.status(201).json({
      message: 'Submission created successfully',
      submission: newSubmission
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
      service: 'content-service',
      dbTime: dbCheck.rows[0].now,
      queueConnected: channel !== null
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Content Service running on port ${PORT}`);
});
