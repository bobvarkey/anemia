import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const ranges = [
  {
    category: 'Adult Male',
    values: [
      { param: 'Hemoglobin',  range: '13.5–17.5 g/dL' },
      { param: 'RBC',         range: '4.5–5.9 ×10¹²/L' },
      { param: 'MCV',         range: '80–100 fL' },
      { param: 'MCH',         range: '27–33 pg' },
      { param: 'MCHC',        range: '32–36 g/dL' },
      { param: 'RDW',         range: '11.5–14.5%' },
      { param: 'Hematocrit',  range: '41–53%' },
    ],
  },
  {
    category: 'Adult Female (non-pregnant)',
    values: [
      { param: 'Hemoglobin',  range: '12.0–16.0 g/dL' },
      { param: 'RBC',         range: '4.0–5.2 ×10¹²/L' },
      { param: 'MCV',         range: '80–100 fL' },
      { param: 'MCH',         range: '27–33 pg' },
      { param: 'MCHC',        range: '32–36 g/dL' },
      { param: 'RDW',         range: '11.5–14.5%' },
      { param: 'Hematocrit',  range: '36–46%' },
    ],
  },
  {
    category: 'Pregnant Female (1st trimester)',
    values: [
      { param: 'Hemoglobin',  range: '≥ 11.0 g/dL (WHO)' },
      { param: 'MCV',         range: '80–100 fL' },
      { param: 'Hematocrit',  range: '33–44%' },
    ],
  },
  {
    category: 'Child (6 months–14 years)',
    values: [
      { param: 'Hemoglobin',  range: '11.0–14.0 g/dL' },
      { param: 'MCV',         range: '70–86 fL (age-dependent)' },
      { param: 'MCH',         range: '24–30 pg' },
    ],
  },
];

const whoClassification = [
  { group: 'Adult Male',          none: '≥ 13.0', mild: '11.0–12.9', moderate: '8.0–10.9', severe: '< 8.0' },
  { group: 'Adult Female',        none: '≥ 12.0', mild: '11.0–11.9', moderate: '8.0–10.9', severe: '< 8.0' },
  { group: 'Pregnant Female',     none: '≥ 11.0', mild: '10.0–10.9', moderate: '7.0–9.9',  severe: '< 7.0' },
  { group: 'Child (6m–14y)',      none: '≥ 11.0', mild: '10.0–10.9', moderate: '7.0–9.9',  severe: '< 7.0' },
];

export default function ReferenceRanges() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-semibold text-gray-800">Reference Ranges & WHO Classification</h2>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-6">
          {/* WHO severity table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">WHO Anemia Severity (Hgb g/dL)</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-600">Group</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-emerald-700">Normal</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-amber-700">Mild</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-orange-700">Moderate</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-red-700">Severe</th>
                  </tr>
                </thead>
                <tbody>
                  {whoClassification.map((row, i) => (
                    <tr key={row.group} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="py-2.5 px-3 font-medium text-gray-700">{row.group}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700 font-mono">{row.none}</td>
                      <td className="py-2.5 px-3 text-center text-amber-700 font-mono">{row.mild}</td>
                      <td className="py-2.5 px-3 text-center text-orange-700 font-mono">{row.moderate}</td>
                      <td className="py-2.5 px-3 text-center text-red-700 font-mono">{row.severe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MCV morphology */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Morphological Classification by MCV</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Microcytic', range: '< 80 fL', color: 'bg-sky-50 border-sky-200 text-sky-700' },
                { label: 'Normocytic', range: '80–100 fL', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Macrocytic', range: '> 100 fL', color: 'bg-violet-50 border-violet-200 text-violet-700' },
              ].map(m => (
                <div key={m.label} className={`rounded-xl p-3 border text-center ${m.color}`}>
                  <div className="font-semibold text-sm">{m.label}</div>
                  <div className="text-xs mt-0.5 opacity-80 font-mono">{m.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Normal reference ranges */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Normal CBC Reference Ranges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ranges.map(cat => (
                <div key={cat.category} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 border-b border-gray-100">
                    {cat.category}
                  </div>
                  <div className="divide-y divide-gray-50">
                    {cat.values.map(v => (
                      <div key={v.param} className="flex justify-between px-3 py-1.5 text-xs">
                        <span className="text-gray-600">{v.param}</span>
                        <span className="font-mono text-gray-800">{v.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Sources: WHO 2024 Haemoglobin Concentrations for the Diagnosis of Anaemia; ICSH reference ranges; Wintrobe's Clinical Hematology.
          </p>
        </div>
      )}
    </div>
  );
}
