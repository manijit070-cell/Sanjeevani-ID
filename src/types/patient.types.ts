export interface CriticalAlert {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  substance: string;
  reaction: string;
  alternative?: string;
}

export interface ActiveCondition {
  condition: string;
  year?: string;
  warning?: string;
  clinicalRisk?: string;
  note?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  location: string;
  isPrimary: boolean;
}

export interface Tier1Data {
  bloodGroup: string;
  criticalAlerts: CriticalAlert[];
  activeConditions: ActiveCondition[];
  currentMedications: string[];
  emergencyContacts: EmergencyContact[];
  organDonor: boolean;
  advanceDirective: string;
}

export interface PmRahatScheme {
  schemeName: string;
  coverageCap: string;
  policyRef: string;
  status: string;
  preAuthToken: string;
  autoAdmitGuarantee: string;
}

export interface PrivateInsurance {
  insurer: string;
  policyNumber: string;
  tpa: string;
  cashlessPreAuthLimit: string;
  hospitalNetworkStatus: string;
}

export interface InsuranceClearance {
  pmRahatScheme: PmRahatScheme;
  privateInsurance: PrivateInsurance;
}

export interface ClinicalRecord {
  title: string;
  date: string;
  hospital?: string;
  lab?: string;
  doctor?: string;
  findings: string;
  pdfName: string;
  ecgSvgWaveform?: string;
}

export interface PastSurgery {
  procedure: string;
  date: string;
}

export interface DigitalSignature {
  signerName: string;
  relation: string;
  signatureData: string;
  timestamp: string;
  verifiedGps?: string;
  legalStatement: string;
}

export interface OverrideAudit {
  authorizedBy: string;
  idType: 'NMC_DOCTOR_ID' | 'STATE_MEDICAL_COUNCIL' | 'AADHAAR_CARD';
  idNumber: string;
  hospitalName: string;
  department: string;
  reason: string;
  faceScanDataUrl: string;
  idCardDataUrl?: string;
  gpsCoordinates: string;
  timestamp: string;
  policeStationNotified: string;
  policeDocketNumber: string;
  legalStatute: string;
}

export interface Tier2Data {
  unlocked: boolean;
  unlockedAt: string | null;
  unlockMethod: 'FAMILY_REMOTE_CONSENT' | 'EMERGENCY_FAILSAFE_OVERRIDE' | 'DOCTOR_BIOMETRIC_OVERRIDE' | null;
  consentToken: string | null;
  digitalSignature: DigitalSignature | null;
  overrideAudit?: OverrideAudit | null;
  insuranceClearance: InsuranceClearance;
  clinicalRecords: ClinicalRecord[];
  pastSurgeries: PastSurgery[];
}

export interface IPatient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  bloodGroupRarity: string;
  avatar: string;
  phone: string;
  aadhaarLast4: string;
  abHaNumber: string;
  vehicleNumber: string;
  vehicleDetails: string;
  city: string;
  tier1: Tier1Data;
  tier2: Tier2Data;
}

export interface AiTriageResult {
  rapidSummary: string;
  bloodGroupAlert: string;
  criticalHazards: string[];
  immediateActions: string[];
  speechScript: string;
}

export interface DrugCheckResult {
  safe: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'SAFE';
  status: string;
  reason: string;
  recommendation: string;
}
