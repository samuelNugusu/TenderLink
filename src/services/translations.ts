export type Language = 'en' | 'am';

export interface Translations {
  appName: string;
  tagline: string;
  pilotNotice: string;
  navTenders: string;
  navConsortiums: string;
  navAwards: string;
  navCalendar: string;
  navPricing: string;
  navDashboard: string;
  navAdmin: string;
  registerWorkshop: string;
  signIn: string;
  signOut: string;
  simulatorTitle: string;
  simulatorButton: string;
  heroHeading: string;
  heroSubheading: string;
  exploreTenders: string;
  activeWorkshops: string;
  monthlyCapacity: string;
  openTenders: string;
  disclosedAwards: string;
  searchPlaceholder: string;
  allCategories: string;
  requiredQuantity: string;
  deadline: string;
  budget: string;
  formConsortium: string;
  expressInterest: string;
  consortiumWorkspace: string;
  membersCount: string;
  capacityCovered: string;
  cpoBondCalculator: string;
  consentSigned: string;
  awaitingConsent: string;
  units: string;
  etb: string;
  heroTabSimulator: string;
  heroTabEligibility: string;
  heroTabConsortia: string;
  heroPresetMoE: string;
  heroPresetCBE: string;
  heroPresetHealth: string;
  heroPresetCustom: string;
  splitBondAdvantage: string;
  testEligibilityNow: string;
  openPartnershipSlots: string;
  claimPartnerSlot: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'TenderLink Ethiopia',
    tagline: 'Nationwide Furniture Workshop Consortium & Institutional Tender Platform',
    pilotNotice: 'NATIONWIDE PLATFORM: Uniting Furniture Workshops & Craftsmen Across All Regions of Ethiopia',
    navTenders: 'Tenders',
    navConsortiums: 'Consortiums',
    navAwards: 'Past Awards',
    navCalendar: 'Calendar',
    navPricing: 'Pricing',
    navDashboard: 'Workshop Workspace',
    navAdmin: 'Admin Console',
    registerWorkshop: 'Register Workshop',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    simulatorTitle: 'Joint Bidding & Capacity Simulator',
    simulatorButton: 'Bidding Simulator',
    heroHeading: 'Unite Ethiopian Furniture Workshops. Fulfill Master Contracts Nationwide.',
    heroSubheading: 'TenderLink Ethiopia empowers small, medium, and industrial furniture workshops across all regions of Ethiopia to pool production capacity, satisfy large public and commercial tenders, and share bank CPO bid bonds transparently.',
    exploreTenders: 'Explore Active Tenders',
    activeWorkshops: 'Verified Workshops',
    monthlyCapacity: 'Pooled Monthly Capacity',
    openTenders: 'Open Tender Listings',
    disclosedAwards: 'Historical Contract Value',
    searchPlaceholder: 'Search by tender title, reference, buyer, or items...',
    allCategories: 'All Product Categories',
    requiredQuantity: 'Required Quantity',
    deadline: 'Submission Deadline',
    budget: 'Estimated Budget',
    formConsortium: 'Form Consortium',
    expressInterest: 'Express Interest to Bid',
    consortiumWorkspace: 'Consortium Workspace',
    membersCount: 'Participating Workshops',
    capacityCovered: 'Committed Capacity',
    cpoBondCalculator: 'CPO Bid Bond & Materials Estimator',
    consentSigned: 'Consent Confirmed',
    awaitingConsent: 'Awaiting Consent',
    units: 'Units',
    etb: 'ETB',
    heroTabSimulator: 'Live Capacity & CPO Splitter',
    heroTabEligibility: 'Instant Tender Matcher',
    heroTabConsortia: 'Open Consortia Seeking Partners',
    heroPresetMoE: 'MoE 600 Double Desks',
    heroPresetCBE: 'CBE 120 Teller Counters',
    heroPresetHealth: 'Clinic 250 Examination Beds',
    heroPresetCustom: 'Custom Tender Target',
    splitBondAdvantage: 'Shared CPO bond lowers individual risk by up to 66%',
    testEligibilityNow: 'Check My Workshop Qualification',
    openPartnershipSlots: 'Active Consortia Forming Across Ethiopia',
    claimPartnerSlot: 'Claim Partnership Slot',
  },
  am: {
    appName: 'ቴንደርሊንክ ኢትዮጵያ',
    tagline: 'የእንጨትና ብረታብረት አውደ-ጥናቶች አገር አቀፍ የጋራ ጨረታ መድረክ',
    pilotNotice: 'አገር-አቀፍ መድረክ: በመላው ኢትዮጵያ የሚገኙ የእንጨትና ብረት አውደ-ጥናቶች ጥምረት',
    navTenders: 'ጨረታዎች',
    navConsortiums: 'የጋራ ማህበራት',
    navAwards: 'ያለፉ አሸናፊዎች',
    navCalendar: 'የቀን መቁጠሪያ',
    navPricing: 'የአባልነት ዋጋ',
    navDashboard: 'የአውደ-ጥናት ቢሮ',
    navAdmin: 'አስተዳዳሪ',
    registerWorkshop: 'አውደ-ጥናት መዝግብ',
    signIn: 'ግባ',
    signOut: 'ውጣ',
    simulatorTitle: 'የአቅም ማሰባሰቢያ እና ሲፒኦ ማስያዣ አስሊ',
    simulatorButton: 'የጨረታ አስሊ',
    heroHeading: 'የኢትዮጵያ የእንጨትና ብረት አውደ-ጥናቶችን በማስተባበር ተቋማዊ ጨረታዎችን ያሸንፉ',
    heroSubheading: 'ቴንደርሊንክ ኢትዮጵያ በመላው አገሪቱ የሚገኙ አነስተኛና መካከለኛ የእንጨት፣ የብረትና የቤት ዕቃዎች አውደ-ጥናቶችን በማስተባበር የማምረት አቅማቸውን አጣምረው የመንግስትና የባንክ ጨረታዎችን እንዲያሟሉ ያስችላል።',
    exploreTenders: 'ንቁ ጨረታዎችን ይመልከቱ',
    activeWorkshops: 'የተረጋገጡ አውደ-ጥናቶች',
    monthlyCapacity: 'ወርሃዊ የማምረት አቅም',
    openTenders: 'ክፍት ጨረታዎች',
    disclosedAwards: 'የተመዘገበ የውል ዋጋ',
    searchPlaceholder: 'በጨረታ ርዕስ፣ መለያ ቁጥር ወይም በገዢ ተቋም ይፈልጉ...',
    allCategories: 'ሁሉም የዕቃ ዓይነቶች',
    requiredQuantity: 'የተጠየቀው ብዛት',
    deadline: 'የማስረከቢያ የመጨረሻ ቀን',
    budget: 'የተገመተ በጀት',
    formConsortium: 'የጋራ ማህበር መስርት',
    expressInterest: 'ፍላጎትህን ግለጽ',
    consortiumWorkspace: 'የጋራ የስራ ቦታ',
    membersCount: 'ተሳታፊ አውደ-ጥናቶች',
    capacityCovered: 'የተሸፈነ የማምረት አቅም',
    cpoBondCalculator: 'የሲፒኦ (CPO) ማስያዣ እና ጥሬ ዕቃ አስሊ',
    consentSigned: 'ስምምነት ተፈርሟል',
    awaitingConsent: 'ስምምነት በመጠባበቅ ላይ',
    units: 'ፍሬ',
    etb: 'ብር',
    heroTabSimulator: 'የጋራ አቅም እና ሲፒኦ ክፍፍል አስሊ',
    heroTabEligibility: 'ፈጣን የብቃት መመዘኛ',
    heroTabConsortia: 'አጋር የሚፈልጉ ክፍት ማህበራት',
    heroPresetMoE: 'ትምህርት ሚኒስቴር 600 ዴስኮች',
    heroPresetCBE: 'ንግድ ባንክ 120 የቴለር ካውንተሮች',
    heroPresetHealth: 'ክሊኒክ 250 የመመርመሪያ አልጋዎች',
    heroPresetCustom: 'የራስዎ ብዛትና ዋጋ',
    splitBondAdvantage: 'የጋራ ሲፒኦ ማስያዣ የግል ጫናን እስከ 66% ይቀንሳል',
    testEligibilityNow: 'የአውደ-ጥናትህን ብቃት አረጋግጥ',
    openPartnershipSlots: 'በመላው ኢትዮጵያ በመመስረት ላይ ያሉ ማህበራት',
    claimPartnerSlot: 'የአጋርነት ቦታህን ያዝ',
  },
};
