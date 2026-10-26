"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = exports.SocketService = void 0;
class SocketService {
    io = null;
    initialize(ioServer) {
        this.io = ioServer;
        this.io.on('connection', (socket) => {
            console.log(`[Socket.io] Client connected: ${socket.id}`);
            socket.on('join-room', (room) => {
                socket.join(room);
                console.log(`[Socket.io] Client ${socket.id} joined room: ${room}`);
            });
            socket.on('doctor-scan-patient', (data) => {
                console.log(`[Socket.io] Doctor scan broadcast for: ${data.patientId}`);
                this.broadcastErAlert(data);
            });
            socket.on('family-submit-approval', (data) => {
                console.log(`[Socket.io] Family approval broadcast for: ${data.patientId}`);
                this.broadcastFamilyConsent(data);
            });
            socket.on('disconnect', () => {
                console.log(`[Socket.io] Client disconnected: ${socket.id}`);
            });
        });
    }
    broadcastErAlert(payload) {
        if (this.io) {
            this.io.emit('er-alert-triggered', payload);
        }
    }
    broadcastFamilyConsent(payload) {
        if (this.io) {
            this.io.emit('family-consent-granted', payload);
        }
    }
    broadcastOverride(payload) {
        if (this.io) {
            this.io.emit('override-activated', payload);
        }
    }
    broadcastPoliceAudit(payload) {
        if (this.io) {
            this.io.emit('override-police-audit-logged', payload);
        }
    }
    broadcastReset() {
        if (this.io) {
            this.io.emit('system-reset', { message: 'Database reset to initial locked state' });
        }
    }
}
exports.SocketService = SocketService;
exports.socketService = new SocketService();
