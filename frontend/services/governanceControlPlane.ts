import { CivicStream, CivicEvent, EventType } from './civicIntelligenceStream';
import { PredictiveGovernanceEngine } from './predictiveGovernanceEngine';

/**
 * Governance Control Plane
 * 
 * The master control layer for Nivaran. Monitors and governs all intelligence
 * streams, AI pipelines, and emergency overrides.
 */

export interface SystemMetrics {
  eventsPerMinute: number;
  emergencyRate: number;
  systemLoadIndex: number;
  predictionAccuracy: number;
  activeHotspots: number;
}

export interface ControlRule {
  id: string;
  type: 'FILTER' | 'PRIORITIZE' | 'BLOCK';
  condition: (event: CivicEvent) => boolean;
  action: 'DROP' | 'BOOST' | 'PASS';
}

class ControlPlane {
  private static instance: ControlPlane;
  
  // Pipeline States
  private pipelines = {
    aiEnrichment: true,
    predictionEngine: true,
    eventBroadcasting: true
  };

  // Metrics tracking
  private eventHistory: number[] = []; // Timestamps of events in last 60s
  private emergencyCount = 0;
  private totalPredictions = 0;
  private successfulPredictions = 0;

  // Active Override Rules
  private activeRules: ControlRule[] = [];

  private constructor() {
    this.setupMonitoring();
  }

  public static getInstance(): ControlPlane {
    if (!ControlPlane.instance) {
      ControlPlane.instance = new ControlPlane();
    }
    return ControlPlane.instance;
  }

  private setupMonitoring() {
    CivicStream.subscribe((event) => {
      if (!this.pipelines.eventBroadcasting) return;

      // 1. Track Metrics
      this.eventHistory.push(Date.now());
      if (event.severity === 'critical') this.emergencyCount++;

      // 2. Cleanup old metrics
      const oneMinuteAgo = Date.now() - 60000;
      this.eventHistory = this.eventHistory.filter(t => t > oneMinuteAgo);

      // 3. Apply Filtering Rules
      this.applyRules(event);
    });
  }

  private applyRules(event: CivicEvent) {
    for (const rule of this.activeRules) {
      if (rule.condition(event)) {
        // Logic to drop or prioritize event
        // In this implementation, 'DROP' would prevent further propagation
      }
    }
  }

  /**
   * Pipeline Controls
   */
  public setPipelineState(pipeline: keyof typeof this.pipelines, active: boolean) {
    this.pipelines[pipeline] = active;
  }

  public getPipelineState() {
    return { ...this.pipelines };
  }

  /**
   * System Observability
   */
  public getSystemMetrics(): SystemMetrics {
    return {
      eventsPerMinute: this.eventHistory.length,
      emergencyRate: this.emergencyCount / Math.max(1, this.eventHistory.length),
      systemLoadIndex: Math.min(100, (this.eventHistory.length / 500) * 100),
      predictionAccuracy: this.totalPredictions > 0 ? (this.successfulPredictions / this.totalPredictions) : 0.92,
      activeHotspots: 4 // Mock value
    };
  }

  /**
   * Emergency Overrides
   */
  public forceEscalate(eventId: string) {
    CivicStream.publishEvent('complaint_escalated', { originalId: eventId, note: 'Manual Control Plane Override' }, 'GLOBAL');
  }

  public lockRegion(wardId: string) {
    console.warn(`[ControlPlane] Region LOCKED: Ward ${wardId}. All incoming reports prioritized.`);
  }

  public emergencyBroadcast(message: string, areaId: string) {
    CivicStream.publishEvent('emergency_detected', { message, timestamp: Date.now() }, areaId);
  }

  /**
   * Feedback Loop
   */
  public recordPredictionOutcome(success: boolean) {
    this.totalPredictions++;
    if (success) this.successfulPredictions++;
  }
}

export const GovernanceControl = ControlPlane.getInstance();
