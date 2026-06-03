/**
 * Future Impact Simulator — Nivaran Predictive Layer
 * 
 * Generates predictive simulations of outcomes over time if a civic issue
 * is not resolved. Helps in understanding the 'cost of inaction'.
 */

export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SimulationStep {
  delayHours: number;
  impactLevel: ImpactLevel;
  description: string;
  predictedOutcome: string;
  riskScore: number;
}

export interface FutureImpactSimulation {
  complaintId: string;
  simulations: SimulationStep[];
  summaryInsight: string;
}

class ImpactSimulator {
  private static instance: ImpactSimulator;

  private constructor() {}

  public static getInstance(): ImpactSimulator {
    if (!ImpactSimulator.instance) {
      ImpactSimulator.instance = new ImpactSimulator();
    }
    return ImpactSimulator.instance;
  }

  public generateSimulation(complaint: {
    id: string;
    category: string;
    severityScore: number;
    sentiment?: string;
    clusterSize?: number;
  }): FutureImpactSimulation {
    const { category, severityScore, sentiment, clusterSize = 1 } = complaint;

    const baseUrgency = this.calculateBaseUrgency(category, severityScore, sentiment, clusterSize);
    
    const simulations: SimulationStep[] = [
      this.createStep(24, baseUrgency, category),
      this.createStep(72, baseUrgency * 1.5, category),
      this.createStep(168, baseUrgency * 2.5, category),
    ];

    return {
      complaintId: complaint.id,
      simulations,
      summaryInsight: this.generateSummary(category, baseUrgency)
    };
  }

  private calculateBaseUrgency(cat: string, score: number, sent?: string, clusters: number = 1): number {
    let urgency = score;
    
    // Category Multipliers
    if (['Water Supply', 'Public Safety'].includes(cat)) urgency *= 1.2;
    if (['Electricity', 'Drainage'].includes(cat)) urgency *= 1.1;

    // Sentiment Multipliers
    if (sent === 'panic') urgency *= 1.3;
    if (sent === 'angry') urgency *= 1.1;

    // Cluster Amplification
    if (clusters > 3) urgency *= 1.25;

    return Math.min(100, urgency);
  }

  private createStep(hours: number, score: number, cat: string): SimulationStep {
    const finalScore = Math.min(100, score);
    const level: ImpactLevel = finalScore > 85 ? 'CRITICAL' : finalScore > 65 ? 'HIGH' : finalScore > 40 ? 'MEDIUM' : 'LOW';
    
    const outcomes: Record<string, string[]> = {
      'Water Supply': [
        'Minor supply fluctuations in the immediate block.',
        'Contamination risk increases as stagnant water facilitates bacterial growth.',
        'Large-scale supply disruption and potential public health emergency in the ward.'
      ],
      'Roads': [
        'Traffic slowing as vehicles navigate the obstacle.',
        'Increased risk of minor collisions and vehicle suspension damage.',
        'High probability of major accidents and complete road failure under heavy load.'
      ],
      'Electricity': [
        'Intermittent flickering and localized voltage drops.',
        'Equipment damage risk due to unstable load distribution.',
        'Complete transformer failure and fire hazard due to exposed circuit stress.'
      ],
      'Sanitation': [
        'Foul odor becomes noticeable in the 100m radius.',
        'Vector-borne disease risk escalates as waste accumulation peaks.',
        'Sanitation crisis affecting local businesses and public hygiene safety.'
      ],
      'Default': [
        'Minor degradation of civic infrastructure.',
        'Escalation of public frustration and localized inconvenience.',
        'Systemic failure in the affected sector requiring emergency intervention.'
      ]
    };

    const idx = hours === 24 ? 0 : hours === 72 ? 1 : 2;
    const categoryOutcomes = outcomes[cat] || outcomes['Default'];
    
    return {
      delayHours: hours,
      impactLevel: level,
      description: `Predicted state at T+${hours} hours.`,
      predictedOutcome: categoryOutcomes[idx],
      riskScore: Math.round(finalScore)
    };
  }

  private generateSummary(cat: string, urgency: number): string {
    if (urgency > 80) return `Critical escalation alert: ${cat} failure is imminent without immediate intervention.`;
    if (urgency > 50) return `Moderate risk detected: This ${cat} issue will significantly impact Ward health within 72 hours.`;
    return `Baseline monitoring: Issue is currently localized but will degrade without scheduled maintenance.`;
  }
}

export const FutureImpactSimulator = ImpactSimulator.getInstance();
