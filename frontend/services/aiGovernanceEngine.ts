/**
 * AI Governance Engine — Nivaran Intelligence Layer
 *
 * Centralized AI processing for complaint categorization, severity scoring,
 * sentiment analysis, smart summarization, duplicate detection, and priority.
 * Uses keyword-based heuristics (mock AI) as a foundation — swap with
 * ML endpoint when ready.
 */

import { FutureImpactSimulator, type FutureImpactSimulation } from './futureImpactSimulator';
import { CivicPatternRadar, type PatternRadarResults } from './civicPatternRadar';
import type { ComplaintRecord } from './liveComplaintFeed';

// ─── Types ───────────────────────────────────────────────────
export interface AICategory {
  category: string;
  department: string;
  confidence: number;
}

export interface AISeverity {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
}

export interface AISentiment {
  sentiment: 'calm' | 'frustrated' | 'angry' | 'panic';
  confidence: number;
  emotionalIntensity: number; // 0-100
}

export interface AISummary {
  shortSummary: string;
  officerBrief: string;
  recommendation: string;
}

export interface AIDuplicateResult {
  isDuplicate: boolean;
  confidence: number;
  linkedComplaintIds: string[];
}

export type AIPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface AIAnalysis {
  category: AICategory;
  severity: AISeverity;
  sentiment: AISentiment;
  summary: AISummary;
  priority: AIPriority;
  futureImpact?: FutureImpactSimulation;
  civicPatternRadar?: PatternRadarResults;
}

// ─── Category Mappings ───────────────────────────────────────
const CATEGORY_KEYWORDS: Record<string, { keywords: string[]; department: string; baseSeverity: number }> = {
  'Roads': {
    keywords: ['road', 'pothole', 'highway', 'flyover', 'bridge', 'crack', 'pavement', 'asphalt', 'footpath', 'divider', 'speed breaker'],
    department: 'Public Works Department',
    baseSeverity: 40,
  },
  'Water Supply': {
    keywords: ['water', 'pipe', 'leak', 'supply', 'tap', 'bore', 'tanker', 'pipeline', 'jal', 'drinking water', 'contaminated water'],
    department: 'Jal Vibhag',
    baseSeverity: 50,
  },
  'Electricity': {
    keywords: ['electric', 'power', 'transformer', 'wire', 'outage', 'blackout', 'voltage', 'current', 'meter', 'pole', 'sparking'],
    department: 'Electricity Board',
    baseSeverity: 55,
  },
  'Sanitation': {
    keywords: ['sewer', 'drain', 'toilet', 'sanitation', 'hygiene', 'waste', 'dirty', 'cleaning', 'sweeping', 'smell', 'stench'],
    department: 'Municipal Sanitation',
    baseSeverity: 45,
  },
  'Drainage': {
    keywords: ['drainage', 'waterlogging', 'flooding', 'clogged', 'nala', 'overflow', 'stormwater', 'rainwater'],
    department: 'Drainage Department',
    baseSeverity: 50,
  },
  'Street Lights': {
    keywords: ['streetlight', 'street light', 'lamp', 'light pole', 'lighting', 'dark street', 'bulb'],
    department: 'Electrical Maintenance',
    baseSeverity: 30,
  },
  'Public Safety': {
    keywords: ['safety', 'crime', 'theft', 'violence', 'harassment', 'police', 'security', 'threat', 'danger', 'attack', 'robbery'],
    department: 'Public Safety Division',
    baseSeverity: 65,
  },
  'Pollution': {
    keywords: ['pollution', 'smoke', 'emission', 'air quality', 'noise', 'factory', 'industrial', 'chemical', 'toxic'],
    department: 'Environment Department',
    baseSeverity: 45,
  },
  'Garbage': {
    keywords: ['garbage', 'trash', 'dump', 'rubbish', 'litter', 'waste collection', 'bin', 'dustbin', 'mcd', 'dumping'],
    department: 'Solid Waste Management',
    baseSeverity: 35,
  },
  'Traffic': {
    keywords: ['traffic', 'signal', 'jam', 'congestion', 'parking', 'vehicle', 'zebra crossing', 'intersection'],
    department: 'Traffic Management',
    baseSeverity: 35,
  },
};

// ─── Emergency & Sentiment Keywords ──────────────────────────
const EMERGENCY_KEYWORDS = [
  { word: 'fire', weight: 30 },
  { word: 'accident', weight: 25 },
  { word: 'flood', weight: 25 },
  { word: 'explosion', weight: 35 },
  { word: 'electric shock', weight: 30 },
  { word: 'injury', weight: 20 },
  { word: 'gas leak', weight: 30 },
  { word: 'collapse', weight: 25 },
  { word: 'death', weight: 35 },
  { word: 'drowning', weight: 30 },
  { word: 'trapped', weight: 25 },
  { word: 'critical', weight: 15 },
  { word: 'emergency', weight: 20 },
  { word: 'urgent', weight: 10 },
  { word: 'immediate', weight: 10 },
  { word: 'dangerous', weight: 15 },
  { word: 'life threatening', weight: 30 },
  { word: 'sinkhole', weight: 20 },
  { word: 'electrocution', weight: 30 },
];

