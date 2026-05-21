import { useState } from 'react';
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
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Reference Ranges & WHO Classification</h2>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-6">
          {/* WHO severity table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">WHO Anemia Severity (Hgb g/dL)</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-800">
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-400">Group</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-emerald-400">Normal</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-amber-400">Mild</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-orange-400">Moderate</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-red-400">Severe</th>
                  </tr>
                </thead>
                <tbody>
                  {whoClassification.map((row, i) => (
                    <tr key={row.group} className={`border-b border-gray-800 ${i % 2 === 0 ? '' : 'bg-gray-800/30'}`}>
                      <td className="py-2.5 px-3 font-medium text-gray-300">{row.group}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-mono">{row.none}</td>
                      <td className="py-2.5 px-3 text-center text-amber-400 font-mono">{row.mild}</td>
                      <td className="py-2.5 px-3 text-center text-orange-400 font-mono">{row.moderate}</td>
                      <td className="py-2.5 px-3 text-center text-red-400 font-mono">{row.severe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MCV morphology */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Morphological Classification by MCV</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Microcytic', range: '< 80 fL', color: 'bg-sky-900/30 border-sky-800 text-sky-400' },
                { label: 'Normocytic', range: '80–100 fL', color: 'bg-blue-900/30 border-blue-800 text-blue-400' },
                { label: 'Macrocytic', range: '> 100 fL', color: 'bg-violet-900/30 border-violet-800 text-violet-400' },
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
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Normal CBC Reference Ranges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ranges.map(cat => (
                <div key={cat.category} className="rounded-xl border border-gray-800 overflow-hidden">
                  <div className="bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-300 border-b border-gray-800">
                    {cat.category}
                  </div>
                  <div className="divide-y divide-gray-800">
                    {cat.values.map(v => (
                      <div key={v.param} className="flex justify-between px-3 py-1.5 text-xs">
                        <span className="text-gray-400">{v.param}</span>
                        <span className="font-mono text-gray-200">{v.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ASH Chronic Anemia Diagnostic Algorithm */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
              ASH Chronic Anemia Diagnostic Algorithm (2012)
            </h3>
            <div className="bg-sky-900/20 rounded-xl p-4 text-sm space-y-4 border border-sky-800/50">
              <p className="text-gray-300">
                Based on Koury MJ & Rhodes M. <em>How to approach chronic anemia.</em> ASH Education Program 2012.
              </p>

              {/* Algorithm Steps */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-sky-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-white">Confirm Anemia & Check Reticulocytes</p>
                    <p className="text-xs text-gray-400 mt-1">Low Hgb/Hct → Are reticulocytes increased?</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-800">↑ Retics: Hemolysis/Blood Loss</span>
                      <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded border border-amber-800">↓/Normal Retics: Continue workup</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-sky-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-white">Check Other Cell Lines</p>
                    <p className="text-xs text-gray-400 mt-1">Abnormal WBC or platelets → Suspect bone marrow disorder</p>
                    <p className="text-xs text-gray-500 italic">May need bone marrow biopsy if multilineage abnormalities</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-sky-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-white">MCV-Based Classification</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <p className="text-xs font-semibold text-sky-400">Microcytic (&lt;80 fL)</p>
                        <p className="text-xs text-gray-400">Iron deficiency, thalassemia, ACD, sideroblastic</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <p className="text-xs font-semibold text-sky-400">Normocytic (80-100 fL)</p>
                        <p className="text-xs text-gray-400">ACD, renal disease, early nutritional, BM disorder</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <p className="text-xs font-semibold text-sky-400">Macrocytic (&gt;100 fL)</p>
                        <p className="text-xs text-gray-400">B12/folate deficiency, MDS, drugs, alcohol</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-sky-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-white">When to Consider Bone Marrow Biopsy</p>
                    <ul className="text-xs text-gray-400 mt-1 space-y-1 list-disc list-inside">
                      <li>Multilineage cytopenias without splenomegaly</li>
                      <li>Normocytic anemia with inappropriately low retics not explained by renal/inflammatory disease</li>
                      <li>Markedly macrocytic (MCV &gt;110 fL) not due to drugs/nutritional deficiency</li>
                      <li>Presence of nucleated RBCs + immature myeloid cells (marrow infiltration)</li>
                      <li>Suspicion for MDS, aplastic anemia, or hematologic malignancy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Sources: WHO 2024 Haemoglobin Concentrations for the Diagnosis of Anaemia; ICSH reference ranges; Wintrobe's Clinical Hematology; Koury MJ, Rhodes M. How to approach chronic anemia. ASH Education Program 2012.
          </p>
        </div>
      )}
    </div>
  );
}
