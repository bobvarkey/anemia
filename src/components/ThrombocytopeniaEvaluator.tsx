import { useState } from 'react';
import { Droplet, AlertTriangle, ChevronDown, ChevronUp, Activity, Stethoscope, TestTube, Pill, Info } from 'lucide-react';

const commonDITPDrugs = {
  antibiotics: [
    'Vancomycin', 'TMP-SMX (Bactrim)', 'Linezolid', 'Cefazolin', 'Piperacillin-tazobactam',
    'Rifampin', 'Ciprofloxacin', 'Levofloxacin'
  ],
  cardiovascular: [
    'Heparin (unfractionated & LMWH)', 'Amiodarone', 'Digoxin', 'Abciximab', 'Eptifibatide'
  ],
  anticonvulsants: [
    'Valproic acid', 'Carbamazepine', 'Phenytoin', 'Levetiracetam', 'Lamotrigine'
  ],
  analgesics: [
    'Ibuprofen', 'Naproxen', 'Diclofenac', 'Acetaminophen (rare)'
  ],
  psychotropic: [
    'Haloperidol', 'Olanzapine', 'Risperidone', 'Sertraline', 'Fluoxetine'
  ],
  other: [
    'Furosemide', 'Omeprazole/PPIs', 'Methyldopa', 'Interferon', 'Rituximab',
    'Chemotherapy agents', 'Quinine/Quinidine', 'Gold salts'
  ]
};

interface PlateletValues {
  plateletCount: string;
  mpv: string;
  pdw: string;
}

interface PatientFactors {
  age: string;
  recentHeparin: boolean;
  bleedingSymptoms: boolean;
  neurologicSymptoms: boolean;
  renalDysfunction: boolean;
  fever: boolean;
  newMedications: boolean;
  priorPlateletCount: string;
}

const EMPTY_VALUES: PlateletValues = { plateletCount: '', mpv: '', pdw: '' };
const EMPTY_FACTORS: PatientFactors = {
  age: '',
  recentHeparin: false,
  bleedingSymptoms: false,
  neurologicSymptoms: false,
  renalDysfunction: false,
  fever: false,
  newMedications: false,
  priorPlateletCount: '',
};

