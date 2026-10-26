import { IPatient } from '../types/patient.types';

export const SEED_PATIENTS: IPatient[] = [
  {
    id: "ROHAN-101",
    name: "Rohan Verma",
    age: 38,
    gender: "Male",
    bloodGroup: "O-",
    bloodGroupRarity: "Universal Donor • Rare (Only 1.4% of population)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98765 43210",
    aadhaarLast4: "4912",
    abHaNumber: "91-4820-1928-4011",
    vehicleNumber: "PB-10-AB-1234",
    vehicleDetails: "Royal Enfield Hunter 350 • Reg: RTO Ludhiana, Punjab",
    city: "Ludhiana, Punjab",
    
    tier1: {
      bloodGroup: "O-",
      criticalAlerts: [
        {
          type: "FATAL ALLERGY",
          severity: "CRITICAL",
          substance: "Penicillin & Beta-Lactam Antibiotics",
          reaction: "Immediate Anaphylactic Shock, Angioedema & Respiratory Arrest",
          alternative: "Use Macrolides (Azithromycin) or Fluoroquinolones under ICU supervision"
        },
        {
          type: "SEVERE ALLERGY",
          severity: "HIGH",
          substance: "Sulfonamides (Bactrim/Septra)",
          reaction: "Stevens-Johnson Syndrome Risk & Severe Erythema"
        }
      ],
      activeConditions: [
        {
          condition: "Post-PCI LAD Coronary Artery Stent",
          year: "2024",
          note: "Drug-eluting stent placed in Left Anterior Descending artery"
        },
        {
          condition: "Active Dual Antiplatelet Therapy (DAPT)",
          warning: "PATIENT IS ON CLOPIDOGREL (PLAVIX) & BABY ASPIRIN",
          clinicalRisk: "Extreme risk of uncontrollable internal hemorrhage during emergency surgery. Requires immediate hematology consult & reversal protocol preparedness."
        }
      ],
      currentMedications: [
        "Clopidogrel 75mg OD (Antiplatelet)",
        "Aspirin 75mg OD (Blood Thinner)",
        "Atorvastatin 40mg HS (Cholesterol)",
        "Metoprolol Succinate 25mg OD (Beta Blocker)"
      ],
      emergencyContacts: [
        {
          name: "Sunil Verma",
          relation: "Father",
          phone: "+91 98765 43210",
          location: "Civil Lines, Ludhiana",
          isPrimary: true
        },
        {
          name: "Ananya Verma",
          relation: "Sister",
          phone: "+91 98111 22334",
          location: "Connaught Place, New Delhi",
          isPrimary: false
        }
      ],
      organDonor: true,
      advanceDirective: "Full Resuscitation & ICU Care Authorized by Family Guardian"
    },

    tier2: {
      unlocked: false,
      unlockedAt: null,
      unlockMethod: null,
      consentToken: null,
      digitalSignature: null,

      insuranceClearance: {
        pmRahatScheme: {
          schemeName: "Pradhan Mantri RAHAT Scheme (Cashless Road Accident Victim Treatment)",
          coverageCap: "₹1,50,000",
          policyRef: "MoRTH/GSR/2024/722-PB",
          status: "GOVERNMENT GUARANTEED",
          preAuthToken: "PM-RAHAT-PB-2026-98124",
          autoAdmitGuarantee: "Zero hospital deposit required for first 7 days of ICU/trauma care per Supreme Court & Ministry directives."
        },
        privateInsurance: {
          insurer: "Star Health & Allied Insurance",
          policyNumber: "POL-SH-7749102",
          tpa: "MediAssist India TPA Pvt Ltd",
          cashlessPreAuthLimit: "₹5,00,000",
          hospitalNetworkStatus: "Pre-Approved Cashless Hospital (Tier 1 Apollo Network)"
        }
      },

      clinicalRecords: [
        {
          title: "Coronary Angiography & LAD Stent Discharge Summary",
          date: "14 Nov 2024",
          hospital: "Medanta - The Medicity, Gurugram",
          doctor: "Dr. Naresh Trehan / Dr. R. Trehan (Chief Interventional Cardiologist)",
          findings: "Successful deployment of Promus PREMIER 3.5 x 18 mm Everolimus-Eluting Stent in mid-LAD with 0% residual stenosis and TIMI III flow.",
          pdfName: "Medanta_LAD_Stent_Discharge_2024.pdf"
        },
        {
          title: "12-Lead Electrocardiogram (ECG) Report",
          date: "10 Jan 2026",
          hospital: "Apollo Hospital Ludhiana Outpatient Cardiology",
          findings: "Normal Sinus Rhythm at 72 bpm. PR Interval 160ms, QRS 88ms. T-wave biphasic in V2-V3 consistent with previous reperfused LAD territory.",
          pdfName: "Apollo_ECG_12Lead_Jan2026.pdf",
          ecgSvgWaveform: "sinus_rhythm_stent"
        },
        {
          title: "Comprehensive Metabolic & Lipid Panel",
          date: "15 Feb 2026",
          lab: "Dr. Lal PathLabs",
          findings: "HbA1c: 5.6%, Total Cholesterol: 142 mg/dL, LDL: 64 mg/dL (Target <70 reached), Serum Creatinine: 0.9 mg/dL (Normal).",
          pdfName: "LalPathLabs_Lipid_Panel_Feb2026.pdf"
        }
      ],

      pastSurgeries: [
        { procedure: "Percutaneous Coronary Intervention (PCI)", date: "November 2024" },
        { procedure: "Appendectomy (Laparoscopic)", date: "July 2017" }
      ]
    }
  },

  {
    id: "PRIYA-202",
    name: "Priya Nair",
    age: 29,
    gender: "Female",
    bloodGroup: "B+",
    bloodGroupRarity: "B Positive • Common (Approx 32% of Indian population)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    phone: "+91 98450 11223",
    aadhaarLast4: "8821",
    abHaNumber: "91-3091-8841-2299",
    vehicleNumber: "DL-01-XY-9081",
    vehicleDetails: "Hyundai Creta SX • Reg: RTO Sheikh Sarai, New Delhi",
    city: "New Delhi",

    tier1: {
      bloodGroup: "B+",
      criticalAlerts: [
        {
          type: "FATAL ALLERGY",
          severity: "CRITICAL",
          substance: "Natural Rubber Latex",
          reaction: "Severe Anaphylaxis upon contact. Use 100% Neoprene/Nitrile gloves & catheters only!"
        },
        {
          type: "SEVERE CONTRAINDICATION",
          severity: "HIGH",
          substance: "NSAIDs (Ibuprofen, Diclofenac, Aspirin)",
          reaction: "Severe Bronchospasm & Aspirin-Exacerbated Respiratory Disease (AERD)"
        }
      ],
      activeConditions: [
        {
          condition: "Brittle Asthma (Steroid-Dependent)",
          warning: "High risk of sudden acute bronchospasm during intubation. Pre-oxygenate with Albuterol/Ipratropium."
        },
        {
          condition: "Type 1 Diabetes Mellitus (T1DM)",
          warning: "Patient is on Continuous Subcutaneous Insulin Infusion (Omnipod Pump). Monitor blood glucose every 30 minutes in trauma."
        }
      ],
      currentMedications: [
        "Insulin Aspart (Novorapid) via Pump",
        "Budesonide/Formoterol (Symbicort) 200/6 Inhaler",
        "Montelukast 10mg OD"
      ],
      emergencyContacts: [
        {
          name: "Arjun Nair",
          relation: "Husband",
          phone: "+91 98450 11223",
          location: "Indiranagar, Bengaluru",
          isPrimary: true
        },
        {
          name: "Radha Nair",
          relation: "Mother",
          phone: "+91 94470 55667",
          location: "Panampilly Nagar, Kochi",
          isPrimary: false
        }
      ],
      organDonor: true,
      advanceDirective: "Full Resuscitation & Emergency Airway Management Authorized"
    },

    tier2: {
      unlocked: false,
      unlockedAt: null,
      unlockMethod: null,
      consentToken: null,
      digitalSignature: null,

      insuranceClearance: {
        pmRahatScheme: {
          schemeName: "Pradhan Mantri RAHAT Scheme (Cashless Road Accident Victim Treatment)",
          coverageCap: "₹1,50,000",
          policyRef: "MoRTH/GSR/2024/722-DL",
          status: "GOVERNMENT GUARANTEED",
          preAuthToken: "PM-RAHAT-DL-2026-44319",
          autoAdmitGuarantee: "Instant government-backed cashless admission guarantee under Good Samaritan laws."
        },
        privateInsurance: {
          insurer: "HDFC ERGO General Insurance Co.",
          policyNumber: "POL-HE-992381",
          tpa: "HDFC ERGO In-House Health Claims Team",
          cashlessPreAuthLimit: "₹10,00,000",
          hospitalNetworkStatus: "Tier 1 Platinum Network (Auto-Pre-Authorized)"
        }
      },

      clinicalRecords: [
        {
          title: "Pulmonology Comprehensive Asthma Evaluation",
          date: "05 Dec 2025",
          hospital: "Max Super Speciality Hospital, Saket, New Delhi",
          doctor: "Dr. Vivek Nangia (Head of Pulmonology & Critical Care)",
          findings: "FEV1: 68% predicted. Significant reversibility with bronchodilator. Recommends strict latex avoidance in all surgical environments.",
          pdfName: "Max_Asthma_Evaluation_2025.pdf"
        },
        {
          title: "Endocrinology Continuous Glucose Monitoring (CGM) 14-Day Log",
          date: "20 Jan 2026",
          hospital: "Fortis C-DOC Centre of Excellence for Diabetes",
          findings: "Time in Range (70-180 mg/dL): 76%. HbA1c: 6.8%. Basal rate: 0.85 U/hr.",
          pdfName: "Fortis_CGM_Report_Jan2026.pdf"
        }
      ],

      pastSurgeries: [
        { procedure: "Knee Arthroscopy (Left)", date: "March 2021" }
      ]
    }
  }
];