const CROWD_KEYWORDS = [
  { word: 'colony', weight: 5 },
  { word: 'society', weight: 5 },
  { word: 'market', weight: 8 },
  { word: 'school', weight: 10 },
  { word: 'hospital', weight: 12 },
  { word: 'main road', weight: 8 },
  { word: 'highway', weight: 10 },
  { word: 'residential', weight: 5 },
  { word: 'children', weight: 10 },
  { word: 'elderly', weight: 8 },
];

const ANGRY_WORDS = ['useless', 'pathetic', 'terrible', 'worst', 'incompetent', 'corrupt', 'shame', 'disgusting', 'fed up', 'sick of', 'enough', 'angry', 'furious'];
const FRUSTRATED_WORDS = ['frustrated', 'disappointed', 'multiple times', 'again and again', 'no response', 'ignored', 'still waiting', 'months', 'weeks', 'nothing done'];
const PANIC_WORDS = ['help', 'please', 'someone', 'dying', 'hurry', 'save', 'sos', 'trapped', 'stuck', 'scared'];

// ─── Helper ──────────────────────────────────────────────────
function textContains(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter(k => lower.includes(k)).length;
}

// ─── 1. CATEGORIZE ──────────────────────────────────────────
export function categorizeComplaint(title: string, description: string): AICategory {
  const text = `${title} ${description}`.toLowerCase();
  let bestCategory = 'Other';
  let bestDept = 'General Administration';
  let bestScore = 0;

  for (const [cat, config] of Object.entries(CATEGORY_KEYWORDS)) {
    const hits = config.keywords.filter(kw => text.includes(kw)).length;
    const score = hits / config.keywords.length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
      bestDept = config.department;
    }
  }

  return {
    category: bestCategory,
    department: bestDept,
    confidence: Math.min(98, Math.round(bestScore > 0 ? 60 + bestScore * 40 : 30)),
  };
}

// ─── 2. SEVERITY ─────────────────────────────────────────────
export function calculateSeverity(title: string, description: string, category?: string): AISeverity {
  const text = `${title} ${description}`.toLowerCase();
  const factors: string[] = [];
  let score = CATEGORY_KEYWORDS[category || '']?.baseSeverity || 35;

  for (const ek of EMERGENCY_KEYWORDS) {
    if (text.includes(ek.word)) {
      score += ek.weight;
      factors.push(`Emergency: "${ek.word}"`);
    }
  }

  for (const ck of CROWD_KEYWORDS) {
    if (text.includes(ck.word)) {
      score += ck.weight;
      factors.push(`High-impact area: "${ck.word}"`);
    }
  }

  // Repetition / urgency modifiers
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations >= 2) { score += 5; factors.push('Urgency emphasis'); }
  if (text.includes('days') || text.includes('weeks') || text.includes('months')) {
    score += 8; factors.push('Prolonged issue');
  }

  score = Math.min(100, Math.max(0, score));
  const level = score >= 81 ? 'CRITICAL' : score >= 61 ? 'HIGH' : score >= 31 ? 'MEDIUM' : 'LOW';

  return { score, level, factors: factors.slice(0, 5) };
}

// ─── 3. SENTIMENT ────────────────────────────────────────────
export function analyzeSentiment(text: string): AISentiment {
  const lower = text.toLowerCase();
  const panicHits = countMatches(lower, PANIC_WORDS);
  const angryHits = countMatches(lower, ANGRY_WORDS);
  const frustratedHits = countMatches(lower, FRUSTRATED_WORDS);

  let sentiment: AISentiment['sentiment'] = 'calm';
  let intensity = 15;

  if (panicHits >= 2) {
    sentiment = 'panic'; intensity = 80 + panicHits * 5;
  } else if (angryHits >= 2) {
    sentiment = 'angry'; intensity = 60 + angryHits * 8;
  } else if (frustratedHits >= 1 || angryHits >= 1) {
    sentiment = 'frustrated'; intensity = 40 + (frustratedHits + angryHits) * 10;
  }

  intensity = Math.min(100, intensity);
  const confidence = Math.min(95, 55 + (panicHits + angryHits + frustratedHits) * 10);

  return { sentiment, confidence, emotionalIntensity: intensity };
}

// ─── 4. SUMMARIZE ────────────────────────────────────────────
export function summarizeComplaint(title: string, description: string, category: string): AISummary {
  const location = extractLocation(description) || extractLocation(title) || 'the reported area';
  const issue = category !== 'Other' ? category.toLowerCase() : 'civic';

  return {
    shortSummary: `${category} issue reported at ${location}. ${title}.`,
    officerBrief: `Inspect ${issue} complaint at ${location}. Assess damage and deploy appropriate team.`,
    recommendation: generateRecommendation(category, title, description),
  };
}