export default function ThrombocytopeniaEvaluator() {
  const [values, setValues] = useState<PlateletValues>(EMPTY_VALUES);
  const [factors, setFactors] = useState<PatientFactors>(EMPTY_FACTORS);
  const [result, setResult] = useState<string | null>(null);
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const [showDrugList, setShowDrugList] = useState(false);

  const plateletNum = parseFloat(values.plateletCount);

  function getSeverity(count: number): { level: string; color: string; risk: string } {
    if (count >= 150) return { level: 'Normal', color: 'text-emerald-400', risk: 'No bleeding risk' };
    if (count >= 100) return { level: 'Mild', color: 'text-amber-400', risk: 'Minimal bleeding risk' };
    if (count >= 50) return { level: 'Moderate', color: 'text-orange-400', risk: 'Increased bleeding with trauma/surgery' };
    if (count >= 20) return { level: 'Severe', color: 'text-red-400', risk: 'Spontaneous bleeding risk' };
    return { level: 'Life-threatening', color: 'text-red-500', risk: 'High risk of spontaneous hemorrhage' };
  }

  function generateAssessment() {
    const parts: string[] = [];

    // Severity assessment
    if (!isNaN(plateletNum)) {
      const severity = getSeverity(plateletNum);
      parts.push(`Severity: ${severity.level} (${plateletNum} ×10⁹/L) - ${severity.risk}`);
    }

    // Urgent red flags
    const redFlags: string[] = [];
    if (plateletNum < 20) redFlags.push('Platelets <20,000/μL');
    if (factors.neurologicSymptoms) redFlags.push('Neurologic symptoms (TTP concern)');
    if (factors.recentHeparin && plateletNum < 150) redFlags.push('Heparin exposure (HIT concern)');
    if (factors.renalDysfunction && plateletNum < 150) redFlags.push('Renal dysfunction + thrombocytopenia (TTP/HUS)');

    if (redFlags.length > 0) {
      parts.push(`URGENT: ${redFlags.join(', ')} - Consider hematology consult`);
    }

    // Differential based on history
    const differentials: string[] = [];

    if (factors.recentHeparin && plateletNum < 150) {
      differentials.push('Heparin-Induced Thrombocytopenia (HIT) - Calculate 4Ts score');
    }

    if (factors.neurologicSymptoms || factors.renalDysfunction || factors.fever) {
      differentials.push('TTP/HUS/DIC - Check peripheral smear for schistocytes, LDH, haptoglobin');
    }

    if (factors.newMedications) {
      differentials.push('Drug-Induced Thrombocytopenia (DITP) - Review all meds/supplements');
    }

    if (plateletNum > 20 && plateletNum < 100 && !factors.recentHeparin && !factors.newMedications) {
      differentials.push('Immune Thrombocytopenia (ITP) - Diagnosis of exclusion');
    }

    if (factors.age && parseInt(factors.age) > 60 && plateletNum < 100) {
      differentials.push('Consider MDS or other primary bone marrow disorder in elderly');
    }

    if (differentials.length > 0) {
      parts.push(`Consider: ${differentials.join('; ')}`);
    }

    // Recommendations
    const recs: string[] = [];
    if (plateletNum < 150) {
      recs.push('Confirm with peripheral smear (exclude pseudothrombocytopenia/clumping)');
    }
    if (plateletNum < 100) {
      recs.push('Hemolysis panel: LDH, haptoglobin, reticulocyte count, direct antiglobulin test');
      recs.push('Liver function tests (portal hypertension/sequestration)');
      recs.push('Hepatitis C, HIV screening');
    }
    if (redFlags.length > 0) {
      recs.push('URGENT: Hematology consult, possible admission for severe thrombocytopenia');
    }

    if (recs.length > 0) {
      parts.push(`Recommendations: ${recs.join('; ')}`);
    }

    setResult(parts.join('\n\n'));
  }

  function handleReset() {
    setValues(EMPTY_VALUES);
    setFactors(EMPTY_FACTORS);
    setResult(null);
  }

  return (
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-900/30 flex items-center justify-center border border-rose-800">
            <Droplet className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Thrombocytopenia Evaluator</h2>
            <p className="text-xs text-gray-400">ASH-guided diagnostic algorithm (2024)</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-800/50 rounded-xl px-4 py-3 text-sm text-amber-300 mt-4">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <p>
            This tool is for <strong>educational and decision-support purposes only</strong>. Severe thrombocytopenia (&lt;20,000/μL) and suspected TTP/HIT require urgent evaluation.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Platelet Count Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platelet Count (×10⁹/L) *
            </label>
            <input
              type="number"
              value={values.plateletCount}
              onChange={(e) => setValues({ ...values, plateletCount: e.target.value })}
              placeholder="e.g., 45"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              MPV (fL) - Optional
            </label>
            <input
              type="number"
              value={values.mpv}
              onChange={(e) => setValues({ ...values, mpv: e.target.value })}
              placeholder="7-11"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Patient Age
            </label>
            <input
              type="number"
              value={factors.age}
              onChange={(e) => setFactors({ ...factors, age: e.target.value })}
              placeholder="years"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
          </div>
        </div>

        {/* Clinical Factors */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-800">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-gray-400" />
            Clinical Factors (Check all that apply)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'recentHeparin', label: 'Heparin exposure in last 30 days' },
              { key: 'bleedingSymptoms', label: 'Bleeding symptoms (petechiae, ecchymosis)' },
              { key: 'neurologicSymptoms', label: 'Neurologic symptoms' },
              { key: 'renalDysfunction', label: 'Renal dysfunction' },
              { key: 'fever', label: 'Fever' },
              { key: 'newMedications', label: 'New medications in last 2 weeks' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={factors[item.key as keyof PatientFactors] as boolean}
                  onChange={(e) => setFactors({ ...factors, [item.key]: e.target.checked })}
                  className="w-4 h-4 text-rose-500 rounded border-gray-600 bg-gray-700 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-300">{item.label}</span>
              </label>
            ))}
          </div>

          {/* Collapsible Drug List */}
          <div className="mt-4 border-t border-gray-700 pt-4">
            <button
              onClick={() => setShowDrugList(!showDrugList)}
              className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Pill className="w-4 h-4" />
              <span>Common drugs causing thrombocytopenia (DITP)</span>
              {showDrugList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDrugList && (
              <div className="mt-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-2 mb-3">
                  <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-400">
                    Drug-induced thrombocytopenia (DITP) typically occurs 5-10 days after exposure. This is not an exhaustive list — always review ALL medications, OTC drugs, and supplements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-rose-400 mb-2">Antibiotics</h4>
                    <ul className="space-y-1">
                      {commonDITPDrugs.antibiotics.map(drug => (
                        <li key={drug} className="text-xs text-gray-400">{drug}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-rose-400 mb-2">Cardiovascular</h4>
                    <ul className="space-y-1">
                      {commonDITPDrugs.cardiovascular.map(drug => (
                        <li key={drug} className="text-xs text-gray-400">{drug}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-rose-400 mb-2">Anticonvulsants</h4>
                    <ul className="space-y-1">
                      {commonDITPDrugs.anticonvulsants.map(drug => (
                        <li key={drug} className="text-xs text-gray-400">{drug}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-rose-400 mb-2">NSAIDs/Analgesics</h4>
                    <ul className="space-y-1">
                      {commonDITPDrugs.analgesics.map(drug => (
                        <li key={drug} className="text-xs text-gray-400">{drug}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-rose-400 mb-2">Psychotropic</h4>
                    <ul className="space-y-1">
                      {commonDITPDrugs.psychotropic.map(drug => (
                        <li key={drug} className="text-xs text-gray-400">{drug}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-rose-400 mb-2">Other</h4>
                    <ul className="space-y-1">
                      {commonDITPDrugs.other.map(drug => (
                        <li key={drug} className="text-xs text-gray-400">{drug}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prior Platelet Count */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prior Platelet Count (if known)
          </label>
          <input
            type="number"
            value={factors.priorPlateletCount}
            onChange={(e) => setFactors({ ...factors, priorPlateletCount: e.target.value })}
            placeholder="e.g., 250"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={generateAssessment}
            disabled={!values.plateletCount}
            className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 disabled:bg-gray-800 disabled:text-gray-500 transition-colors"
          >
            Evaluate Thrombocytopenia
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-rose-900/20 border border-rose-800/50 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-rose-300 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Assessment Results
            </h3>
            <div className="text-sm text-rose-200 whitespace-pre-line space-y-2">
              {result.split('\n\n').map((line, i) => (
                <p key={i} className={line.startsWith('URGENT') ? 'font-semibold bg-red-900/30 p-2 rounded border border-red-800' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Section */}
        <button
          onClick={() => setShowAlgorithm(!showAlgorithm)}
          className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-800 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-white">ASH Thrombocytopenia Diagnostic Algorithm</span>
          </div>
          {showAlgorithm ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {showAlgorithm && (
          <div className="bg-slate-900 rounded-xl p-5 space-y-4 text-sm border border-gray-800">
            <p className="text-gray-400">
              Based on Al-Samkari H, Kuter DJ. <em>How I diagnose and treat thrombocytopenia in geriatric patients.</em> Blood 2024.
            </p>

            {/* Algorithm Steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <p className="font-medium text-white">Confirm True Thrombocytopenia</p>
                  <p className="text-xs text-gray-400 mt-1">Review peripheral smear to exclude pseudothrombocytopenia (platelet clumping). If suspected, repeat using heparin or citrate tube.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <p className="font-medium text-white">Assess Other Cell Lines</p>
                  <p className="text-xs text-gray-400 mt-1">Look for leukocyte abnormalities (blasts, dysplasia) or anemia suggesting underlying malignancy or bone marrow disorder.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                <div>
                  <p className="font-medium text-white">Evaluate for Hemolysis</p>
                  <p className="text-xs text-gray-400 mt-1">LDH, haptoglobin, reticulocyte count, direct antiglobulin test (DAT). Schistocytes on smear suggest TTP/HUS/DIC.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                <div>
                  <p className="font-medium text-white">Mechanism-Based Classification</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                      <p className="text-xs font-semibold text-rose-400">↓ Production</p>
                      <p className="text-xs text-gray-400">MDS, malignancy, B12/folate deficiency</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                      <p className="text-xs font-semibold text-rose-400">↑ Destruction</p>
                      <p className="text-xs text-gray-400">ITP, drug-induced, autoimmune</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                      <p className="text-xs font-semibold text-rose-400">Consumption</p>
                      <p className="text-xs text-gray-400">DIC, TTP, HUS, TMA</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                      <p className="text-xs font-semibold text-rose-400">Sequestration</p>
                      <p className="text-xs text-gray-400">Hypersplenism/portal hypertension</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">5</span>
                <div>
                  <p className="font-medium text-white">Red Flags Requiring Urgent Action</p>
                  <ul className="text-xs text-gray-400 mt-1 space-y-1 list-disc list-inside">
                    <li>Platelets &lt;10,000/μL (spontaneous bleeding risk)</li>
                    <li>Neurologic symptoms or renal dysfunction (TTP)</li>
                    <li>Recent heparin exposure (HIT)</li>
                    <li>Hemolysis on smear with thrombocytopenia</li>
                    <li>Fever + thrombocytopenia</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* HIT 4Ts Score Reference */}
            <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800/50 mt-4">
              <p className="font-semibold text-amber-300 text-xs">HIT 4Ts Score (Pretest Probability)</p>
              <p className="text-xs text-amber-400 mt-1">
                <strong>Thrombocytopenia:</strong> &gt;50% fall = 2 pts, 10-50% = 1 pt, &lt;10% = 0 pts<br/>
                <strong>Timing:</strong> 5-10 days = 2 pts, &gt;10 days or &lt;4 days = 1 pt<br/>
                <strong>Thrombosis:</strong> Confirmed thrombosis = 2 pts, progressive/recurrent = 1 pt<br/>
                <strong>Other causes:</strong> None = 2 pts, Possible = 1 pt, Definite = 0 pts<br/>
                <strong>Score:</strong> 0-3 = Low (risk &lt;1%), 4-5 = Intermediate (risk ~10%), 6-8 = High (risk &gt;50%)
              </p>
            </div>

            <p className="text-xs text-gray-500 pt-2">
              Sources: Al-Samkari H, Kuter DJ. Blood 2024; ASH 2019 ITP Guidelines; ASH HIT Guidelines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
