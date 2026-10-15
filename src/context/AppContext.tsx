import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  Workshop,
  Tender,
  TenderAward,
  CalendarEvent,
  Consortium,
  ConsortiumMember,
  TenderApplication,
  ContractSegment,
  ConsortiumTask,
  NotificationItem,
  SubscriptionPlan,
  Subscription,
  PaymentRecord,
  AuditLog,
  PlatformSettings,
  UserRole,
  VerificationStatus,
  ConsortiumStatus,
  PaymentStatus,
} from '../types';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
} from 'firebase/firestore';
import {
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_SUBSCRIPTION_PLANS,
  DEMO_WORKSHOPS,
  DEMO_TENDERS,
  DEMO_AWARDS,
  DEMO_CALENDAR_EVENTS,
  DEMO_CONSORTIUM,
  DEMO_CONSORTIUM_MEMBERS,
  DEMO_CONTRACT_SEGMENTS,
  DEMO_TASKS,
} from '../services/seedData';

import { Language, translations, Translations } from '../services/translations';

interface AppContextType {
  currentUser: UserProfile | null;
  fbUser: FirebaseUser | null;
  isLoading: boolean;
  activeRole: UserRole;
  currentWorkshop: Workshop | null;
  lang: Language;
  t: Translations;
  setLang: (l: Language) => void;
  
  // Collections
  workshops: Workshop[];
  tenders: Tender[];
  tenderAwards: TenderAward[];
  calendarEvents: CalendarEvent[];
  consortiums: Consortium[];
  consortiumMembers: ConsortiumMember[];
  tenderApplications: TenderApplication[];
  contractSegments: ContractSegment[];
  tasks: ConsortiumTask[];
  notifications: NotificationItem[];
  subscriptionPlans: SubscriptionPlan[];
  subscriptions: Subscription[];
  paymentRecords: PaymentRecord[];
  auditLogs: AuditLog[];
  platformSettings: PlatformSettings;

  // Actions
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchDemoPersona: (role: UserRole) => void;
  seedDatabase: () => Promise<void>;

  // Domain Actions
  registerWorkshop: (data: Partial<Workshop>) => Promise<Workshop>;
  updateWorkshop: (id: string, data: Partial<Workshop>) => Promise<void>;
  verifyWorkshop: (workshopId: string, status: VerificationStatus) => Promise<void>;
  
