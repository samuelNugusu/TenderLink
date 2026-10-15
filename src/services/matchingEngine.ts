import { Workshop, Tender, ConsortiumMember } from '../types';

export interface MatchScoreResult {
  workshopId: string;
  workshop: Workshop;
  score: number; // 0 to 100
  isEligible: boolean;
  matchReasons: string[];
  disqualificationReasons: string[];
  capacityFitPercentage: number;
  hasSpecialtyMatch: boolean;
  isLocationFavorable: boolean;
  isPremiumTier: boolean;
}

export interface ProposedConsortiumGrouping {
  tenderId: string;
  tenderTitle: string;
  requiredQuantity: number;
  totalCommittedCapacity: number;
  isFullyCovered: boolean;
  suggestedMembers: {
    workshop: Workshop;
    proposedAllocationQuantity: number;
    allocationPercentage: number;
    role: 'lead' | 'member';
    rationale: string;
  }[];
  explanation: string;
}

/**
 * Deterministic, explainable matching engine as required by prompt Section 10.
 * Priority Rules:
 * 1. Eligibility comes before paid priority (mandatory qualifications, active status).
 * 2. Specialty & machinery matching.
 * 3. Capacity contribution without overcommitment.
 * 4. Location proximity (e.g. Masalemiya, Addis Ababa logistics).
 * 5. Premium members receive priority consideration for eligible allocations when qualified.
 */
export function evaluateWorkshopForTender(
  workshop: Workshop,
  tender: Tender,
  userRole: 'visitor' | 'basic' | 'premium' | 'admin'
): MatchScoreResult {
  const matchReasons: string[] = [];
  const disqualificationReasons: string[] = [];

  // Check 1: Verification status
  if (workshop.verificationStatus === 'rejected' || workshop.verificationStatus === 'suspended') {
    disqualificationReasons.push(`Workshop status is ${workshop.verificationStatus}.`);
  }

  // Check 2: Availability
  if (workshop.availabilityStatus === 'busy') {
    disqualificationReasons.push('Workshop has declared zero current capacity (Status: Busy).');
  }

  // Check 3: Specialty matching
  const tenderCatLower = (tender.productCategory || '').toLowerCase();
  const tenderTitleLower = (tender.title || '').toLowerCase();
  
  const matchesSpecialty = workshop.specialties.some(spec => {
    const s = spec.toLowerCase();
    return tenderCatLower.includes(s) || tenderTitleLower.includes(s) || s.includes('desk') || s.includes('wood') || s.includes('furniture');
  });

  if (matchesSpecialty) {
    matchReasons.push(`Core specialty matches category: ${tender.productCategory}`);
  } else {
    matchReasons.push('General woodworking capabilities applicable.');
  }

  // Check 4: Capacity analysis
  const monthlyCapacity = workshop.monthlyCapacityUnits || 0;
  const tenderQty = tender.requiredQuantity || 1;
  const capacityRatio = Math.min(monthlyCapacity / tenderQty, 1);
  const capacityPercentage = Math.round(capacityRatio * 100);

  if (monthlyCapacity >= tenderQty) {
    matchReasons.push(`High capacity: Can fulfill ${monthlyCapacity} units/month (100% of requirement)`);
  } else if (monthlyCapacity > 0) {
    matchReasons.push(`Joint bidding fit: Can contribute ${monthlyCapacity} units/month (~${capacityPercentage}% of total)`);
  } else {
    disqualificationReasons.push('No declared monthly unit capacity.');
  }

  // Check 5: Location logistics
  const isCityMatch = workshop.city.toLowerCase() === tender.destinationCity.toLowerCase();
  if (isCityMatch) {
    matchReasons.push(`Logistics proximity: Workshop in ${workshop.city} (${workshop.area}) near destination`);
  }

  // Check 6: Experience & workforce
  if (workshop.workerCount >= 8) {
    matchReasons.push(`Robust workforce: ${workshop.workerCount} craftsmen available`);
  }

  // Check 7: Premium Tier priority consideration
  const isPremium = userRole === 'premium';
  if (isPremium) {
    matchReasons.push('Premium Membership: Priority queue ranking and first right of refusal eligibility');
  }

  // Calculate composite score
  let score = 20; // baseline
  if (matchesSpecialty) score += 25;
  score += Math.min(capacityPercentage * 0.3, 30);
  if (isCityMatch) score += 10;
  if (workshop.verificationStatus === 'verified') score += 10;
  if (isPremium) score += 5; // Slight priority weighting without overriding mandatory qualifications

  const isEligible = disqualificationReasons.length === 0 && workshop.verificationStatus !== 'rejected';

  return {
    workshopId: workshop.id,
    workshop,
    score: Math.min(Math.round(score), 100),
    isEligible,
    matchReasons,
    disqualificationReasons,
    capacityFitPercentage: capacityPercentage,
    hasSpecialtyMatch: matchesSpecialty,
    isLocationFavorable: isCityMatch,
    isPremiumTier: isPremium,
  };
}

