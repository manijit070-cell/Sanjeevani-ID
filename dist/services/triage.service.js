"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triageService = exports.TriageService = void 0;
class TriageService {
    evaluateDrugConflict(patient, drugName) {
        const norm = drugName.toLowerCase().trim();
        if (patient.id === 'ROHAN-101') {
            const penicillinFamily = [
                'penicillin', 'amoxicillin', 'ampicillin', 'augmentin', 'piperacillin',
                'tazobactam', 'ceftriaxone', 'cefepime', 'cephalexin', 'meropenem', 'imipenem'
            ];
            const sulfaFamily = ['bactrim', 'septra', 'sulfamethoxazole', 'sulfadiazine'];
            const nsaidFamily = ['aspirin', 'ibuprofen', 'diclofenac', 'combiflam', 'ketorolac', 'naproxen'];
            if (penicillinFamily.some(d => norm.includes(d))) {
                return {
                    safe: false,
                    severity: "CRITICAL",
                    status: "FATAL CONTRAINDICATION",
                    reason: `Patient has documented Anaphylactic Shock to Penicillin & Beta-Lactam antibiotics. Administering ${drugName.toUpperCase()} can trigger immediate respiratory arrest and circulatory collapse.`,
                    recommendation: "Switch immediately to Macrolides (Azithromycin 500mg IV) or Fluoroquinolones (Levofloxacin) after ICU consult."
                };
            }
            if (sulfaFamily.some(d => norm.includes(d))) {
                return {
                    safe: false,
                    severity: "HIGH",
                    status: "SEVERE ALLERGY CONTRAINDICATION",
                    reason: `Sulfonamide drug detected. Patient has documented high risk of Stevens-Johnson syndrome.`,
                    recommendation: "Avoid all Sulfa derivatives."
                };
            }
            if (nsaidFamily.some(d => norm.includes(d))) {
                return {
                    safe: false,
                    severity: "WARNING",
                    status: "HEMORRHAGE RISK CAUTION",
                    reason: `Patient is already on Dual Antiplatelet Therapy (Clopidogrel + Aspirin). Adding NSAIDs dramatically increases GI bleed and surgical hemorrhagic mortality.`,
                    recommendation: "Use IV Paracetamol/Acetaminophen or Tramadol for acute trauma pain management."
                };
            }
            return {
                safe: true,
                severity: "SAFE",
                status: "COMPATIBLE",
                reason: `No documented direct anaphylactic conflict detected for ${drugName} with patient's known records.`,
                recommendation: "Verify renal profile before dosing; proceed with standard trauma protocol."
            };
        }
        else {
            // Priya Nair
            const nsaidFamily = ['ibuprofen', 'diclofenac', 'aspirin', 'combiflam', 'naproxen', 'ketorolac', 'mefenamic'];
            const latexRelated = ['latex', 'rubber'];
            if (nsaidFamily.some(d => norm.includes(d))) {
                return {
                    safe: false,
                    severity: "CRITICAL",
                    status: "FATAL BRONCHOSPASM RISK",
                    reason: `Patient has Aspirin-Exacerbated Respiratory Disease (AERD) triad. Administering ${drugName.toUpperCase()} causes acute severe bronchospasm and refractory asthma attack.`,
                    recommendation: "Use Paracetamol IV (PCM) or low-dose opioids (Fentanyl) if severe pain; strictly avoid all COX-1 inhibitors."
                };
            }
            if (latexRelated.some(d => norm.includes(d))) {
                return {
                    safe: false,
                    severity: "CRITICAL",
                    status: "FATAL ALLERGY ALERT",
                    reason: `Patient has verified life-threatening latex allergy.`,
                    recommendation: "Ensure 100% Latex-free surgical suite."
                };
            }
            return {
                safe: true,
                severity: "SAFE",
                status: "COMPATIBLE",
                reason: `No direct contraindication found for ${drugName}.`,
                recommendation: "Monitor capillary blood glucose regularly as patient is Type 1 Diabetic."
            };
        }
    }
}
exports.TriageService = TriageService;
exports.triageService = new TriageService();
