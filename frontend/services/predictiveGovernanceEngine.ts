/**
 * Predictive Governance Engine
 * 
 * Analyzes historical data, geo-spatial clusters, and environmental patterns
 * to forecast civic infrastructure failures before they occur.
 */

export interface PredictionResult {
  wardId: string;
  riskScore: number; // 0-100
  predictedIssues: string[];
  probability: number; // 0-1
  timeframe: '24h' | '7d' | '30d';
  categoryRisk: {
    water: number;
    electricity: number;
    roads: number;
    sanitation: number;
  };
  lastUpdated: string;
}

export interface GovernanceAlert {
  id: string;
  type: 'PREDICTION' | 'ANOMALY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  areaId: string;
  confidence: number;
  suggestedAction: string;
}

// Mock Environmental Data (to be replaced by real weather/sensor APIs)
const ENVIRONMENTAL_FACTORS = {
  currentSeason: 'MONSOON', // 'SUMMER', 'MONSOON', 'WINTER'
  avgTemp: 32,
  isRaining: true,
  humidity: 85
};

export class PredictiveGovernanceEngine {
  /**
   * Forecasts risks for a specific ward based on historical data
   */
  static generateWardPrediction(wardId: string, historicalComplaints: any[]): PredictionResult {
    const wardComplaints = historicalComplaints.filter(c => c.wardId === wardId);
    
    // 1. Trend Analysis (Is complaint frequency increasing?)
    const recentCount = wardComplaints.filter(c => {
      const date = new Date(c.reportedAt);
      return (Date.now() - date.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const previousCount = wardComplaints.filter(c => {
      const date = new Date(c.reportedAt);
      const diff = Date.now() - date.getTime();
      return diff >= 7 * 24 * 60 * 60 * 1000 && diff < 14 * 24 * 60 * 60 * 1000;
    }).length;

    const trendFactor = previousCount > 0 ? (recentCount / previousCount) : 1;

    // 2. Category specific risk calculation
    const categories = ['water', 'electricity', 'roads', 'sanitation'] as const;
    const categoryRisk: any = {};
    
    categories.forEach(cat => {
      const catComplaints = wardComplaints.filter(c => c.category.toLowerCase() === cat);
      const repeatPattern = this.detectRepeatFailurePattern(catComplaints);
      const seasonalWeight = this.getSeasonalWeight(cat, ENVIRONMENTAL_FACTORS.currentSeason);
      
      // Compute weighted risk
      categoryRisk[cat] = Math.min(100, Math.round(
        (catComplaints.length * 5) + 
        (repeatPattern * 20) + 
        (seasonalWeight * 30) + 
        (trendFactor * 10)
      ));
    });

    // 3. Overall Risk Score
    const riskScore = Math.round(
      Object.values(categoryRisk).reduce((a: any, b: any) => a + b, 0) as number / categories.length
    );

    // 4. Predict Issues
    const predictedIssues = [];
    if (categoryRisk.water > 70) predictedIssues.push('Pipeline Burst / Contamination');
    if (categoryRisk.roads > 60) predictedIssues.push('Structural Decay / Pothole Formation');
    if (categoryRisk.electricity > 75) predictedIssues.push('Transformer Overload');
    if (categoryRisk.sanitation > 65) predictedIssues.push('Sewerage Blockage');

    return {
      wardId,
      riskScore,
      predictedIssues,
      probability: Math.min(0.95, (riskScore / 100) + (Math.random() * 0.1)),
      timeframe: riskScore > 80 ? '24h' : riskScore > 50 ? '7d' : '30d',
      categoryRisk: categoryRisk as any,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Detects if failures are repeating in same spatial clusters
   */
  private static detectRepeatFailurePattern(complaints: any[]): number {
    if (complaints.length < 3) return 0;
    
    // Group by localized clusters (simplified mock)
    // In real app, would use spatial clustering like DBSCAN
    return Math.min(1, complaints.length / 10);
  }

  /**
   * Returns weight based on seasonal environmental patterns
   */
  private static getSeasonalWeight(category: string, season: string): number {
    const weights: any = {
      MONSOON: { water: 0.8, roads: 0.9, sanitation: 0.7, electricity: 0.4 },
      SUMMER: { water: 0.9, electricity: 0.8, roads: 0.2, sanitation: 0.3 },
      WINTER: { water: 0.3, electricity: 0.5, roads: 0.1, sanitation: 0.2 }
    };
    return weights[season]?.[category] || 0.1;
  }

  /**
   * Generates actionable governance alerts from predictions
   */
  static generateAlerts(prediction: PredictionResult): GovernanceAlert[] {
    const alerts: GovernanceAlert[] = [];

    if (prediction.riskScore > 80) {
      alerts.push({
        id: `alert-${Date.now()}-${prediction.wardId}`,
        type: 'PREDICTION',
        severity: 'CRITICAL',
        message: `High risk of ${prediction.predictedIssues.join(' & ')} in Ward ${prediction.wardId}`,
        areaId: prediction.wardId,
        confidence: prediction.probability,
        suggestedAction: 'Deploy preventive maintenance team within 12 hours.'
      });
    }

    return alerts;
  }
}
