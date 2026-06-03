import { EventEmitter } from 'events';
import { analyzeComplaint } from './aiGovernanceEngine';
import { PredictiveGovernanceEngine } from './predictiveGovernanceEngine';

/**
 * Civic Intelligence Stream Engine
 * 
 * Acts as the 'nervous system' of Nivaran, emitting real-time governance events
 * enriched with AI and predictive intelligence.
 */

export type EventType = 
  | 'complaint_created' 
  | 'complaint_escalated' 
  | 'emergency_detected' 
  | 'officer_assigned' 
  | 'SLA_breach_warning' 
  | 'geo_hotspot_detected' 
  | 'prediction_triggered';

export interface CivicEvent {
  eventType: EventType;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    ward: string;
    coordinates?: [number, number];
  };
  payload: any;
  intelligence: {
    aiCategory: string;
    riskScore: number;
    urgency: string;
    department: string;
  };
}

class CivicIntelligenceStream extends EventEmitter {
  private static instance: CivicIntelligenceStream;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  public static getInstance(): CivicIntelligenceStream {
    if (!CivicIntelligenceStream.instance) {
      CivicIntelligenceStream.instance = new CivicIntelligenceStream();
    }
    return CivicIntelligenceStream.instance;
  }

  /**
   * Publishes a raw event and enriches it with intelligence layers
   */
  public async publishEvent(
    type: EventType, 
    rawPayload: any, 
    wardId: string, 
    coords?: [number, number]
  ): Promise<CivicEvent> {
    
    // 1. Core Enrichment (AI Engine)
    const aiAnalysis = analyzeComplaint(
      rawPayload.title || 'Generic Event', 
      rawPayload.description || '', 
      [], 
      coords?.[0], 
      coords?.[1]
    );

    // 2. Predictive Enrichment (Predictive Engine)
    // Mock historical data for instant calculation
    const prediction = PredictiveGovernanceEngine.generateWardPrediction(wardId, []);

    const event: CivicEvent = {
      eventType: type,
      timestamp: Date.now(),
      severity: this.mapSeverity(aiAnalysis.severity.level, type),
      location: {
        ward: wardId,
        coordinates: coords
      },
      payload: rawPayload,
      intelligence: {
        aiCategory: aiAnalysis.category.category,
        riskScore: prediction.riskScore,
        urgency: aiAnalysis.priority,
        department: aiAnalysis.category.department,
        fullAnalysis: aiAnalysis
      }
    };

    // 3. Emit for real-time subscribers
    this.emit('civic_event', event);
    this.emit(type, event);

    // 4. Pattern Detection (Internal Logic)
    if (type === 'complaint_created' && event.severity === 'critical') {
      this.publishEvent('emergency_detected', event, wardId, coords);
    }

    return event;
  }

  private mapSeverity(aiLevel: string, type: EventType): 'low' | 'medium' | 'high' | 'critical' {
    if (type === 'SLA_breach_warning') return 'high';
    if (type === 'emergency_detected') return 'critical';
    
    switch (aiLevel) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      default: return 'low';
    }
  }

  /**
   * Utility for internal components to subscribe to the live stream
   */
  public subscribe(callback: (event: CivicEvent) => void) {
    this.on('civic_event', callback);
    return () => this.off('civic_event', callback);
  }
}

export const CivicStream = CivicIntelligenceStream.getInstance();
