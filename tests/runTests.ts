import { runMatchingEngineTests } from './matchingEngine.test';
import { runSecurityRulesTests } from './securityRules.test';

console.log('====================================================');
console.log('TenderLink Ethiopia Automated Test Suite');
console.log('====================================================');

try {
  runMatchingEngineTests();
  runSecurityRulesTests();
  console.log('====================================================');
  console.log('SUCCESS: All 8 critical workflow & security tests passed!');
  console.log('====================================================\n');
  process.exit(0);
} catch (error) {
  console.error('\nFAILURE IN TEST SUITE:');
  console.error(error);
  process.exit(1);
}
