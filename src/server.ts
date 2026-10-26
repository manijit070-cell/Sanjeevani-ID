import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';

import { dbManager } from './config/db';
import { socketService } from './services/socket.service';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './routes';
import { lookupController } from './controllers/lookup.controller';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Static Web Views
app.use(express.static(PUBLIC_DIR));

// Direct QR endpoint shortcut
app.get('/api/qr', lookupController.generateQr.bind(lookupController));

// Health / Keep-Awake Check (For Render.com & cloud monitoring)
app.get('/ping', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sanjeevani-ID DPI Emergency Engine (TypeScript Enterprise Edition)',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: dbManager.isMongoActive() ? 'MongoDB Atlas' : 'Embedded High-Speed Store',
    freeTierActive: true
  });
});

// Mount Modular API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Socket.io Service Bootstrap
socketService.initialize(io);

// Server Bootstrap
async function startServer() {
  await dbManager.connect();

  server.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`  SANJEEVANI-ID • ENTERPRISE TYPESCRIPT DPI ENGINE           `);
    console.log(`=============================================================`);
    console.log(`  Local URL:        http://localhost:${PORT}`);
    console.log(`  ER Doctor HUD:    http://localhost:${PORT}/er-dashboard.html`);
    console.log(`  Patient Pass:     http://localhost:${PORT}/patient.html`);
    console.log(`  Family Guardian:  http://localhost:${PORT}/family.html`);
    console.log(`  Health / Ping:    http://localhost:${PORT}/ping`);
    console.log(`  Database Layer:   ${dbManager.isMongoActive() ? 'MongoDB Atlas (Connected)' : 'Embedded Zero-Config Fallback'}`);
    console.log(`  AI Triage Engine: ${process.env.GEMINI_API_KEY ? 'Gemini 2.5 Flash Free Tier' : 'Clinical Decision Fallback Active'}`);
    console.log(`=============================================================\n`);
  });
}

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

startServer().catch(err => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
