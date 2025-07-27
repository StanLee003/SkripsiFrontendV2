// src/utils/languages.js

export const languages = [
  // Nasional
  { code: 'id', label: 'Indonesia' },

  // Internasional
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese (Mandarin)' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'ru', label: 'Russian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'th', label: 'Thai' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'ms', label: 'Malay' },
  { code: 'fil', label: 'Filipino (Tagalog)' },
  { code: 'tr', label: 'Turkish' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'ro', label: 'Romanian' },
  { code: 'fa', label: 'Persian' },
  { code: 'sv', label: 'Swedish' },
  { code: 'cs', label: 'Czech' },
  { code: 'fi', label: 'Finnish' },
  { code: 'el', label: 'Greek' },
  { code: 'da', label: 'Danish' },
  { code: 'no', label: 'Norwegian' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'mr', label: 'Marathi' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'he', label: 'Hebrew' },
  { code: 'sw', label: 'Swahili' },
  { code: 'am', label: 'Amharic' },
  { code: 'zu', label: 'Zulu' },
  { code: 'xh', label: 'Xhosa' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'ha', label: 'Hausa' },
  { code: 'ig', label: 'Igbo' },
  { code: 'my', label: 'Burmese' },
  { code: 'km', label: 'Khmer' },
  { code: 'lo', label: 'Lao' },
  { code: 'si', label: 'Sinhala' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'ne', label: 'Nepali' },
  { code: 'ps', label: 'Pashto' },
  { code: 'kk', label: 'Kazakh' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'lt', label: 'Lithuanian' },
  { code: 'lv', label: 'Latvian' },
  { code: 'et', label: 'Estonian' },
  { code: 'hr', label: 'Croatian' },
  { code: 'sl', label: 'Slovenian' },
  { code: 'sk', label: 'Slovak' },
  { code: 'sr', label: 'Serbian' },
];

export const systemLanguages = [
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: 'Chinese (Mandarin)' },
];

export function getLanguageLabel(code) {
  const found = languages.find(lang => lang.code === code) ||
                systemLanguages.find(lang => lang.code === code);
  return found ? found.label : code;
}
