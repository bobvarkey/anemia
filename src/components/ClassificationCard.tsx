import type { AnemiaClassification, Sex } from '../types';
import { Activity, Beaker, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  classification: AnemiaClassification;
  hgb: number;
  mcv: number;
  sex: Sex;
}

const severityConfig = {
  None:     { bg: 'bg-emerald-900/30', border: 'border-emerald-800', text: 'text-emerald-400', badge: 'bg-emerald-900/30 text-emerald-400', icon: CheckCircle },
  Mild:     { bg: 'bg-amber-900/30',   border: 'border-amber-800',   text: 'text-amber-400',   badge: 'bg-amber-900/30 text-amber-400',   icon: AlertCircle },
  Moderate: { bg: 'bg-orange-900/30',  border: 'border-orange-800',  text: 'text-orange-400',  badge: 'bg-orange-900/30 text-orange-400', icon: AlertCircle },
  Severe:   { bg: 'bg-red-900/30',     border: 'border-red-800',     text: 'text-red-400',     badge: 'bg-red-900/30 text-red-400',       icon: AlertCircle },
  'N/A':    { bg: 'bg-gray-900/30',    border: 'border-gray-800',    text: 'text-gray-400',    badge: 'bg-gray-900/30 text-gray-400',     icon: AlertCircle },
};

const morphologyConfig = {
  Microcytic:  { color: 'text-sky-400',   bg: 'bg-sky-900/30',    desc: 'MCV < 80 fL — Consider iron deficiency, thalassemia, chronic disease' },
  Normocytic:  { color: 'text-blue-400',  bg: 'bg-blue-900/30',   desc: 'MCV 80–100 fL — Consider hemolysis, acute blood loss, chronic disease' },
  Macrocytic:  { color: 'text-violet-400', bg: 'bg-violet-900/30', desc: 'MCV > 100 fL — Consider B12/folate deficiency, liver disease, medications' },
  'N/A':       { color: 'text-gray-400',  bg: 'bg-gray-900/30',   desc: 'MCV not provided' },
};

const sexLabels: Record<Sex, string> = {
  male: 'Adult Male',
  female: 'Adult Female',
  child: 'Child',
  pregnant: 'Pregnant Female',
};

export default function ClassificationCard({ classification, hgb, mcv, sex }: Props) {
  const sc = severityConfig[classification.severity] || severityConfig['N/A'];
  const mc = morphologyConfig[classification.morphology] || morphologyConfig['N/A'];
  const Icon = sc.icon;

  return (
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-sky-400" />
        <h2 className="text-lg font-semibold text-white">Anemia Classification</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Severity */}
        <div className={`rounded-xl p-4 border ${sc.bg} ${sc.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${sc.text}`} />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Severity</span>
          </div>
          <div className={`text-2xl font-bold ${sc.text}`}>{classification.severity}</div>
          {classification.severity !== 'N/A' && (
            <div className="mt-1 text-xs text-gray-400">
              {classification.severity === 'None'
                ? 'Hemoglobin within normal range'
                : `Hgb ${hgb.toFixed(1)} g/dL — ${sexLabels[sex]}`}
            </div>
          )}
          {classification.severity !== 'None' && classification.severity !== 'N/A' && (
            <div className="mt-2 text-xs text-gray-400 space-y-0.5">
              <div>Mild: Hgb ≥ {classification.hgbThreshold.mild} g/dL</div>
              <div>Moderate: Hgb ≥ {classification.hgbThreshold.moderate} g/dL</div>
              <div>Severe: Hgb &lt; {classification.hgbThreshold.moderate} g/dL</div>
            </div>
          )}
        </div>

        {/* Morphology */}
        <div className="rounded-xl p-4 border border-gray-800 bg-gray-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Beaker className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Morphology</span>
          </div>
          <div className={`text-2xl font-bold ${mc.color}`}>{classification.morphology}</div>
          {!isNaN(mcv) && (
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mc.bg} ${mc.color}`}>
                MCV: {mcv.toFixed(1)} fL
              </span>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-400 leading-relaxed">{mc.desc}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-800">
        WHO 2024 criteria — Classification based on hemoglobin thresholds for {sexLabels[sex].toLowerCase()}
      </div>
    </div>
  );
}
