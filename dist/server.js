"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const db_1 = require("./config/db");
const socket_service_1 = require("./services/socket.service");
const logger_middleware_1 = require("./middleware/logger.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const lookup_controller_1 = require("./controllers/lookup.controller");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path_1.default.join(__dirname, '..', 'public');
// Core Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger_middleware_1.requestLogger);
// Static Web Views
app.use(express_1.default.static(PUBLIC_DIR));
// Direct QR endpoint shortcut
app.get('/api/qr', lookup_controller_1.lookupController.generateQr.bind(lookup_controller_1.lookupController));
// Health / Keep-Awake Check (For Render.com & cloud monitoring)
app.get('/ping', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Sanjeevani-ID DPI Emergency Engine (TypeScript Enterprise Edition)',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        database: db_1.dbManager.isMongoActive() ? 'MongoDB Atlas' : 'Embedded High-Speed Store',
        freeTierActive: true
    });
});
// Mount Modular API Routes
app.use('/api', routes_1.default);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
// Socket.io Service Bootstrap
socket_service_1.socketService.initialize(io);
// Server Bootstrap
async function startServer() {
    await db_1.dbManager.connect();
    server.listen(PORT, () => {
        console.log(`\n=============================================================`);
        console.log(`  SANJEEVANI-ID • ENTERPRISE TYPESCRIPT DPI ENGINE           `);
        console.log(`=============================================================`);
        console.log(`  Local URL:        http://localhost:${PORT}`);
        console.log(`  ER Doctor HUD:    http://localhost:${PORT}/er-dashboard.html`);
        console.log(`  Patient Pass:     http://localhost:${PORT}/patient.html`);
        console.log(`  Family Guardian:  http://localhost:${PORT}/family.html`);
        console.log(`  Health / Ping:    http://localhost:${PORT}/ping`);
        console.log(`  Database Layer:   ${db_1.dbManager.isMongoActive() ? 'MongoDB Atlas (Connected)' : 'Embedded Zero-Config Fallback'}`);
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
