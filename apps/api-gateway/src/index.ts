import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan('dev'));

// Routing map based on service configuration
const routes = {
  '/api/v1/auth': process.env.IDENTITY_SERVICE_URL || 'http://identity-service:3001',
  '/api/v1/content': process.env.CONTENT_SERVICE_URL || 'http://content-service:3002',
  '/api/v1/feed': process.env.FEED_SERVICE_URL || 'http://feed-service:3003',
  '/api/v1/community': process.env.COMMUNITY_SERVICE_URL || 'http://community-service:3004',
};

// Apply proxies
Object.entries(routes).forEach(([path, target]) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${path}`]: '', // strip prefix when forwarding
      },
    })
  );
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
