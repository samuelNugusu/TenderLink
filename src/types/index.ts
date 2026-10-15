export type UserRole = 'visitor' | 'basic' | 'premium' | 'admin';

export type VerificationStatus = 'unverified' | 'pending_review' | 'verified' | 'rejected' | 'suspended';

export type AvailabilityStatus = 'available' | 'partially_available' | 'busy';

export type TenderStatus = 'draft' | 'published' | 'closing_soon' | 'closed' | 'awarded' | 'cancelled' | 'under_verification';

export type ConsortiumStatus = 
  | 'draft' 
  | 'recruiting' 
  | 'awaiting_acceptance' 
  | 'ready_for_review' 
  | 'approved_for_submission' 
  | 'submitted' 
  | 'awarded' 
  | 'not_awarded' 
  | 'cancelled' 
  | 'in_execution';

export type MemberStatus = 'invited' | 'accepted' | 'declined' | 'withdrawn' | 'approved';

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export type AwardVerificationStatus = 'verified' | 'unverified' | 'disputed';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  workshopId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workshop {
  id: string;
  ownerId: string;
  ownerName: string;
  businessName: string;
  phone: string;
  email: string;
  city: string; // e.g. Addis Ababa
  area: string; // e.g. Masalemiya, Merkato, Kality, Bole
  address: string;
  workshopType: string; // e.g. Solid Wood, Metal & Wood Hybrid, Upholstery, School Furniture
  specialties: string[];
  machinery: string[];
  monthlyCapacityUnits: number; // e.g. 150 desks/month
  workerCount: number;
  yearsOfExperience: number;
  pastProjectsSummary: string;
  verificationStatus: VerificationStatus;
  availabilityStatus: AvailabilityStatus;
  preferredContractSize: string;
  documents?: {
    licenseDocUrl?: string;
    taxIdDocUrl?: string;
    sampleCatalogUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  issuingOrganization: string;
  buyerContact?: string;
  productCategory: string; // e.g. "School Furniture", "Office Desks", "Hospital Beds & Cabinets"
  destinationCity: string;
  destinationRegion: string;
  publishedDate: string;
  submissionDeadline: string;
  estimatedBudgetETB?: number;
  requiredQuantity: number;
  unitType: string; // e.g. "student desks", "executive chairs", "filing cabinets"
  itemDescription: string;
  technicalSpecs: string;
  qualificationsRequired: string;
  deliveryScheduleWeeks: number;
  submissionMethod: string;
  sourceUrl?: string;
  status: TenderStatus;
  isVerified: boolean;
  isJointBiddingPermitted: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenderAward {
  id: string;
  tenderReference: string;
  tenderTitle: string;
  buyerOrganization: string;
  awardedSupplier: string;
  awardDate: string;
  awardAmountETB: number;
  productCategory: string;
  quantityAwarded: number;
  officialSource: string;
  verificationStatus: AwardVerificationStatus;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'tender_deadline' | 'consortium_deadline' | 'delivery_milestone' | 'document_deadline';
  relatedTenderId?: string;
  relatedConsortiumId?: string;
  description: string;
}

export interface Consortium {
  id: string;
  name: string;
  reference: string;
  tenderId: string;
  tenderTitle?: string;
  organizerId: string;
  organizerWorkshopId: string;
  organizerName?: string;
  status: ConsortiumStatus;
  requiredTotalCapacity: number;
  committedTotalCapacity: number;
  notes?: string;
  bidSubmissionDate?: string;
  awardDate?: string;
  totalContractValueETB?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsortiumMember {
  id: string;
  consortiumId: string;
  workshopId: string;
  workshopName: string;
  userId: string;
  userEmail?: string;
  roleInConsortium: 'lead' | 'member' | 'support';
  status: MemberStatus;
  declaredCapacity: number;
  assignedSegment?: string;
  allocatedQuantity: number;
  allocatedAmountETB: number;
  consentGiven: boolean;
  consentDate?: string;
  notes?: string;
}

export interface TenderApplication {
  id: string;
  tenderId: string;
  tenderTitle?: string;
  workshopId: string;
  workshopName?: string;
  userId: string;
  availableCapacity: number;
  specialtiesOffered: string[];
  willingToLead: boolean;
  status: 'pending' | 'reviewed' | 'invited_to_consortium' | 'declined';
  notes?: string;
  createdAt: string;
}

export interface ContractSegment {
  id: string;
  consortiumId: string;
  title: string;
  productType: string;
  quantity: number;
  unitPriceETB: number;
  totalValueETB: number;
  allocatedWorkshopId?: string;
  allocatedWorkshopName?: string;
  status: 'unallocated' | 'offered_first_refusal' | 'allocated' | 'in_production' | 'completed';
  deliveryDeadline: string;
  notes?: string;
}

export interface ConsortiumTask {
  id: string;
  consortiumId: string;
  title: string;
  assignedWorkshopId?: string;
  assignedWorkshopName?: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'completed' | 'delayed';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'tender_match' | 'invitation' | 'status_change' | 'payment' | 'deadline';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  planCode: 'free' | 'basic' | 'premium';
  name: string;
  priceETB: number;
  billingPeriod: 'free' | 'monthly' | 'annual';
  tagline: string;
  features: string[];
  isActive: boolean;
  badge?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  workshopId?: string;
  planCode: 'free' | 'basic' | 'premium';
  status: 'active' | 'pending_payment_verification' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  amountPaidETB: number;
  paymentReference?: string;
  verifiedByAdmin: boolean;
}

export interface PaymentRecord {
  id: string;
  type: 'subscription' | 'contract_milestone';
  userId: string;
  userEmail?: string;
  workshopId?: string;
  workshopName?: string;
  consortiumId?: string;
  amountETB: number;
  status: PaymentStatus;
  paymentMethod: string; // e.g. "Telebirr", "CBE Birr", "Awash Bank Transfer", "Manual Verification"
  transactionReference: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  id: string;
  platformName: string;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  pilotRegions: string[];
  disclaimerNotice: string;
}
