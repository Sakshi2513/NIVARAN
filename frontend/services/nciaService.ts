import { LiveComplaintFeed, ComplaintRecord } from './liveComplaintFeed';
import { CivicStream, CivicEvent } from './civicIntelligenceStream';
import { analyzeComplaint } from './aiGovernanceEngine';

/**
 * NCIA: Nivaran Civic Intelligence Agent
 * 
 * A reasoning layer that aggregates governance data, real-time events,
 * and geo-intelligence to provide actionable insights.
 */

export interface NCIAMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'intelligence_report' | 'action_suggestion' | 'analytics';
  metadata?: any;
  actions?: { label: string; action: string; icon?: string }[];
}

class NCIAEngine {
  private static instance: NCIAEngine;
  private history: NCIAMessage[] = [];
  private lastContext: { complaintId?: string; ward?: string } = {};

  private constructor() {
    this.init();
  }

  public static getInstance(): NCIAEngine {
    if (!NCIAEngine.instance) {
      NCIAEngine.instance = new NCIAEngine();
    }
    return NCIAEngine.instance;
  }

  private init() {
    // NCIA monitors the civic stream internally to stay "aware"
    CivicStream.subscribe((event: CivicEvent) => {
      this.processSystemEvent(event);
    });
  }

  private processSystemEvent(event: CivicEvent) {
    // If it's an emergency, NCIA prepares a context-aware response if the user is active
    if (event.severity === 'critical') {
      console.log('NCIA Awareness: Critical event detected in ', event.location.ward);
    }
  }

  public async processQuery(query: string): Promise<NCIAMessage> {
    const timestamp = Date.now();
    const intent = this.detectIntent(query);
    
    // Simulate reasoning steps
    // 1. Understand intent
    // 2. Fetch relevant data
    // 3. Aggregate insights
    
    let response: NCIAMessage = {
      role: 'assistant',
      content: '',
      timestamp,
      type: 'text'
    };

    switch (intent) {
      case 'complaint_status':
        response = this.generateComplaintReport(query);
        break;
      case 'analytics':
        response = this.generateAnalyticsReport(query);
        break;
      case 'geo_intelligence':
        response = this.generateGeoReport(query);
        break;
      case 'escalation':
        response = this.generateEscalationAdvice(query);
        break;
      default:
        response.content = "I am the Nivaran Civic Intelligence Agent (NCIA). I can analyze active complaints, officer deployments, and ward-level performance. How can I assist your governance oversight today?";
        response.actions = [
          { label: 'Summarize Ward 7', action: 'summarize_ward_7' },
          { label: 'Check My Last Issue', action: 'last_complaint' }
        ];
    }

    this.history.push({ role: 'user', content: query, timestamp: Date.now() - 1 });
    this.history.push(response);
    return response;
  }

  private detectIntent(query: string) {
    const q = query.toLowerCase();
    if (q.includes('status') || q.includes('my complaint') || q.includes('where is')) return 'complaint_status';
    if (q.includes('compare') || q.includes('performance') || q.includes('analytics')) return 'analytics';
    if (q.includes('ward') || q.includes('area') || q.includes('hotspot') || q.includes('cluster')) return 'geo_intelligence';
    if (q.includes('urgent') || q.includes('slow') || q.includes('escalate') || q.includes('danger')) return 'escalation';
    return 'general';
  }

  private generateComplaintReport(query: string): NCIAMessage {
    const complaints = LiveComplaintFeed.getComplaints();
    // For demo, we take the most relevant one or the last discussed
    const complaint = complaints[0]; 
    this.lastContext.complaintId = complaint.id;

    const isAssigned = !!complaint.assignedOfficer;

    return {
      role: 'assistant',
      content: `Intelligence report for **#CMP-${complaint.id}**: The issue is currently **${complaint.status}**.`,
      type: 'intelligence_report',
      timestamp: Date.now(),
      metadata: {
        complaint,
        officer: complaint.assignedOfficer
      },
      actions: [
        { label: 'Track on Map', action: 'track_map', icon: 'MapPin' },
        { label: isAssigned ? 'Contact Officer' : 'Request Allocation', action: 'contact_officer', icon: 'Phone' },
        { label: 'Escalate', action: 'escalate_issue', icon: 'AlertTriangle' }
      ]
    };
  }

  private generateAnalyticsReport(query: string): NCIAMessage {
    return {
      role: 'assistant',
      content: "Comparative analysis indicates a **14% improvement** in resolution speed for **Electricity** issues across all wards this week. However, **Ward 5** shows a bottleneck in **Sanitation** clearance due to a 22% spike in reports.",
      type: 'analytics',
      timestamp: Date.now(),
      actions: [
        { label: 'Show Ward 5 Data', action: 'view_ward_5' },
        { label: 'Resolution Trends', action: 'view_trends' }
      ]
    };
  }

  private generateGeoReport(query: string): NCIAMessage {
    return {
      role: 'assistant',
      content: "Geo-spatial analysis has identified a **Hotspot Cluster** in **Sector 4**. There are currently 5 active water-related complaints within a 200m radius, suggesting a primary pipeline failure.",
      type: 'intelligence_report',
      timestamp: Date.now(),
      actions: [
        { label: 'Open Heatmap', action: 'view_gis' },
        { label: 'Deploy Emergency Unit', action: 'deploy_unit' }
      ]
    };
  }

  private generateEscalationAdvice(query: string): NCIAMessage {
    return {
      role: 'assistant',
      content: "I've detected high urgency in your request combined with an approaching SLA threshold (85% elapsed). I recommend immediate escalation to the **Zonal Supervisor**.",
      type: 'action_suggestion',
      timestamp: Date.now(),
      actions: [
        { label: 'Confirm Escalation', action: 'force_escalate', icon: 'Zap' },
        { label: 'Wait 24h', action: 'ignore' }
      ]
    };
  }

  public getHistory() {
    return this.history;
  }
}

export const NCIA = NCIAEngine.getInstance();
