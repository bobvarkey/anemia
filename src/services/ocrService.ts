import Tesseract from 'tesseract.js';
import type { CBCValues } from '../types';

// Regex patterns for lab value extraction
const patterns: { key: keyof CBCValues; regex: RegExp }[] = [
  {
    key: 'hgb',
    regex: /(?:hemoglobin|hgb|hb)[\s:]*(\d+\.?\d*)\s*(?:g?\/?d?L?|g\s*\/\s*dl|g\/L)?/i,
  },
  {
    key: 'mcv',
    regex: /(?:mcv|mean\s*corpuscular\s*volume)[\s:]*(\d+\.?\d*)\s*(?:f?L?|fl)?/i,
  },
  {
    key: 'mch',
    regex: /(?:mch|mean\s*corpuscular\s*hemoglobin)[\s:]*(\d+\.?\d*)\s*(?:p?g?|pg)?/i,
  },
  {
    key: 'mchc',
    regex: /(?:mchc)[\s:]*(\d+\.?\d*)\s*(?:g?\/?d?L?|g\/L)?/i,
  },
  {
    key: 'rbc',
    regex: /(?:rbc|red\s*blood\s*cell|red\s*cell\s*count|erythrocytes)[\s:]*(\d+\.?\d*)/i,
  },
  {
    key: 'rdw',
    regex: /(?:rdw|red\s*cell\s*distribution\s*width)[\s:]*(\d+\.?\d*)\s*%?/i,
  },
  {
    key: 'hct',
    regex: /(?:hct|hematocrit|hct\s*packed\s*cell\s*volume)[\s:]*(\d+\.?\d*)\s*%?/i,
  },
];

// Validation ranges for CBC values
const validationRanges: Record<keyof CBCValues, { min: number; max: number }> = {
  hgb: { min: 3, max: 20 },
  mcv: { min: 50, max: 150 },
  mch: { min: 15, max: 40 },
  mchc: { min: 25, max: 40 },
  rbc: { min: 1, max: 10 },
  rdw: { min: 5, max: 30 },
  hct: { min: 10, max: 70 },
};

export interface OCResult {
  success: boolean;
  values: Partial<CBCValues>;
  rawText: string;
  confidence: number;
  error?: string;
}

export async function extractTextFromImage(imageData: string | File): Promise<OCResult> {
  try {
    const result = await Tesseract.recognize(
      imageData,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    );

    const rawText = result.data.text;
    const values = parseLabValues(rawText);
    const confidence = result.data.confidence;

    return {
      success: true,
      values,
      rawText,
      confidence,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      values: {},
      rawText: '',
      confidence: 0,
      error: error instanceof Error ? error.message : 'Unknown OCR error',
    };
  }
}

function parseLabValues(text: string): Partial<CBCValues> {
  const values: Partial<CBCValues> = {};

  for (const { key, regex } of patterns) {
    const match = text.match(regex);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      const range = validationRanges[key];

      // Validate the value is within reasonable range
      if (value >= range.min && value <= range.max) {
        values[key] = value.toString();
      }
    }
  }

  return values;
}

export function validateExtractedValues(values: Partial<CBCValues>): {
  valid: boolean;
  missing: string[];
  found: string[];
} {
  const required: (keyof CBCValues)[] = ['hgb', 'mcv', 'mch', 'rbc', 'rdw'];
  const found: string[] = [];
  const missing: string[] = [];

  for (const key of required) {
    if (values[key]) {
      found.push(key);
    } else {
      missing.push(key);
    }
  }

  return {
    valid: found.length >= 2, // At least HGB and MCV for basic classification
    missing,
    found,
  };
}
