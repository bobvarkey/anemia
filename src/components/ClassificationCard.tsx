import React from 'react';
import type { AnemiaClassification, Sex } from '../types';
import { Activity, Beaker, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  classification: AnemiaClassification;
  hgb: number;
  mcv: number;
  sex: Sex;
}

const severityConfig = {
  None:     { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  Mild:     { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',   icon: AlertCircle },
  Moderate: { bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-700',  badge: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  Severe:   { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     badge: 'bg-red-100 text-red-700',       icon: AlertCircle },
  'N/A':    { bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-500',    badge: 'bg-gray-100 text-gray-500',     icon: AlertCircle },
};

const morphologyConfig = {
  Microcytic:  { color: 'text-sky-700',   bg: 'bg-sky-100',    desc: 'MCV < 80 fL — Consider iron deficiency, thalassemia, chronic disease' },
  Normocytic:  { color: 'text-blue-700',  bg: 'bg-blue-100',   desc: 'MCV 80–100 fL — Consider hemolysis, acute blood loss, chronic disease' },
  Macrocytic:  { color: 'text-violet-700', bg: 'bg-violet-100', desc: 'MCV > 100 fL — Consider B12/folate deficiency, liver disease, medications' },
  'N/A':       { color: 'text-gray-500',  bg: 'bg-gray-100',   desc: 'MCV not provided' },
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-sky-600" />
        <h2 className="text-lg font-semibold text-gray-800">Anemia Classification</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Severity */}
        <div className={`rounded-xl p-4 border ${sc.bg} ${sc.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${sc.text}`} />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Severity</span>
          </div>
          <div className={`text-2xl font-bold ${sc.text}`}>{classification.severity}</div>
          {classification.severity !== 'N/A' && (
            <div className="mt-1 text-xs text-gray-500">
              {classification.severity === 'None'
                ? 'Hemoglobin within normal range'
                : `Hgb ${hgb.toFixed(1)} g/dL — ${sexLabels[sex]}`}
            </div>
          )}
          {classification.severity !== 'None' && classification.severity !== 'N/A' && (
            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
              <div>Mild: Hgb ≥ {classification.hgbThreshold.mild} g/dL</div>
              <div>Moderate: Hgb ≥ {classification.hgbThreshold.moderate} g/dL</div>
              <div>Severe: Hgb &lt; {classification.hgbThreshold.moderate} g/dL</div>
            </div>
          )}
        </div>

        {/* Morphology */}
        <div className="rounded-xl p-4 border border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Beaker className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Morphology</span>
          </div>
          <div className={`text-2xl font-bold ${mc.color}`}>{classification.morphology}</div>
          {!isNaN(mcv) && (
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mc.bg} ${mc.color}`}>
                MCV: {mcv.toFixed(1)} fL
              </span>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 leading-relaxed">{mc.desc}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
        WHO 2024 criteria — Classification based on hemoglobin thresholds for {sexLabels[sex].toLowerCase()}
      </div>
    </div>
  );
}
