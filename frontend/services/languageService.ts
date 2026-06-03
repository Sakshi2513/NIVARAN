/**
 * Language & Translation Service
 * 
 * Handles multi-lingual detection and translation to canonical English
 * for downstream AI processing.
 */

export interface MultilingualText {
  original: string;
  detectedLanguage: string;
  translated: string;
}

class LanguageEngine {
  private static instance: LanguageEngine;

  private constructor() {}

  public static getInstance(): LanguageEngine {
    if (!LanguageEngine.instance) {
      LanguageEngine.instance = new LanguageEngine();
    }
    return LanguageEngine.instance;
  }

  /**
   * Processes input text (Typed or Voice Transcript)
   */
  public async processInput(text: string): Promise<MultilingualText> {
    // In a production app, this would call a Translation API (Google Translate / Azure)
    // For the Nivaran prototype, we simulate detection and translation
    
    const detectedLanguage = this.simulateDetection(text);
    const translated = await this.simulateTranslation(text, detectedLanguage);

    return {
      original: text,
      detectedLanguage,
      translated
    };
  }

  private simulateDetection(text: string): string {
    const t = text.toLowerCase();
    if (/[\u0900-\u097F]/.test(t)) return 'Hindi'; // Devanagari range
    if (/[\u0B80-\u0BFF]/.test(t)) return 'Tamil';
    if (/[\u0980-\u09FF]/.test(t)) return 'Bengali';
    if (/[\u0A80-\u0AFF]/.test(t)) return 'Gujarati';
    if (/[\u0C00-\u0C7F]/.test(t)) return 'Telugu';
    if (/[\u0C80-\u0CFF]/.test(t)) return 'Kannada';
    return 'English';
  }

  private async simulateTranslation(text: string, lang: string): Promise<string> {
    if (lang === 'English') return text;

    // Simulate translation logic
    // In demo, we just append [Translated] to show the pipe is working
    // or return a predefined translation if we match keywords
    if (text.includes('सड़क') || text.includes('road')) return 'Pothole and road damage reported on the main street.';
    if (text.includes('पानी') || text.includes('water')) return 'Water leakage and supply interruption in the residential block.';
    if (text.includes('कचरा') || text.includes('garbage')) return 'Uncollected garbage and waste accumulation causing sanitation issues.';

    return `[English Translation of ${lang}]: ${text}`;
  }
}

export const LanguageService = LanguageEngine.getInstance();