function extractLocation(text: string): string | null {
  const locPatterns = [
    /(?:near|at|on|in)\s+([A-Z][a-zA-Z\s]+(?:Road|Street|Colony|Market|Sector|Park|Avenue|Nagar|Vihar|Lane|Highway|Chowk|Circle))/,
    /(?:near|at|on|in)\s+([A-Z][a-zA-Z\s]{3,20})/,
  ];
  for (const p of locPatterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

function generateRecommendation(category: string, title: string, desc: string): string {
  const recs: Record<string, string> = {
    'Roads': 'Deploy road repair crew with patching equipment. Barricade area if hazardous.',
    'Water Supply': 'Dispatch plumbing team to inspect pipeline. Arrange tanker if supply interrupted.',
    'Electricity': 'Send electrical maintenance unit. Ensure area is cordoned if live wires exposed.',
    'Sanitation': 'Deploy sanitation crew for cleanup. Check drainage connectivity.',
    'Drainage': 'Inspect drainage line for blockage. Deploy de-silting equipment if needed.',
    'Street Lights': 'Schedule electrical maintenance for light fixture replacement.',
    'Public Safety': 'Coordinate with local police. Assess security situation on ground.',
    'Pollution': 'Investigate pollution source. Collect samples if industrial discharge suspected.',
    'Garbage': 'Schedule immediate waste pickup. Inspect bin placement in area.',
    'Traffic': 'Coordinate with traffic police. Check signal functionality.',
  };
  return recs[category] || 'Assign field officer for on-site assessment and report.';
}

// ─── 5. DUPLICATE DETECTION ─────────────────────────────────
export function detectDuplicateComplaints(
  title: string,
  description: string,
  category: string,
  lat: number | undefined,
  lng: number | undefined,
  existingComplaints: Array<{ id: string; title: string; description?: string; category: string; lat?: number; lng?: number }>
): AIDuplicateResult {
  const linked: string[] = [];
  let maxConfidence = 0;

  for (const existing of existingComplaints) {
    let score = 0;

    // Category match
    if (existing.category === category) score += 25;

    // Title similarity (simple word overlap)
    const titleWords = new Set(title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const existingWords = new Set(existing.title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const overlap = [...titleWords].filter(w => existingWords.has(w)).length;
    const titleSim = titleWords.size > 0 ? (overlap / titleWords.size) * 40 : 0;
    score += titleSim;

    // Location proximity (within ~500m)
    if (lat && lng && existing.lat && existing.lng) {
      const dist = Math.sqrt(Math.pow(lat - existing.lat, 2) + Math.pow(lng - existing.lng, 2));
      if (dist < 0.005) score += 30; // ~500m
      else if (dist < 0.01) score += 15; // ~1km
    }

    if (score > 50) {
      linked.push(existing.id);
      maxConfidence = Math.max(maxConfidence, Math.min(98, score));
    }
  }

  return {
    isDuplicate: maxConfidence >= 75,
    confidence: Math.round(maxConfidence),
    linkedComplaintIds: linked,
  };
}

// ─── 6. PRIORITY ENGINE ─────────────────────────────────────
export function generatePriorityLevel(
  severity: AISeverity,
  sentiment: AISentiment,
  category: string,
  duplicateClusterSize: number
): AIPriority {
  let score = severity.score;

  // Sentiment boost
  if (sentiment.sentiment === 'panic') score += 20;
  else if (sentiment.sentiment === 'angry') score += 10;
  else if (sentiment.sentiment === 'frustrated') score += 5;

  // Category boost
  if (['Public Safety', 'Electricity'].includes(category)) score += 10;

  // Duplicate cluster boost (more reports = more urgent)
  score += Math.min(15, duplicateClusterSize * 5);

  if (score >= 85) return 'EMERGENCY';
  if (score >= 65) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

// ─── 7. FULL ANALYSIS (convenience) ─────────────────────────
export function analyzeComplaint(
  title: string,
  description: string,
  existingComplaints: Array<{ id: string; title: string; description?: string; category: string; lat?: number; lng?: number; location?: { ward: string }; timestamp?: string } & any> = [],
  lat?: number,
  lng?: number,
  wardId?: string
): AIAnalysis & { duplicates: AIDuplicateResult } {
  const cat = categorizeComplaint(title, description);
  const sev = calculateSeverity(title, description, cat.category);
  const sent = analyzeSentiment(`${title} ${description}`);
  const sum = summarizeComplaint(title, description, cat.category);
  const dup = detectDuplicateComplaints(title, description, cat.category, lat, lng, existingComplaints);
  const priority = generatePriorityLevel(sev, sent, cat.category, dup.linkedComplaintIds.length);

  // 4. Predictive Future Impact Simulation
  const futureImpact = FutureImpactSimulator.generateSimulation({
    id: `TMP-${Math.random().toString(36).substr(2, 5)}`,
    category: cat.category,
    severityScore: sev.score,
    sentiment: sent.sentiment,
    clusterSize: dup.linkedComplaintIds.length
  });

  // 5. Civic Pattern Radar (Temporal Intelligence)
  const patternRadar = CivicPatternRadar.analyzeTemporalPatterns(existingComplaints, wardId);

  return { 
    category: cat, 
    severity: sev, 
    sentiment: sent, 
    summary: sum, 
    priority, 
    duplicates: dup,
    futureImpact,
    civicPatternRadar: patternRadar
  };
}
