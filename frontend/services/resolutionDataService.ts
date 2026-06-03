/**
 * Resolution Data Service
 * 
 * Manages the "Resolution Wall" data, providing visual proof of civic improvements.
 */

export interface ResolutionEntry {
  id: string;
  title: string;
  description: string;
  beforeImages: string[];
  afterImages: string[];
  beforeCaption: string;
  afterCaption: string;
  resolutionDescription: string;
  resolvedDate: string;
  departmentResponsible: string;
  isVerified: boolean;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    helpfulVotes: number;
  };
}

class ResolutionService {
  private static instance: ResolutionService;
  private entries: ResolutionEntry[] = [];
  private subscribers: Set<(entries: ResolutionEntry[]) => void> = new Set();

  private constructor() {
    this.init();
  }

  public static getInstance(): ResolutionService {
    if (!ResolutionService.instance) {
      ResolutionService.instance = new ResolutionService();
    }
    return ResolutionService.instance;
  }

  private init() {
    // Initial mock data for Resolution Wall
    this.entries = [
      {
        id: 'RES-101',
        title: 'Sector 4 Sanitation Cleanup',
        description: 'Complete removal of residential waste buildup and street sanitization.',
        beforeImages: ['/assets/resolutions/garbage_before_nivaran_1777630636541.png'],
        afterImages: ['/assets/resolutions/garbage_after_nivaran_1777630651015.png'],
        beforeCaption: 'Blocked drainage with garbage and silt',
        afterCaption: 'Cleaned and restored drainage flow',
        resolutionDescription: 'The department conducted a 3-day cleanup operation followed by structural reinforcement of the canal walls.',
        resolvedDate: '2026-04-20',
        departmentResponsible: 'Waste Management Department',
        isVerified: true,
        engagement: { likes: 142, comments: 24, shares: 56, helpfulVotes: 89 }
      },
      {
        id: 'RES-102',
        title: 'MG Road Pothole Fixed',
        description: 'Deep repair of multiple hazardous potholes near the central junction.',
        beforeImages: ['/assets/resolutions/pothole_before_nivaran_1777630606617.png'],
        afterImages: ['/assets/resolutions/pothole_after_nivaran_1777630621398.png'],
        beforeCaption: 'Hazardous potholes causing traffic slowdowns',
        afterCaption: 'Smooth asphalt resurfacing completed',
        resolutionDescription: 'Contracted PWD team used hot-mix asphalt for a permanent fix of the road surface.',
        resolvedDate: '2026-04-25',
        departmentResponsible: 'Public Works Department (PWD)',
        isVerified: true,
        engagement: { likes: 320, comments: 45, shares: 88, helpfulVotes: 210 }
      }
    ];
  }

  public getEntries(): ResolutionEntry[] {
    return [...this.entries];
  }

  public subscribe(callback: (entries: ResolutionEntry[]) => void) {
    this.subscribers.add(callback);
    callback(this.getEntries());
    return () => this.subscribers.delete(callback);
  }

  public voteHelpful(id: string) {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      entry.engagement.helpfulVotes += 1;
      this.notify();
    }
  }

  public likeEntry(id: string) {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      entry.engagement.likes += 1;
      this.notify();
    }
  }

  private notify() {
    this.subscribers.forEach(cb => cb(this.getEntries()));
  }
}

export const ResolutionDataService = ResolutionService.getInstance();
