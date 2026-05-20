import { useState } from 'react';
import type { CBCValues, Sex, EvaluationResult } from './types';
import { evaluate } from './utils/anemia';
import CBCForm from './components/CBCForm';
import ClassificationCard from './components/ClassificationCard';
import DiscriminantTable from './components/DiscriminantTable';
import CausesPanel from './components/CausesPanel';
import ReferenceRanges from './components/ReferenceRanges';
import ThrombocytopeniaEvaluator from './components/ThrombocytopeniaEvaluator';
import TestSuggestionAlgorithm from './components/TestSuggestionAlgorithm';
import { Microscope, AlertTriangle, Droplet } from 'lucide-react';

const EMPTY_CBC: CBCValues = { hgb: '', rbc: '', mcv: '', mch: '', mchc: '', rdw: '', hct: '' };

type Tab = 'anemia' | 'thrombocytopenia';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('anemia');
  const [cbc, setCbc] = useState<CBCValues>(EMPTY_CBC);
  const [sex, setSex] = useState<Sex>('male');
  const [result, setResult] = useState<EvaluationResult | null>(null);

  function handleChange(field: keyof CBCValues, value: string) {
    setCbc(prev => ({ ...prev, [field]: value }));
    setResult(null);
  }

  function handleEvaluate() {
    setResult(evaluate(cbc, sex));
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function handleReset() {
    setCbc(EMPTY_CBC);
    setResult(null);
  }

  const hgbNum = parseFloat(cbc.hgb);
  const mcvNum = parseFloat(cbc.mcv);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-sm">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Hematology Evaluators</h1>
              <p className="text-xs text-gray-400 leading-tight">CBC-based diagnostic decision-support tools</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs bg-amber-900/30 text-amber-400 border border-amber-800 px-2.5 py-1 rounded-full font-medium">
                Educational Use Only
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('anemia')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'anemia'
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Microscope className="w-4 h-4" />
              Anemia Evaluator
            </button>
            <button
              onClick={() => setActiveTab('thrombocytopenia')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'thrombocytopenia'
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <Droplet className="w-4 h-4" />
              Thrombocytopenia Evaluator
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-800/50 rounded-xl px-4 py-3 text-sm text-amber-300">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <p>
            This tool is for <strong>educational and decision-support purposes only</strong>. It does not replace clinical judgment, laboratory expertise, or physician evaluation. Always correlate with the patient's clinical presentation and confirm with appropriate laboratory tests.
          </p>
        </div>

        {activeTab === 'anemia' ? (
          <>
            {/* Input form */}
            <CBCForm
              values={cbc}
              sex={sex}
              onChange={handleChange}
              onSexChange={setSex}
              onEvaluate={handleEvaluate}
              onReset={handleReset}
            />

            {/* Results */}
            {result && (
              <div id="results" className="space-y-5 pt-1">
                {result.missingFields.length > 0 && result.missingFields.includes('Hemoglobin') && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Missing required fields: {result.missingFields.join(', ')}
                  </div>
                )}

                {result.classification.severity !== 'N/A' && (
                  <ClassificationCard
                    classification={result.classification}
                    hgb={hgbNum}
                    mcv={mcvNum}
                    sex={sex}
                  />
                )}

                {result.classification.severity !== 'None' && result.classification.severity !== 'N/A' && (
                  <CausesPanel
                    morphology={result.classification.morphology}
                    severity={result.classification.severity}
                  />
                )}

                <DiscriminantTable
                  results={result.discriminantResults}
                  idaCount={result.idaCount}
                  thalCount={result.thalCount}
                  consensus={result.consensus}
                />
              </div>
            )}

            {/* Reference ranges */}
            <ReferenceRanges />

            {/* Next Test Algorithm */}
            <TestSuggestionAlgorithm />

            {/* About section */}
            <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6">
              <h2 className="text-base font-semibold text-white mb-3">About This Tool</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h3 className="font-medium text-gray-200 mb-2">Discriminant Indices Used</h3>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Mentzer Index (1973)</li>
                    <li>• England-Fraser Index (1973)</li>
                    <li>• Srivastava Index (1973)</li>
                    <li>• Shine-Lal Index (1977)</li>
                    <li>• Green-King Index (1989)</li>
                    <li>• Ricerca Index (1987)</li>
                    <li>• Das Gupta Index (1994)</li>
                    <li>• RDWI / Jayabose Index (1999)</li>
                    <li>• Bordbar Index (2010)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-200 mb-2">Key References</h3>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• WHO Haemoglobin Concentrations 2024</li>
                    <li>• Bessman JD, Gilmer PR, Gardner FH. Improved classification of anemias. Am J Clin Pathol. 1983</li>
                    <li>• Urrechaga E et al. Indices comparison 2011</li>
                    <li>• Ntaios G et al. Eur J Haematol 2007</li>
                    <li>• Demir A et al. Pediatr Hematol Oncol 2002</li>
                    <li>• Wintrobe's Clinical Hematology, 14th Ed.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <ThrombocytopeniaEvaluator />
        )}
      </main>

      <footer className="text-center text-xs text-gray-500 py-6 border-t border-gray-800 mt-4">
        Hematology Evaluators — Educational clinical decision-support tools — Not for diagnostic use
      </footer>
    </div>
  );
}