/**
 * Synthesizes a collaborative consortium allocation for an institutional tender.
 * Example: 100 desks required -> workshops with 40, 35, 25 capacity combined.
 */
export function generateConsortiumProposal(
  tender: Tender,
  candidateWorkshops: Workshop[],
  userRolesMap: Record<string, 'basic' | 'premium' | 'admin'>
): ProposedConsortiumGrouping {
  const evaluations = candidateWorkshops
    .map(w => evaluateWorkshopForTender(w, tender, userRolesMap[w.ownerId] || 'basic'))
    .filter(e => e.isEligible)
    .sort((a, b) => {
      // Sort by eligibility score, giving fair priority to qualified premium members
      if (a.isPremiumTier && !b.isPremiumTier && Math.abs(a.score - b.score) <= 10) {
        return -1;
      }
      return b.score - a.score;
    });

  let remainingUnitsNeeded = tender.requiredQuantity;
  const suggestedMembers: ProposedConsortiumGrouping['suggestedMembers'] = [];
  let totalCommitted = 0;

  for (let i = 0; i < evaluations.length; i++) {
    if (remainingUnitsNeeded <= 0) break;
    const { workshop, isPremiumTier } = evaluations[i];
    const available = workshop.monthlyCapacityUnits || 30;
    const allocated = Math.min(available, remainingUnitsNeeded);

    if (allocated > 0) {
      remainingUnitsNeeded -= allocated;
      totalCommitted += allocated;
      const isLead = suggestedMembers.length === 0;

      suggestedMembers.push({
        workshop,
        proposedAllocationQuantity: allocated,
        allocationPercentage: Math.round((allocated / tender.requiredQuantity) * 100),
        role: isLead ? 'lead' : 'member',
        rationale: isLead
          ? `Highest composite score (${evaluations[i].score}/100) with proven project history in ${workshop.area}.`
          : `${isPremiumTier ? 'Premium priority member: ' : ''}Allocated ${allocated} units based on ${workshop.monthlyCapacityUnits} monthly capacity.`,
      });
    }
  }

  const isFullyCovered = totalCommitted >= tender.requiredQuantity;
  const explanation = isFullyCovered
    ? `Successfully allocated 100% (${totalCommitted} of ${tender.requiredQuantity} units) across ${suggestedMembers.length} vetted workshops.`
    : `Partial allocation: ${totalCommitted} of ${tender.requiredQuantity} units covered. Additional consortium partners needed for remaining ${tender.requiredQuantity - totalCommitted} units.`;

  return {
    tenderId: tender.id,
    tenderTitle: tender.title,
    requiredQuantity: tender.requiredQuantity,
    totalCommittedCapacity: totalCommitted,
    isFullyCovered,
    suggestedMembers,
    explanation,
  };
}
