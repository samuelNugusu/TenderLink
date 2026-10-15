import { evaluateWorkshopForTender, generateConsortiumProposal } from '../src/services/matchingEngine';
import { Workshop, Tender } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

export function runMatchingEngineTests() {
  console.log('\n--- Running Matching Engine & Consortium Proposal Tests ---');

  const sampleTender: Tender = {
    id: 't_test_01',
    referenceNumber: 'ET-TEST-001',
    title: 'School Desks Supply 100 Units',
    issuingOrganization: 'Addis Ababa Education Bureau',
    productCategory: 'School Furniture',
    destinationCity: 'Addis Ababa',
    destinationRegion: 'Addis Ababa',
    publishedDate: '2026-03-01',
    submissionDeadline: '2026-04-15',
    requiredQuantity: 100,
    unitType: 'desks',
    itemDescription: 'Standard double desks',
    technicalSpecs: 'Steel and eucalyptus',
    qualificationsRequired: 'Valid license',
    deliveryScheduleWeeks: 4,
    submissionMethod: 'Physical sealed envelope',
    status: 'published',
    isVerified: true,
    isJointBiddingPermitted: true,
    createdAt: '',
    updatedAt: '',
  };

  const workshopA: Workshop = {
    id: 'ws_a',
    ownerId: 'user_a',
    ownerName: 'Alemayehu',
    businessName: 'Workshop A (Masalemiya)',
    phone: '+251 911 000 001',
    email: 'a@test.et',
    city: 'Addis Ababa',
    area: 'Masalemiya',
    address: 'Masalemiya Timber Quarter',
    workshopType: 'Solid Wood & Steel',
    specialties: ['School Desks'],
    machinery: ['Table Saw', 'Welder'],
    monthlyCapacityUnits: 40,
    workerCount: 8,
    yearsOfExperience: 5,
    pastProjectsSummary: '',
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    preferredContractSize: '1M ETB',
    createdAt: '',
    updatedAt: '',
  };

  const workshopB: Workshop = {
    id: 'ws_b',
    ownerId: 'user_b',
    ownerName: 'Bekele',
    businessName: 'Workshop B (Kality)',
    phone: '+251 911 000 002',
    email: 'b@test.et',
    city: 'Addis Ababa',
    area: 'Kality',
    address: 'Kality Zone',
    workshopType: 'Solid Wood & Steel',
    specialties: ['School Desks'],
    machinery: ['Table Saw'],
    monthlyCapacityUnits: 35,
    workerCount: 6,
    yearsOfExperience: 4,
    pastProjectsSummary: '',
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    preferredContractSize: '1M ETB',
    createdAt: '',
    updatedAt: '',
  };

  const workshopC: Workshop = {
    id: 'ws_c',
    ownerId: 'user_c',
    ownerName: 'Chala',
    businessName: 'Workshop C (Merkato)',
    phone: '+251 911 000 003',
    email: 'c@test.et',
    city: 'Addis Ababa',
    area: 'Merkato',
    address: 'Merkato Quarter',
    workshopType: 'Solid Wood & Steel',
    specialties: ['School Desks'],
    machinery: ['Welder'],
    monthlyCapacityUnits: 25,
    workerCount: 5,
    yearsOfExperience: 3,
    pastProjectsSummary: '',
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    preferredContractSize: '1M ETB',
    createdAt: '',
    updatedAt: '',
  };

  // Test 1: Evaluation should yield positive score for eligible workshop
  const evalA = evaluateWorkshopForTender(workshopA, sampleTender, 'basic');
  assert(evalA.isEligible, 'Workshop A is marked eligible');
  assert(evalA.score >= 50, 'Workshop A score reflects specialty and capacity fit');

  // Test 2: Ineligible workshop (status rejected)
  const rejectedWorkshop: Workshop = {
    ...workshopA,
    id: 'ws_rejected',
    verificationStatus: 'rejected',
  };
  const evalRejected = evaluateWorkshopForTender(rejectedWorkshop, sampleTender, 'basic');
  assert(!evalRejected.isEligible, 'Rejected workshop is marked ineligible');

  // Test 3: Consortium Proposal decomposing 100 units into 40 + 35 + 25 = 100 units
  const proposal = generateConsortiumProposal(
    sampleTender,
    [workshopA, workshopB, workshopC],
    { user_a: 'basic', user_b: 'basic', user_c: 'basic' }
  );

  assert(proposal.isFullyCovered, 'Consortium fully covers 100 required units');
  assert(proposal.totalCommittedCapacity === 100, `Total committed capacity is exactly 100 units (got: ${proposal.totalCommittedCapacity})`);
  assert(proposal.suggestedMembers.length === 3, 'Proposal combines all 3 eligible workshops');

  const allocations = proposal.suggestedMembers.map(m => m.proposedAllocationQuantity);
  assert(allocations.includes(40) && allocations.includes(35) && allocations.includes(25), 'Allocations reflect 40, 35, and 25 capacity contributions');

  console.log('--- All Matching Engine Tests Passed Successfully! ---\n');
}
