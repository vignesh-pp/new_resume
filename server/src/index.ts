import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { aiGateway } from './services/aiGateway.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health endpoint
app.get('/api/health', async (req, res) => {
  const aiHealth = await aiGateway.checkHealth();
  res.json({
    status: 'ok',
    server: 'node-express',
    aiServiceConnected: aiHealth,
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🌐 Express API Server running on http://localhost:${PORT}`);
  });
}

startServer();

