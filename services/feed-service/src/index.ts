import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { Client } from '@elastic/elasticsearch';
import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Redis Cache Client setup
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch((err) => console.warn('Redis failed to connect:', err.message));

// Elasticsearch Client setup
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
});

// RabbitMQ consumer setup
async function startQueueConsumer() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
    const channel = await conn.createChannel();
    await channel.assertQueue('content_created');
    
    channel.consume('content_created', async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('Received new content event, indexing in Elasticsearch:', content.id);

        try {
          // Index content in Elasticsearch for search
          await esClient.index({
            index: 'submissions',
            id: content.id.toString(),
            document: {
              title: content.title,
              description: content.description,
              category: content.category,
              created_at: content.created_at,
            },
          });
          
          // Invalidate cache for new posts feed
          await redisClient.del('feed_new');
        } catch (esErr) {
          console.error('Failed to index submission in Elasticsearch:', esErr);
        }
        
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.warn('Queue consumer connection failed. Real-time indexing disabled.');
  }
}
startQueueConsumer();

// Get Categorized Feeds (Caching with Redis)
app.get('/feeds/:type', async (req, res) => {
  const { type } = req.params; // 'new', 'hot-local', 'national-issues'
  const cacheKey = `feed_${type}`;

  try {
    // 1. Try to read from Cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({ source: 'cache', data: JSON.parse(cachedData) });
    }

    // 2. Fallback query (Mock data, in real code this queries content-service or a DB)
    const mockFeeds = [
      { id: '1', title: 'Potholes on Main Street', category: 'Infrastructure', score: 98 },
      { id: '2', title: 'Water contamination issue', category: 'Health', score: 85 },
    ];

    // Cache the feeds for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(mockFeeds));

    res.json({ source: 'db', data: mockFeeds });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Search Engine using Elasticsearch
app.get('/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query parameter "q" is required' });
  }

  try {
    const result = await esClient.search({
      index: 'submissions',
      query: {
        multi_match: {
          query: q as string,
          fields: ['title', 'description', 'category'],
        },
      },
    });

    res.json({
      results: result.hits.hits.map(hit => hit._source),
      took: result.took
    });
  } catch (err: any) {
    // Return empty results/mock if ES is not fully initialized
    res.json({
      error: 'Elasticsearch connection bypassed',
      results: [
        { title: `Mock Result matching "${q}"`, description: 'Sample search indexing description placeholder.' }
      ]
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const redisPing = await redisClient.ping();
    const esPing = await esClient.ping().catch(() => false);
    res.json({
      status: 'ok',
      service: 'feed-service',
      redis: redisPing === 'PONG' ? 'connected' : 'disconnected',
      elasticsearch: esPing ? 'connected' : 'disconnected',
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Feed & Discovery Service running on port ${PORT}`);
});
