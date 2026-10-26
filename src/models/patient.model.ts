import mongoose, { Schema, Document } from 'mongoose';
import { IPatient } from '../types/patient.types';

export interface PatientDocument extends IPatient, Document {}

const CriticalAlertSchema = new Schema({
  type: { type: String, required: true },
  severity: { type: String, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'], required: true },
  substance: { type: String, required: true },
  reaction: { type: String, required: true },
  alternative: { type: String }
}, { _id: false });

const ActiveConditionSchema = new Schema({
  condition: { type: String, required: true },
  year: { type: String },
  warning: { type: String },
  clinicalRisk: { type: String },
  note: { type: String }
}, { _id: false });

const EmergencyContactSchema = new Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const ClinicalRecordSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  hospital: { type: String },
  lab: { type: String },
  doctor: { type: String },
  findings: { type: String, required: true },
  pdfName: { type: String, required: true },
  ecgSvgWaveform: { type: String }
}, { _id: false });

const PastSurgerySchema = new Schema({
  procedure: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });

const DigitalSignatureSchema = new Schema({
  signerName: { type: String, required: true },
  relation: { type: String, required: true },
  signatureData: { type: String, required: true },
  timestamp: { type: String, required: true },
  verifiedGps: { type: String },
  legalStatement: { type: String, required: true }
}, { _id: false });

const OverrideAuditSchema = new Schema({
  authorizedBy: { type: String, required: true },
  idType: { type: String, enum: ['NMC_DOCTOR_ID', 'STATE_MEDICAL_COUNCIL', 'AADHAAR_CARD'], required: true },
  idNumber: { type: String, required: true },
  hospitalName: { type: String, required: true },
  department: { type: String, default: 'Trauma & Emergency Care' },
  reason: { type: String, required: true },
  faceScanDataUrl: { type: String, required: true },
  idCardDataUrl: { type: String },
  gpsCoordinates: { type: String, required: true },
  timestamp: { type: String, required: true },
  policeStationNotified: { type: String, required: true },
  policeDocketNumber: { type: String, required: true },
  legalStatute: { type: String, default: 'Section 134A Motor Vehicles Act & Section 43/66 IT Act Police Audit' }
}, { _id: false });

const PatientSchema = new Schema<PatientDocument>({
  id: { type: String, required: true, unique: true, uppercase: true, index: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup: { type: String, required: true },
  bloodGroupRarity: { type: String, required: true },
  avatar: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaarLast4: { type: String, required: true, index: true },
  abHaNumber: { type: String, required: true },
  vehicleNumber: { type: String, required: true, index: true },
  vehicleDetails: { type: String, required: true },
  city: { type: String, required: true },

  tier1: {
    bloodGroup: { type: String, required: true },
    criticalAlerts: [CriticalAlertSchema],
    activeConditions: [ActiveConditionSchema],
    currentMedications: [{ type: String }],
    emergencyContacts: [EmergencyContactSchema],
    organDonor: { type: Boolean, default: false },
    advanceDirective: { type: String }
  },

  tier2: {
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: String, default: null },
    unlockMethod: { type: String, enum: ['FAMILY_REMOTE_CONSENT', 'EMERGENCY_FAILSAFE_OVERRIDE', 'DOCTOR_BIOMETRIC_OVERRIDE', null], default: null },
    consentToken: { type: String, default: null },
    digitalSignature: { type: DigitalSignatureSchema, default: null },
    overrideAudit: { type: OverrideAuditSchema, default: null },

    insuranceClearance: {
      pmRahatScheme: {
        schemeName: { type: String, required: true },
        coverageCap: { type: String, required: true },
        policyRef: { type: String, required: true },
        status: { type: String, required: true },
        preAuthToken: { type: String, required: true },
        autoAdmitGuarantee: { type: String, required: true }
      },
      privateInsurance: {
        insurer: { type: String, required: true },
        policyNumber: { type: String, required: true },
        tpa: { type: String, required: true },
        cashlessPreAuthLimit: { type: String, required: true },
        hospitalNetworkStatus: { type: String, required: true }
      }
    },

    clinicalRecords: [ClinicalRecordSchema],
    pastSurgeries: [PastSurgerySchema]
  }
}, {
  timestamps: true
});

export const PatientModel = mongoose.model<PatientDocument>('Patient', PatientSchema);
