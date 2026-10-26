import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { IPatient } from '../types/patient.types';
import { PatientModel } from '../models/patient.model';
import { SEED_PATIENTS } from '../data/seedData';

const LOCAL_DB_PATH = path.join(__dirname, '..', '..', 'data', 'db.json');

class DatabaseManager {
  private isConnectedToMongo: boolean = false;
  private localPatients: IPatient[] = [];

  constructor() {
    this.initLocalStore();
  }

  private initLocalStore(): void {
    try {
      const dataDir = path.dirname(LOCAL_DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(LOCAL_DB_PATH)) {
        const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.localPatients = parsed.patients || [];
      } else {
        this.localPatients = JSON.parse(JSON.stringify(SEED_PATIENTS));
        this.saveLocalStore();
      }
    } catch (e) {
      console.warn('⚠️ Fallback store initialized in memory:', e);
      this.localPatients = JSON.parse(JSON.stringify(SEED_PATIENTS));
    }
  }

  private saveLocalStore(): void {
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ patients: this.localPatients, auditLogs: [] }, null, 2));
    } catch (e) {
      console.error('Error saving local store:', e);
    }
  }

  public async connect(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim().length > 0) {
      try {
        console.log('🔄 Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUri.trim(), {
          serverSelectionTimeoutMS: 5000,
        });
        this.isConnectedToMongo = true;
        console.log('✅ Connected to MongoDB Atlas successfully.');
        await this.seedMongoIfEmpty();
        return;
      } catch (err: any) {
        console.warn(`⚠️ MongoDB Atlas connection failed (${err.message}). Activating embedded zero-setup store.`);
      }
    } else {
      console.log('💡 No MONGODB_URI provided. Running on embedded high-speed zero-config database (100% Free).');
    }

    this.isConnectedToMongo = false;
  }

  private async seedMongoIfEmpty(): Promise<void> {
    try {
      const count = await PatientModel.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding MongoDB Atlas with initial emergency profiles...');
        await PatientModel.insertMany(SEED_PATIENTS);
        console.log(`✅ Seeded ${SEED_PATIENTS.length} patient profiles into MongoDB.`);
      }
    } catch (e) {
      console.error('Error checking/seeding Mongo:', e);
    }
  }

  public isMongoActive(): boolean {
    return this.isConnectedToMongo;
  }

  // Unified Repository Methods
  public async getAllPatients(): Promise<IPatient[]> {
    if (this.isConnectedToMongo) {
      try {
        const docs = await PatientModel.find().lean();
        return docs as unknown as IPatient[];
      } catch (e) {
        console.warn('Mongo read error, falling back to local:', e);
      }
    }
    return this.localPatients;
  }

  public async getPatientById(id: string): Promise<IPatient | null> {
    const cleanId = id.toUpperCase().trim();
    if (this.isConnectedToMongo) {
      try {
        const doc = await PatientModel.findOne({ id: cleanId }).lean();
        if (doc) return doc as unknown as IPatient;
      } catch (e) {
        console.warn('Mongo findOne error, falling back to local:', e);
      }
    }
    const match = this.localPatients.find(p => p.id.toUpperCase() === cleanId);
    return match || null;
  }

  public async getPatientByVehicle(vehicleNo: string): Promise<IPatient | null> {
    const cleaned = vehicleNo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (this.isConnectedToMongo) {
      try {
        const docs = await PatientModel.find().lean();
        const matched = docs.find((d: any) => d.vehicleNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === cleaned);
        if (matched) return matched as unknown as IPatient;
      } catch (e) {
        console.warn('Mongo vehicle search error:', e);
      }
    }
    return this.localPatients.find(p => p.vehicleNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === cleaned) || null;
  }

  public async updatePatient(patient: IPatient): Promise<IPatient> {
    if (this.isConnectedToMongo) {
      try {
        await PatientModel.findOneAndUpdate({ id: patient.id }, patient, { new: true, upsert: true });
      } catch (e) {
        console.warn('Mongo update error:', e);
      }
    }

    const idx = this.localPatients.findIndex(p => p.id.toUpperCase() === patient.id.toUpperCase());
    if (idx !== -1) {
      this.localPatients[idx] = patient;
    } else {
      this.localPatients.push(patient);
    }
    this.saveLocalStore();
    return patient;
  }

  public async resetDemoState(): Promise<void> {
    this.localPatients = JSON.parse(JSON.stringify(SEED_PATIENTS));
    this.saveLocalStore();

    if (this.isConnectedToMongo) {
      try {
        await PatientModel.deleteMany({});
        await PatientModel.insertMany(SEED_PATIENTS);
        console.log('✅ MongoDB Atlas re-seeded to default locked state.');
      } catch (e) {
        console.error('Mongo reset error:', e);
      }
    }
  }
}

export const dbManager = new DatabaseManager();
