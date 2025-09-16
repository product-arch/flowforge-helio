/**
 * Generates a unique business code following the pattern: XXXX-XXXX-XXXX
 * - First 4: First 4 letters of brand name (lowercase, padded with 'x' if needed)
 * - Second 4: First 4 letters of business entity name (lowercase, padded with 'x' if needed)
 * - Last 4: Random alphanumeric combination
 */
export const generateBusinessCode = (
  brandName: string, 
  entityName: string, 
  existingCodes: string[]
): string => {
  // Extract letters only and convert to lowercase
  const brandLetters = brandName.toLowerCase().replace(/[^a-z]/g, '');
  const entityLetters = entityName.toLowerCase().replace(/[^a-z]/g, '');
  
  // Get first 4 letters, pad with 'x' if needed
  const brandCode = brandLetters.slice(0, 4).padEnd(4, 'x');
  const entityCode = entityLetters.slice(0, 4).padEnd(4, 'x');
  
  // Generate random alphanumeric string (letters and numbers)
  const generateRandomCode = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Ensure uniqueness
  let code: string;
  do {
    const randomCode = generateRandomCode();
    code = `${brandCode}-${entityCode}-${randomCode}`;
  } while (existingCodes.includes(code));
  
  return code;
};

/**
 * Validates if a business code follows the correct format
 */
export const validateBusinessCode = (code: string): boolean => {
  const pattern = /^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/;
  return pattern.test(code);
};