  createTender: (tenderData: Omit<Tender, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Tender>;
  updateTender: (id: string, tenderData: Partial<Tender>) => Promise<void>;
  createTenderAward: (awardData: Omit<TenderAward, 'id'>) => Promise<TenderAward>;
  
  submitExpressionOfInterest: (tenderId: string, details: { availableCapacity: number; notes: string; willingToLead: boolean }) => Promise<void>;
  createConsortium: (data: { tenderId: string; name: string; notes: string }) => Promise<Consortium>;
  inviteMemberToConsortium: (consortiumId: string, workshopId: string, declaredCapacity: number, allocatedQty: number, assignedSegment: string) => Promise<void>;
  respondToConsortiumInvite: (memberId: string, accept: boolean) => Promise<void>;
  updateConsortiumStatus: (consortiumId: string, status: ConsortiumStatus) => Promise<void>;
  allocateSegment: (segmentId: string, workshopId: string, workshopName: string) => Promise<void>;
  
  createTask: (consortiumId: string, title: string, assignedWorkshopId: string, assignedWorkshopName: string, dueDate: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: ConsortiumTask['status']) => Promise<void>;
  
  requestSubscriptionUpgrade: (planCode: 'basic' | 'premium', paymentMethod: string, transactionRef: string) => Promise<void>;
  verifySubscriptionPayment: (paymentId: string, status: PaymentStatus) => Promise<void>;
  
  markNotificationAsRead: (notificationId: string) => void;
  exportOperationalReportCSV: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('visitor');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Data states
  const [workshops, setWorkshops] = useState<Workshop[]>(DEMO_WORKSHOPS);
  const [tenders, setTenders] = useState<Tender[]>(DEMO_TENDERS);
  const [tenderAwards, setTenderAwards] = useState<TenderAward[]>(DEMO_AWARDS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(DEMO_CALENDAR_EVENTS);
  const [consortiums, setConsortiums] = useState<Consortium[]>([DEMO_CONSORTIUM]);
  const [consortiumMembers, setConsortiumMembers] = useState<ConsortiumMember[]>(DEMO_CONSORTIUM_MEMBERS);
  const [tenderApplications, setTenderApplications] = useState<TenderApplication[]>([]);
  const [contractSegments, setContractSegments] = useState<ContractSegment[]>(DEMO_CONTRACT_SEGMENTS);
  const [tasks, setTasks] = useState<ConsortiumTask[]>(DEMO_TASKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_01',
      userId: 'user_basic',
      title: 'Consortium Invitation Pending',
      message: 'National School Furniture Consortium invites your workshop to join the MoE 600-desk pool. Review quota and sign digital consent.',
      type: 'invitation',
      read: false,
      actionUrl: 'consortiums',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif_02',
      userId: 'user_all',
      title: 'Tender Closing Soon: Regional Health Bureau Couches',
      message: 'Public Health Bureau medical furniture tender closes in 5 days. Joint bidding permitted across all Ethiopian regions.',
      type: 'deadline',
      read: false,
      actionUrl: 'tenders',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'notif_03',
      userId: 'user_basic',
      title: 'Workshop Profile Verified',
      message: 'Administrator verified your nationwide workshop profile. Your verified craftsman badge is now live.',
      type: 'status_change',
      read: true,
      actionUrl: 'dashboard',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([
    {
      id: 'pay_demo_01',
      type: 'subscription',
      userId: 'user_premium',
      userEmail: 'mulugeta@hornprecision.et',
      workshopId: 'ws_premium_02',
      workshopName: 'Horn Precision Joinery & Furniture',
      amountETB: 3500,
      status: 'confirmed',
      paymentMethod: 'Telebirr',
      transactionReference: 'TLB-893201938',
      verifiedBy: 'samuelnugusu7@gmail.com',
      verifiedAt: '2026-03-01T10:00:00Z',
      createdAt: '2026-03-01T09:30:00Z',
      notes: 'Premium Tier active with first right of refusal.',
    },
    {
      id: 'pay_demo_02',
      type: 'subscription',
      userId: 'user_basic',
      userEmail: 'alemayehu@atlaswood.et',
      workshopId: 'ws_basic_01',
      workshopName: 'Atlas Structural Wood & Metal Works',
      amountETB: 1200,
      status: 'confirmed',
      paymentMethod: 'CBE Birr',
      transactionReference: 'CBE-TRX-2026-992',
      verifiedBy: 'samuelnugusu7@gmail.com',
      verifiedAt: '2026-03-05T14:00:00Z',
      createdAt: '2026-03-05T13:45:00Z',
      notes: 'Basic Member tier active.',
    },
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(INITIAL_PLATFORM_SETTINGS);

  // Active workshop resolution
  const currentWorkshop = currentUser?.workshopId
    ? workshops.find(w => w.id === currentUser.workshopId) || null
    : workshops.find(w => w.ownerId === currentUser?.id) || null;

  // Add audit log entry
  const logAudit = useCallback((action: string, targetEntity: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorId: currentUser?.id || 'system',
      actorEmail: currentUser?.email || 'anonymous',
      action,
      targetEntity,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Async persist to firestore auditLogs
    if (fbUser) {
      setDoc(doc(db, 'auditLogs', newLog.id), newLog).catch(err => {
        console.warn('Audit log write deferred:', err);
      });
    }
  }, [currentUser, fbUser]);

  // Load from Firestore
  const loadFirestoreData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch Tenders
      try {
        const tenderSnap = await getDocs(collection(db, 'tenders'));
        if (!tenderSnap.empty) {
          const list: Tender[] = [];
          tenderSnap.forEach(d => list.push(d.data() as Tender));
          setTenders(list);
        }
      } catch (e) {
        console.warn('Tenders load fallback to demo:', e);
      }

      // Fetch Workshops
      try {
        const wsSnap = await getDocs(collection(db, 'workshops'));
        if (!wsSnap.empty) {
          const list: Workshop[] = [];
          wsSnap.forEach(d => list.push(d.data() as Workshop));
          setWorkshops(list);
        }
      } catch (e) {
        console.warn('Workshops load fallback to demo:', e);
      }

      // Fetch Awards
      try {
        const awardSnap = await getDocs(collection(db, 'tenderAwards'));
        if (!awardSnap.empty) {
          const list: TenderAward[] = [];
          awardSnap.forEach(d => list.push(d.data() as TenderAward));
          setTenderAwards(list);
        }
      } catch (e) {
        console.warn('Awards load fallback to demo:', e);
      }

      // Fetch Consortia
      try {
        const consortSnap = await getDocs(collection(db, 'consortiums'));
        if (!consortSnap.empty) {
          const list: Consortium[] = [];
          consortSnap.forEach(d => list.push(d.data() as Consortium));
          setConsortiums(list);
        }
      } catch (e) {
        console.warn('Consortia load fallback to demo:', e);
      }

      // Fetch Consortium Members
      try {
        const cmSnap = await getDocs(collection(db, 'consortiumMembers'));
        if (!cmSnap.empty) {
          const list: ConsortiumMember[] = [];
          cmSnap.forEach(d => list.push(d.data() as ConsortiumMember));
          setConsortiumMembers(list);
        }
      } catch (e) {
        console.warn('Consortium members fallback:', e);
      }
    } catch (err) {
      console.warn('Firestore initial sync notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (user) {
        const isAdminEmail = user.email === 'samuelnugusu7@gmail.com';
        const role: UserRole = isAdminEmail ? 'admin' : 'basic';
        const profile: UserProfile = {
          id: user.uid,
          email: user.email || 'user@tenderlinkethiopia.com',
          displayName: user.displayName || user.email?.split('@')[0] || 'Workshop Owner',
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCurrentUser(profile);
        setActiveRole(role);
      } else {
        // Default to visitor
        setCurrentUser(null);
        setActiveRole('visitor');
      }
      loadFirestoreData();
    });

    return () => unsubscribe();
  }, [loadFirestoreData]);

  // Seed Firestore
  const seedDatabase = async () => {
    setIsLoading(true);
    try {
      // Seed Tenders
      for (const t of DEMO_TENDERS) {
        await setDoc(doc(db, 'tenders', t.id), t);
      }
      // Seed Workshops
      for (const w of DEMO_WORKSHOPS) {
        await setDoc(doc(db, 'workshops', w.id), w);
      }
      // Seed Awards
      for (const a of DEMO_AWARDS) {
        await setDoc(doc(db, 'tenderAwards', a.id), a);
      }
      // Seed Calendar
      for (const c of DEMO_CALENDAR_EVENTS) {
        await setDoc(doc(db, 'calendarEvents', c.id), c);
      }
      // Seed Consortium
      await setDoc(doc(db, 'consortiums', DEMO_CONSORTIUM.id), DEMO_CONSORTIUM);
      for (const m of DEMO_CONSORTIUM_MEMBERS) {
        await setDoc(doc(db, 'consortiumMembers', m.id), m);
      }
      for (const s of DEMO_CONTRACT_SEGMENTS) {
        await setDoc(doc(db, 'contractSegments', s.id), s);
      }
      for (const task of DEMO_TASKS) {
        await setDoc(doc(db, 'tasks', task.id), task);
      }
      for (const plan of INITIAL_SUBSCRIPTION_PLANS) {
        await setDoc(doc(db, 'subscriptionPlans', plan.id), plan);
      }
      await setDoc(doc(db, 'platformSettings', INITIAL_PLATFORM_SETTINGS.id), INITIAL_PLATFORM_SETTINGS);

      logAudit('SEED_DATABASE', 'all_collections', 'init', 'Loaded Ethiopian tender and consortium demonstration seed data.');
      await loadFirestoreData();
    } catch (err) {
      console.error('Seeding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login error:', err);
      // Fallback to demo admin if popup blocked
      switchDemoPersona('admin');
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Logout notice:', err);
    }
    setCurrentUser(null);
    setActiveRole('visitor');
  };

  // Demo Persona Switcher (For testing Visitor, Basic, Premium, Admin)
  const switchDemoPersona = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'visitor') {
      setCurrentUser(null);
    } else if (role === 'basic') {
      setCurrentUser({
        id: 'user_basic',
        email: 'alemayehu@atlaswood.et',
        displayName: 'Alemayehu Tadesse (Atlas Wood & Metal Works)',
        role: 'basic',
        workshopId: 'ws_basic_01',
        createdAt: '2026-01-10T08:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z',
      });
    } else if (role === 'premium') {
      setCurrentUser({
        id: 'user_premium',
        email: 'mulugeta@hornprecision.et',
        displayName: 'Mulugeta Bekele (Horn Precision Joinery)',
        role: 'premium',
        workshopId: 'ws_premium_02',
        createdAt: '2026-01-15T09:30:00Z',
        updatedAt: '2026-03-05T14:00:00Z',
      });
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin_samuel',
        email: 'samuelnugusu7@gmail.com',
        displayName: 'Platform Administrator (Samuel Nugusu)',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-03-01T00:00:00Z',
      });
    }
  };

  // Register Workshop
  const registerWorkshop = async (data: Partial<Workshop>): Promise<Workshop> => {
    const newId = `ws_${Date.now()}`;
    const newWorkshop: Workshop = {
      id: newId,
      ownerId: currentUser?.id || `user_${Date.now()}`,
      ownerName: data.ownerName || currentUser?.displayName || 'Workshop Owner',
      businessName: data.businessName || 'New Furniture Workshop',
      phone: data.phone || '+251 911 000 000',
      email: data.email || currentUser?.email || 'workshop@tenderlinkethiopia.com',
      city: data.city || 'Oromia / Addis Ababa / Regional Hub',
      area: data.area || 'Industrial Fabrication Zone',
      address: data.address || 'Workshop location',
      workshopType: data.workshopType || 'General Woodworking',
      specialties: data.specialties || ['School Desks'],
      machinery: data.machinery || ['Table Saw'],
      monthlyCapacityUnits: data.monthlyCapacityUnits || 50,
      workerCount: data.workerCount || 5,
      yearsOfExperience: data.yearsOfExperience || 3,
      pastProjectsSummary: data.pastProjectsSummary || '',
      verificationStatus: 'pending_review',
      availabilityStatus: data.availabilityStatus || 'available',
      preferredContractSize: data.preferredContractSize || '1,000,000 - 3,000,000 ETB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkshops(prev => [newWorkshop, ...prev]);
    if (currentUser) {
      setCurrentUser({ ...currentUser, workshopId: newId });
    }

    try {
      await setDoc(doc(db, 'workshops', newId), newWorkshop);
      logAudit('REGISTER_WORKSHOP', 'workshops', newId, `Registered workshop profile: ${newWorkshop.businessName}`);
    } catch (err) {
      console.warn('Persist workshop deferred:', err);
    }
    return newWorkshop;
  };

  // Update Workshop
  const updateWorkshop = async (id: string, data: Partial<Workshop>) => {
    setWorkshops(prev => prev.map(w => (w.id === id ? { ...w, ...data, updatedAt: new Date().toISOString() } : w)));
    try {
      await updateDoc(doc(db, 'workshops', id), { ...data, updatedAt: new Date().toISOString() });
      logAudit('UPDATE_WORKSHOP', 'workshops', id, `Updated workshop details for ID: ${id}`);
    } catch (err) {
      console.warn('Update workshop deferred:', err);
    }
  };

  // Verify Workshop (Admin only)
  const verifyWorkshop = async (workshopId: string, status: VerificationStatus) => {
    setWorkshops(prev => prev.map(w => (w.id === workshopId ? { ...w, verificationStatus: status, updatedAt: new Date().toISOString() } : w)));
    try {
      await updateDoc(doc(db, 'workshops', workshopId), { verificationStatus: status, updatedAt: new Date().toISOString() });
      logAudit('VERIFY_WORKSHOP', 'workshops', workshopId, `Administrator changed verification status to: ${status}`);
    } catch (err) {
      console.warn('Verification status write deferred:', err);
    }
  };

  // Create Tender (Admin)
  const createTender = async (tenderData: Omit<Tender, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tender> => {
    const newId = `tender_${Date.now()}`;
    const newTender: Tender = {
      ...tenderData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTenders(prev => [newTender, ...prev]);
    try {
      await setDoc(doc(db, 'tenders', newId), newTender);
      logAudit('CREATE_TENDER', 'tenders', newId, `Admin created tender: ${newTender.title}`);
    } catch (err) {
      console.warn('Tender create write deferred:', err);
    }
    return newTender;
  };

  // Update Tender
  const updateTender = async (id: string, tenderData: Partial<Tender>) => {
    setTenders(prev => prev.map(t => (t.id === id ? { ...t, ...tenderData, updatedAt: new Date().toISOString() } : t)));
    try {
      await updateDoc(doc(db, 'tenders', id), { ...tenderData, updatedAt: new Date().toISOString() });
      logAudit('UPDATE_TENDER', 'tenders', id, `Updated tender details for: ${id}`);
    } catch (err) {
      console.warn('Tender update deferred:', err);
    }
  };

  // Create Tender Award
  const createTenderAward = async (awardData: Omit<TenderAward, 'id'>): Promise<TenderAward> => {
    const newId = `award_${Date.now()}`;
    const newAward: TenderAward = {
      ...awardData,
      id: newId,
    };
    setTenderAwards(prev => [newAward, ...prev]);
    try {
      await setDoc(doc(db, 'tenderAwards', newId), newAward);
      logAudit('RECORD_AWARD', 'tenderAwards', newId, `Recorded verified historical tender award for ${newAward.tenderTitle}`);
    } catch (err) {
      console.warn('Award persist deferred:', err);
    }
    return newAward;
  };

  // Submit Expression of Interest
  const submitExpressionOfInterest = async (
    tenderId: string,
    details: { availableCapacity: number; notes: string; willingToLead: boolean }
  ) => {
    const ws = currentWorkshop || DEMO_WORKSHOPS[0];
    const newApp: TenderApplication = {
      id: `app_${Date.now()}`,
      tenderId,
      tenderTitle: tenders.find(t => t.id === tenderId)?.title,
      workshopId: ws.id,
      workshopName: ws.businessName,
      userId: currentUser?.id || 'anon_user',
      availableCapacity: details.availableCapacity,
      specialtiesOffered: ws.specialties,
      willingToLead: details.willingToLead,
      status: 'pending',
      notes: details.notes,
      createdAt: new Date().toISOString(),
    };
    setTenderApplications(prev => [newApp, ...prev]);
    logAudit('SUBMIT_EOI', 'tenderApplications', newApp.id, `${ws.businessName} expressed interest for tender: ${newApp.tenderTitle}`);
  };

  // Create Consortium
  const createConsortium = async (data: { tenderId: string; name: string; notes: string }): Promise<Consortium> => {
    const ws = currentWorkshop || DEMO_WORKSHOPS[0];
    const tender = tenders.find(t => t.id === data.tenderId);
    const newId = `consortium_${Date.now()}`;
    const newConsortium: Consortium = {
      id: newId,
      name: data.name,
      reference: `CONSORT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      tenderId: data.tenderId,
      tenderTitle: tender?.title,
      organizerId: currentUser?.id || 'organizer',
      organizerWorkshopId: ws.id,
      organizerName: `${ws.businessName} (${ws.ownerName})`,
      status: 'recruiting',
      requiredTotalCapacity: tender?.requiredQuantity || 100,
      committedTotalCapacity: ws.monthlyCapacityUnits,
      notes: data.notes,
      totalContractValueETB: tender?.estimatedBudgetETB || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const leadMember: ConsortiumMember = {
      id: `cm_${Date.now()}`,
      consortiumId: newId,
      workshopId: ws.id,
      workshopName: ws.businessName,
      userId: currentUser?.id || 'lead_user',
      roleInConsortium: 'lead',
      status: 'approved',
      declaredCapacity: ws.monthlyCapacityUnits,
      allocatedQuantity: Math.min(ws.monthlyCapacityUnits, newConsortium.requiredTotalCapacity),
      allocatedAmountETB: Math.round((newConsortium.totalContractValueETB || 0) * 0.4),
      consentGiven: true,
      consentDate: new Date().toISOString(),
      notes: 'Consortium Lead Workshop Organizer',
    };

    setConsortiums(prev => [newConsortium, ...prev]);
    setConsortiumMembers(prev => [leadMember, ...prev]);

    try {
      await setDoc(doc(db, 'consortiums', newId), newConsortium);
      await setDoc(doc(db, 'consortiumMembers', leadMember.id), leadMember);
      logAudit('CREATE_CONSORTIUM', 'consortiums', newId, `Created joint bidding consortium: ${newConsortium.name}`);
    } catch (err) {
      console.warn('Consortium persist write deferred:', err);
    }
    return newConsortium;
  };

  // Invite Member to Consortium
  const inviteMemberToConsortium = async (
    consortiumId: string,
    workshopId: string,
    declaredCapacity: number,
    allocatedQty: number,
    assignedSegment: string
  ) => {
    const ws = workshops.find(w => w.id === workshopId);
    if (!ws) return;

    const newMemberId = `cm_${Date.now()}`;
    const newMember: ConsortiumMember = {
      id: newMemberId,
      consortiumId,
      workshopId,
      workshopName: ws.businessName,
      userId: ws.ownerId,
      userEmail: ws.email,
      roleInConsortium: 'member',
      status: 'invited',
      declaredCapacity,
      allocatedQuantity: allocatedQty,
      allocatedAmountETB: allocatedQty * 8500,
      assignedSegment,
      consentGiven: false,
      notes: 'Invitation issued under platform consortium matching protocol.',
    };

    setConsortiumMembers(prev => [newMember, ...prev]);
    logAudit('INVITE_MEMBER', 'consortiumMembers', newMemberId, `Invited ${ws.businessName} to consortium ${consortiumId}`);
  };

  // Respond to Consortium Invite
  const respondToConsortiumInvite = async (memberId: string, accept: boolean) => {
    setConsortiumMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            status: accept ? 'accepted' : 'declined',
            consentGiven: accept,
            consentDate: accept ? new Date().toISOString() : undefined,
          };
        }
        return m;
      })
    );
    logAudit('CONSORTIUM_RESPONSE', 'consortiumMembers', memberId, `Workshop ${accept ? 'ACCEPTED' : 'DECLINED'} consortium membership.`);
  };

  // Update Consortium Status
  const updateConsortiumStatus = async (consortiumId: string, status: ConsortiumStatus) => {
    setConsortiums(prev => prev.map(c => (c.id === consortiumId ? { ...c, status, updatedAt: new Date().toISOString() } : c)));
    logAudit('UPDATE_CONSORTIUM_STATUS', 'consortiums', consortiumId, `Consortium status transitioned to: ${status}`);
  };

  // Allocate Contract Segment
  const allocateSegment = async (segmentId: string, workshopId: string, workshopName: string) => {
    setContractSegments(prev =>
      prev.map(s => (s.id === segmentId ? { ...s, allocatedWorkshopId: workshopId, allocatedWorkshopName: workshopName, status: 'allocated' } : s))
    );
    logAudit('ALLOCATE_SEGMENT', 'contractSegments', segmentId, `Allocated contract segment to ${workshopName}`);
  };

  // Tasks
  const createTask = async (consortiumId: string, title: string, assignedWorkshopId: string, assignedWorkshopName: string, dueDate: string) => {
    const newTask: ConsortiumTask = {
      id: `task_${Date.now()}`,
      consortiumId,
      title,
      assignedWorkshopId,
      assignedWorkshopName,
      dueDate,
      status: 'todo',
    };
    setTasks(prev => [newTask, ...prev]);
    logAudit('CREATE_TASK', 'tasks', newTask.id, `Created task: "${title}" assigned to ${assignedWorkshopName}`);
  };

  const updateTaskStatus = async (taskId: string, status: ConsortiumTask['status']) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status } : t)));
  };

  // Subscription Upgrade
  const requestSubscriptionUpgrade = async (planCode: 'basic' | 'premium', paymentMethod: string, transactionRef: string) => {
    const amount = planCode === 'basic' ? 1200 : 3500;
    const newPaymentId = `pay_${Date.now()}`;
    const newPayment: PaymentRecord = {
      id: newPaymentId,
      type: 'subscription',
      userId: currentUser?.id || 'user',
      userEmail: currentUser?.email,
      workshopId: currentWorkshop?.id,
      workshopName: currentWorkshop?.businessName,
      amountETB: amount,
      status: 'pending',
      paymentMethod,
      transactionReference: transactionRef,
      createdAt: new Date().toISOString(),
      notes: `Subscription payment verification pending for ${planCode.toUpperCase()} tier.`,
    };

    setPaymentRecords(prev => [newPayment, ...prev]);
    logAudit('SUBSCRIPTION_REQUEST', 'paymentRecords', newPaymentId, `User submitted ${amount} ETB upgrade request via ${paymentMethod} (Ref: ${transactionRef})`);
  };

  // Verify Subscription Payment (Admin)
  const verifySubscriptionPayment = async (paymentId: string, status: PaymentStatus) => {
    setPaymentRecords(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          return {
            ...p,
            status,
            verifiedBy: currentUser?.email || 'admin',
            verifiedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    if (status === 'confirmed') {
      const p = paymentRecords.find(item => item.id === paymentId);
      if (p && currentUser && p.userId === currentUser.id) {
        // Upgrade current user
        setActiveRole('premium');
        setCurrentUser(prev => prev ? { ...prev, role: 'premium' } : null);
      }
    }

    logAudit('VERIFY_PAYMENT', 'paymentRecords', paymentId, `Administrator verified payment status: ${status}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  // Export CSV
  const exportOperationalReportCSV = () => {
    const rows = [
      ['Report Type', 'TenderLink Ethiopia Operational Audit & Performance Report'],
      ['Generated Date', new Date().toISOString()],
      ['Total Workshops Registered', workshops.length.toString()],
      ['Verified Workshops', workshops.filter(w => w.verificationStatus === 'verified').length.toString()],
      ['Published Tenders', tenders.filter(t => t.status === 'published' || t.status === 'closing_soon').length.toString()],
      ['Active Consortia', consortiums.length.toString()],
      ['Total Recorded Award Value (ETB)', tenderAwards.reduce((acc, a) => acc + (a.awardAmountETB || 0), 0).toString()],
      [],
      ['Tender Reference', 'Title', 'Buyer', 'Category', 'Required Qty', 'Deadline', 'Status'],
      ...tenders.map(t => [t.referenceNumber, t.title, t.issuingOrganization, t.productCategory, t.requiredQuantity.toString(), t.submissionDeadline, t.status]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tenderlink_ethiopia_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAudit('EXPORT_REPORT', 'system', 'csv', 'Administrator exported operational platform CSV report.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        fbUser,
        isLoading,
        activeRole,
        currentWorkshop,
        lang,
        t,
        setLang,
        workshops,
        tenders,
        tenderAwards,
        calendarEvents,
        consortiums,
        consortiumMembers,
        tenderApplications,
        contractSegments,
        tasks,
        notifications,
        subscriptionPlans,
        subscriptions,
        paymentRecords,
        auditLogs,
        platformSettings,
        loginWithGoogle,
        logout,
        switchDemoPersona,
        seedDatabase,
        registerWorkshop,
        updateWorkshop,
        verifyWorkshop,
        createTender,
        updateTender,
        createTenderAward,
        submitExpressionOfInterest,
        createConsortium,
        inviteMemberToConsortium,
        respondToConsortiumInvite,
        updateConsortiumStatus,
        allocateSegment,
        createTask,
        updateTaskStatus,
        requestSubscriptionUpgrade,
        verifySubscriptionPayment,
        markNotificationAsRead,
        exportOperationalReportCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
