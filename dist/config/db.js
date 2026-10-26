"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const patient_model_1 = require("../models/patient.model");
const seedData_1 = require("../data/seedData");
const LOCAL_DB_PATH = path_1.default.join(__dirname, '..', '..', 'data', 'db.json');
class DatabaseManager {
    isConnectedToMongo = false;
    localPatients = [];
    constructor() {
        this.initLocalStore();
    }
    initLocalStore() {
        try {
            const dataDir = path_1.default.dirname(LOCAL_DB_PATH);
            if (!fs_1.default.existsSync(dataDir)) {
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            }
            if (fs_1.default.existsSync(LOCAL_DB_PATH)) {
                const raw = fs_1.default.readFileSync(LOCAL_DB_PATH, 'utf-8');
                const parsed = JSON.parse(raw);
                this.localPatients = parsed.patients || [];
            }
            else {
                this.localPatients = JSON.parse(JSON.stringify(seedData_1.SEED_PATIENTS));
                this.saveLocalStore();
            }
        }
        catch (e) {
            console.warn('⚠️ Fallback store initialized in memory:', e);
            this.localPatients = JSON.parse(JSON.stringify(seedData_1.SEED_PATIENTS));
        }
    }
    saveLocalStore() {
        try {
            fs_1.default.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ patients: this.localPatients, auditLogs: [] }, null, 2));
        }
        catch (e) {
            console.error('Error saving local store:', e);
        }
    }
    async connect() {
        const mongoUri = process.env.MONGODB_URI;
        if (mongoUri && mongoUri.trim().length > 0) {
            try {
                console.log('🔄 Connecting to MongoDB Atlas...');
                await mongoose_1.default.connect(mongoUri.trim(), {
                    serverSelectionTimeoutMS: 5000,
                });
                this.isConnectedToMongo = true;
                console.log('✅ Connected to MongoDB Atlas successfully.');
                await this.seedMongoIfEmpty();
                return;
            }
            catch (err) {
                console.warn(`⚠️ MongoDB Atlas connection failed (${err.message}). Activating embedded zero-setup store.`);
            }
        }
        else {
            console.log('💡 No MONGODB_URI provided. Running on embedded high-speed zero-config database (100% Free).');
        }
        this.isConnectedToMongo = false;
    }
    async seedMongoIfEmpty() {
        try {
            const count = await patient_model_1.PatientModel.countDocuments();
            if (count === 0) {
                console.log('🌱 Seeding MongoDB Atlas with initial emergency profiles...');
                await patient_model_1.PatientModel.insertMany(seedData_1.SEED_PATIENTS);
                console.log(`✅ Seeded ${seedData_1.SEED_PATIENTS.length} patient profiles into MongoDB.`);
            }
        }
        catch (e) {
            console.error('Error checking/seeding Mongo:', e);
        }
    }
    isMongoActive() {
        return this.isConnectedToMongo;
    }
    // Unified Repository Methods
    async getAllPatients() {
        if (this.isConnectedToMongo) {
            try {
                const docs = await patient_model_1.PatientModel.find().lean();
                return docs;
            }
            catch (e) {
                console.warn('Mongo read error, falling back to local:', e);
            }
        }
        return this.localPatients;
    }
    async getPatientById(id) {
        const cleanId = id.toUpperCase().trim();
        if (this.isConnectedToMongo) {
            try {
                const doc = await patient_model_1.PatientModel.findOne({ id: cleanId }).lean();
                if (doc)
                    return doc;
            }
            catch (e) {
                console.warn('Mongo findOne error, falling back to local:', e);
            }
        }
        const match = this.localPatients.find(p => p.id.toUpperCase() === cleanId);
        return match || null;
    }
    async getPatientByVehicle(vehicleNo) {
        const cleaned = vehicleNo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (this.isConnectedToMongo) {
            try {
                const docs = await patient_model_1.PatientModel.find().lean();
                const matched = docs.find((d) => d.vehicleNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === cleaned);
                if (matched)
                    return matched;
            }
            catch (e) {
                console.warn('Mongo vehicle search error:', e);
            }
        }
        return this.localPatients.find(p => p.vehicleNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === cleaned) || null;
    }
    async updatePatient(patient) {
        if (this.isConnectedToMongo) {
            try {
                await patient_model_1.PatientModel.findOneAndUpdate({ id: patient.id }, patient, { new: true, upsert: true });
            }
            catch (e) {
                console.warn('Mongo update error:', e);
            }
        }
        const idx = this.localPatients.findIndex(p => p.id.toUpperCase() === patient.id.toUpperCase());
        if (idx !== -1) {
            this.localPatients[idx] = patient;
        }
        else {
            this.localPatients.push(patient);
        }
        this.saveLocalStore();
        return patient;
    }
    async resetDemoState() {
        this.localPatients = JSON.parse(JSON.stringify(seedData_1.SEED_PATIENTS));
        this.saveLocalStore();
        if (this.isConnectedToMongo) {
            try {
                await patient_model_1.PatientModel.deleteMany({});
                await patient_model_1.PatientModel.insertMany(seedData_1.SEED_PATIENTS);
                console.log('✅ MongoDB Atlas re-seeded to default locked state.');
            }
            catch (e) {
                console.error('Mongo reset error:', e);
            }
        }
    }
}
exports.dbManager = new DatabaseManager();
