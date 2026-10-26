import { Server as SocketIOServer } from 'socket.io';
import { ErAlertPayload, FamilyConsentGrantedPayload, OverrideActivatedPayload, PoliceAuditDispatchPayload } from '../types/socket.types';

export class SocketService {
  private io: SocketIOServer | null = null;

  public initialize(ioServer: SocketIOServer): void {
    this.io = ioServer;

    this.io.on('connection', (socket) => {
      console.log(`[Socket.io] Client connected: ${socket.id}`);

      socket.on('join-room', (room: string) => {
        socket.join(room);
        console.log(`[Socket.io] Client ${socket.id} joined room: ${room}`);
      });

      socket.on('doctor-scan-patient', (data: ErAlertPayload) => {
        console.log(`[Socket.io] Doctor scan broadcast for: ${data.patientId}`);
        this.broadcastErAlert(data);
      });

      socket.on('family-submit-approval', (data: FamilyConsentGrantedPayload) => {
        console.log(`[Socket.io] Family approval broadcast for: ${data.patientId}`);
        this.broadcastFamilyConsent(data);
      });

      socket.on('disconnect', () => {
        console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      });
    });
  }

  public broadcastErAlert(payload: ErAlertPayload): void {
    if (this.io) {
      this.io.emit('er-alert-triggered', payload);
    }
  }

  public broadcastFamilyConsent(payload: FamilyConsentGrantedPayload): void {
    if (this.io) {
      this.io.emit('family-consent-granted', payload);
    }
  }

  public broadcastOverride(payload: OverrideActivatedPayload): void {
    if (this.io) {
      this.io.emit('override-activated', payload);
    }
  }

  public broadcastPoliceAudit(payload: PoliceAuditDispatchPayload): void {
    if (this.io) {
      this.io.emit('override-police-audit-logged', payload);
    }
  }

  public broadcastReset(): void {
    if (this.io) {
      this.io.emit('system-reset', { message: 'Database reset to initial locked state' });
    }
  }
}

export const socketService = new SocketService();
