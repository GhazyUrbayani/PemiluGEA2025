/**
 * Test Script: Voter Token Generation
 * 
 * Test generate token 5-7 digit angka untuk voter
 */

function generateVoterToken(): string {
  const tokenLength = 5 + Math.floor(Math.random() * 3); // Random 5-7 digits
  const token = Math.floor(Math.random() * Math.pow(10, tokenLength)).toString().padStart(tokenLength, '0');
  return token;
}

console.log("\n🎲 Testing Voter Token Generation (5-7 digit angka)\n");

// Generate 20 sample tokens
const tokens = new Set<string>();
for (let i = 0; i < 20; i++) {
  const token = generateVoterToken();
  tokens.add(token);
  console.log(`Token ${i + 1}: ${token} (${token.length} digit)`);
}

console.log(`\n✅ Generated ${tokens.size} unique tokens`);
console.log(`📊 Token length distribution:`);

const lengthCounts: Record<number, number> = { 5: 0, 6: 0, 7: 0 };
tokens.forEach(token => {
  lengthCounts[token.length]++;
});

console.log(`   5 digit: ${lengthCounts[5]} tokens`);
console.log(`   6 digit: ${lengthCounts[6]} tokens`);
console.log(`   7 digit: ${lengthCounts[7]} tokens`);

console.log(`\n✨ Token format: HANYA ANGKA (no letters, no special chars)`);
console.log(`📝 Example usage: Masukkan "12345" di form login\n`);
