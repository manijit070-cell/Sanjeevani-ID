import { DigitalSignature, InsuranceClearance, ClinicalRecord, PastSurgery, Tier2Data, OverrideAudit } from './patient.types';

export interface ErAlertPayload {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  hospitalName: string;
  gpsLocation: string;
  timestamp: string;
  primaryContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface FamilyConsentGrantedPayload {
  patientId: string;
  patientName: string;
  consentToken: string;
  unlockedAt: string;
  signature: DigitalSignature;
  insuranceClearance: InsuranceClearance;
  clinicalRecords: ClinicalRecord[];
  pastSurgeries: PastSurgery[];
}

export interface OverrideActivatedPayload {
  patientId: string;
  patientName: string;
  overrideToken: string;
  unlockedAt: string;
  tier2: Tier2Data;
  overrideAudit?: OverrideAudit | null;
}

export interface PoliceAuditDispatchPayload {
  patientId: string;
  patientName: string;
  overrideToken: string;
  audit: OverrideAudit;
  policeDocketNumber: string;
  policeStationNotified: string;
  timestamp: string;
}
