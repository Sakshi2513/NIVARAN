import { CivicStream, CivicEvent } from './civicIntelligenceStream';
import { analyzeComplaint } from './aiGovernanceEngine';

/**
 * Live Complaint Feed
 * 
 * Single source of truth for real-time complaints.
 * Subscribes to the Civic Intelligence Stream to maintain a live,
 * AI-enriched list of issues.
 */

export interface StatusEvent {
  status: 'Received' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  timestamp: number;
  updatedBy: string;
}

export interface OfficerDetails {
  name: string;
  department: string;
  designation: string;
  employeeId: string;
  avatar?: string;
  phone: string; // Masked
  email?: string;
  visitEta: string;
  currentActivity: 'On route' | 'Working' | 'Delayed' | 'Assigned' | 'Available';
  currentTask: string;
  liveProgress: number;
}

export interface ComplaintRecord {
  id: string;
  title: string;
  description: string;
  location: {
    ward: string;
    coordinates?: [number, number];
  };
  category: string;
  severity: string;
  sentiment: string;
  status: 'Received' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
  department: string;
  eta: string;
  statusHistory: StatusEvent[];
  assignedOfficer?: OfficerDetails;
  timestamp: number;
  riskScore: number;
  aiAnalysis?: any;
}

class ComplaintFeedStore {
  private static instance: ComplaintFeedStore;
  private complaints: ComplaintRecord[] = [];
  private subscribers: Set<(complaints: ComplaintRecord[]) => void> = new Set();

  private constructor() {
    this.init();
    // Start simulation loop for real-time effects in dev/demo mode
    this.startSimulation();
  }

  public static getInstance(): ComplaintFeedStore {
    if (!ComplaintFeedStore.instance) {
      ComplaintFeedStore.instance = new ComplaintFeedStore();
    }
    return ComplaintFeedStore.instance;
  }

  private init() {
    // Listen for new complaints on the civic stream
    CivicStream.subscribe((event: CivicEvent) => {
      if (event.eventType === 'complaint_created' || event.eventType === 'emergency_detected') {
        this.addFromEvent(event);
      }
    });

    // Generate Initial Mock Dataset if empty (Simulator Mode)
    this.generateInitialMockDataset();
  }

  private generateInitialMockDataset() {
    const issues = [
      { title: 'Broken water pipeline near Ward 7 market', category: 'Water Supply', ward: '7' },
      { title: 'Street lights not working in Main Road area', category: 'Electricity', ward: '12' },
      { title: 'Garbage overflow in residential block B', category: 'Sanitation', ward: '3' },
      { title: 'Pothole causing accidents near school zone', category: 'Roads', ward: '5' },
      { title: 'Drainage blockage in Sector 4', category: 'Drainage', ward: '4' },
      { title: 'Fallen tree blocking public park entrance', category: 'Infrastructure', ward: '9' },
      { title: 'Unauthorized construction on sidewalk', category: 'Infrastructure', ward: '2' },
      { title: 'Contaminated water supply in Block C', category: 'Water Supply', ward: '11' },
    ];

    // Generate 15-25 live issues for a lively map
    const totalIssues = 20;
    const baseLat = 28.6139;
    const baseLng = 77.2090;

    for (let i = 0; i < totalIssues; i++) {
      const issueTemplate = issues[i % issues.length];
      const { department, eta } = this.getDepartmentAndETA(issueTemplate.category);
      const severity = Math.random() > 0.8 ? 'CRITICAL' : Math.random() > 0.5 ? 'HIGH' : 'MEDIUM';
      const status: ComplaintRecord['status'] = i < 5 ? 'Resolved' : i < 12 ? 'In Progress' : 'Assigned';
      
      // Randomize coords around Delhi for a lively map
      const lat = baseLat + (Math.random() - 0.5) * 0.05;
      const lng = baseLng + (Math.random() - 0.5) * 0.05;

      const complaint: ComplaintRecord = {
        id: `CMP-${(9000 + i).toString()}`,
        title: issueTemplate.title,
        description: `Citizens have reported ${issueTemplate.title.toLowerCase()}. Immediate attention required.`,
        location: { ward: issueTemplate.ward, coordinates: [lat, lng] },
        category: issueTemplate.category,
        severity: severity,
        sentiment: 'Concerned',
        status: status,
        department,
        eta,
        statusHistory: [
          { status: 'Received', timestamp: Date.now() - 86400000, updatedBy: 'System AI' }
        ],
        timestamp: Date.now() - (i * 3600000),
        riskScore: Math.round(Math.random() * 100)
      };

      if (status !== 'Received') {
        this.assignMockOfficerSync(complaint, department);
      }

      // Enrich with AI Analysis for the Future Impact Simulator
      complaint.aiAnalysis = analyzeComplaint(complaint.title, complaint.description, [], lat, lng);

      this.complaints.push(complaint);
    }
  }

