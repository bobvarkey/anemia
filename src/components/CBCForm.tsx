import React from 'react';
import type { CBCValues, Sex } from '../types';

interface Props {
  values: CBCValues;
  sex: Sex;
  onChange: (field: keyof CBCValues, value: string) => void;
  onSexChange: (sex: Sex) => void;
  onEvaluate: () => void;
  onReset: () => void;
}

const fields: { key: keyof CBCValues; label: string; unit: string; placeholder: string; min: number; max: number }[] = [
  { key: 'hgb',  label: 'Hemoglobin',  unit: 'g/dL',       placeholder: 'e.g. 9.5',   min: 1,   max: 20  },
  { key: 'rbc',  label: 'RBC Count',   unit: '×10¹²/L',    placeholder: 'e.g. 3.8',   min: 0.5, max: 8   },
  { key: 'mcv',  label: 'MCV',         unit: 'fL',          placeholder: 'e.g. 68',    min: 40,  max: 140 },
  { key: 'mch',  label: 'MCH',         unit: 'pg',          placeholder: 'e.g. 22',    min: 10,  max: 50  },
  { key: 'mchc', label: 'MCHC',        unit: 'g/dL',        placeholder: 'e.g. 31',    min: 20,  max: 40  },
  { key: 'rdw',  label: 'RDW',         unit: '%',           placeholder: 'e.g. 16.5',  min: 8,   max: 30  },
  { key: 'hct',  label: 'Hematocrit',  unit: '%',           placeholder: 'e.g. 30',    min: 5,   max: 65  },
];

const sexOptions: { value: Sex; label: string }[] = [
  { value: 'male',     label: 'Adult Male (≥15y)' },
  { value: 'female',   label: 'Adult Female (≥15y)' },
  { value: 'pregnant', label: 'Pregnant Female' },
  { value: 'child',    label: 'Child (6m–14y)' },
];

export default function CBCForm({ values, sex, onChange, onSexChange, onEvaluate, onReset }: Props) {
  const canEvaluate = values.hgb !== '' && values.mcv !== '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Complete Blood Count (CBC)</h2>
      <p className="text-sm text-gray-500 mb-5">Enter available CBC parameters. Hemoglobin and MCV are required for basic classification.</p>

      {/* Sex selector */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Patient Category</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sexOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSexChange(opt.value)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                sex === opt.value
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* CBC fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {f.label}
              {(f.key === 'hgb' || f.key === 'mcv') && (
                <span className="ml-1 text-red-400 text-xs">*</span>
              )}
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min={f.min}
                max={f.max}
                value={values[f.key]}
                onChange={e => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full pr-16 pl-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                {f.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEvaluate}
          disabled={!canEvaluate}
          className="flex-1 py-3 px-6 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:shadow-none text-sm"
        >
          Evaluate
        </button>
        <button
          onClick={onReset}
          className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl transition-all text-sm"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        * Required fields. For discriminant indices, also provide RBC, MCH, and RDW.
      </p>
    </div>
  );
}