  private assignMockOfficerSync(complaint: ComplaintRecord, department: string) {
    complaint.assignedOfficer = {
      name: ['Inspector Vikram Singh', 'Officer Priya Sharma', 'Eng. Raj Malhotra', 'Inspector Amit Kumar'][Math.floor(Math.random() * 4)],
      department: department,
      designation: 'Field Operations Specialist',
      employeeId: `NIV-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: '+91 XXXXX' + Math.floor(1000 + Math.random() * 9000),
      visitEta: '2-3 hours',
      currentActivity: 'Working',
      currentTask: 'Site investigation and material requisition',
      liveProgress: Math.floor(Math.random() * 80)
    };
  }

  private startSimulation() {
    setInterval(() => {
      if (this.complaints.length === 0) return;

      const randomIdx = Math.floor(Math.random() * this.complaints.length);
      const complaint = this.complaints[randomIdx];

      if (complaint.status === 'Resolved') return;

      const action = Math.random();
      if (action > 0.8) {
        // Increment Progress
        if (complaint.assignedOfficer) {
          complaint.assignedOfficer.liveProgress = Math.min(99, complaint.assignedOfficer.liveProgress + 5);
          if (complaint.assignedOfficer.liveProgress > 90 && Math.random() > 0.7) {
             this.updateStatus(complaint.id, 'Resolved', 'Field Officer');
          }
          this.notify();
        }
      } else if (action > 0.6) {
        // Update Activity
        if (complaint.assignedOfficer) {
          const activities: any[] = ['On route', 'Working', 'Delayed'];
          complaint.assignedOfficer.currentActivity = activities[Math.floor(Math.random() * activities.length)];
          this.notify();
        }
      }
    }, 8000); // Simulate event every 8 seconds
  }

  private addFromEvent(event: CivicEvent) {
    const category = event.intelligence.aiCategory;
    const { department, eta } = this.getDepartmentAndETA(category);

    const newComplaint: ComplaintRecord = {
      id: event.payload.id || `CMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      title: event.payload.title,
      description: event.payload.description,
      location: {
        ward: event.location.ward,
        coordinates: event.location.coordinates
      },
      category: category,
      severity: event.severity.toUpperCase(),
      sentiment: event.intelligence.urgency,
      status: 'Received',
      department,
      eta,
      statusHistory: [
        { status: 'Received', timestamp: event.timestamp, updatedBy: 'System AI' }
      ],
      timestamp: event.timestamp,
      riskScore: event.intelligence.riskScore,
      aiAnalysis: event.intelligence.fullAnalysis
    };

    // Prepend to feed
    this.complaints = [newComplaint, ...this.complaints];
    this.notify();

    // Auto-advance to 'Assigned' for demo purposes after 2 seconds
    setTimeout(() => {
      this.updateStatus(newComplaint.id, 'Assigned', 'AI Dispatcher');
      this.assignMockOfficer(newComplaint.id, department);
    }, 2000);
  }

  private assignMockOfficer(complaintId: string, department: string) {
    const index = this.complaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
      this.complaints[index].assignedOfficer = {
        name: 'Inspector Vikram Singh',
        department: department,
        designation: 'Senior Field Engineer',
        employeeId: 'NIV-OFF-9921',
        visitEta: '2-3 hours',
        currentActivity: 'On route'
      };
      this.notify();
    }
  }

  private getDepartmentAndETA(category: string): { department: string; eta: string } {
    const mapping: Record<string, { dept: string; eta: string }> = {
      'Infrastructure': { dept: 'Municipal Engineering Department', eta: '5-10 days' },
      'Water Supply': { dept: 'Water Supply Board', eta: '2-5 days' },
      'Electricity': { dept: 'Power Distribution Office', eta: '24-48 hours' },
      'Sanitation': { dept: 'Waste Management Department', eta: '12-24 hours' },
      'Roads': { dept: 'Public Works Department (PWD)', eta: '5-10 days' },
      'Drainage': { dept: 'Waste Management Department', eta: '24-48 hours' },
    };

    const info = mapping[category] || { dept: 'General Administration', eta: '3-5 days' };
    return { department: info.dept, eta: info.eta };
  }

  public updateStatus(id: string, status: ComplaintRecord['status'], updatedBy: string) {
    const index = this.complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      const complaint = this.complaints[index];
      complaint.status = status;
      complaint.statusHistory.push({ status, timestamp: Date.now(), updatedBy });
      
      // Emit event for real-time stream
      CivicStream.publishEvent('complaint_escalated', { id, status, updatedBy }, complaint.location.ward);
      
      this.notify();
    }
  }

  public getComplaints(): ComplaintRecord[] {
    return [...this.complaints];
  }

  public subscribe(callback: (complaints: ComplaintRecord[]) => void) {
    this.subscribers.add(callback);
    callback(this.getComplaints()); // Initial call
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    this.subscribers.forEach(cb => cb(this.getComplaints()));
  }

  /**
   * Manual push for components to trigger the flow
   */
  public async createComplaint(data: { title: string; description: string; ward: string; coords?: [number, number] }) {
    // This triggers the CivicStream -> LiveFeed flow
    return await CivicStream.publishEvent('complaint_created', data, data.ward, data.coords);
  }
}

export const LiveComplaintFeed = ComplaintFeedStore.getInstance();
