/**
 * Card validation utilities
 */

// Card type patterns
const CARD_PATTERNS = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/
};

/**
 * Luhn algorithm for card number validation
 */
export function luhnCheck(cardNumber) {
  if (!cardNumber || typeof cardNumber !== 'string') return false;
  
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Detect card type from number
 */
export function detectCardType(cardNumber) {
  if (!cardNumber) return null;
  
  const digits = cardNumber.replace(/\D/g, '');
  
  for (const [type, pattern] of Object.entries(CARD_PATTERNS)) {
    if (pattern.test(digits)) {
      return type;
    }
  }
  
  // Check by prefix for partial numbers
  if (digits.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  
  return null;
}

/**
 * Validate card number
 */
export function validateCardNumber(cardNumber) {
  if (!cardNumber) {
    return { valid: false, error: 'Card number is required' };
  }
  
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13) {
    return { valid: false, error: 'Card number is too short' };
  }
  
  if (digits.length > 19) {
    return { valid: false, error: 'Card number is too long' };
  }
  
  // Check card type first
  const cardType = detectCardType(cardNumber);
  
  // For common card types, check expected length
  if (cardType === 'amex' && digits.length !== 15) {
    return { valid: false, error: 'Amex cards must be 15 digits' };
  }
  
  if ((cardType === 'visa' || cardType === 'mastercard' || cardType === 'discover') && 
      (digits.length < 16 || digits.length > 16)) {
    return { valid: false, error: 'Card number must be 16 digits' };
  }
  
  if (!luhnCheck(cardNumber)) {
    return { valid: false, error: 'Invalid card number (check digit failed)' };
  }
  
  return { valid: true, cardType: cardType || 'unknown' };
}

/**
 * Validate expiration date
 */
export function validateExpiryDate(expiry) {
  if (!expiry) {
    return { valid: false, error: 'Expiration date is required' };
  }
  
  const cleaned = expiry.replace(/\D/g, '');
  if (cleaned.length !== 4) {
    return { valid: false, error: 'Invalid format (use MM/YY)' };
  }
  
  const month = parseInt(cleaned.substring(0, 2), 10);
  const year = parseInt(cleaned.substring(2, 4), 10);
  
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Invalid month' };
  }
  
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { valid: false, error: 'Card has expired' };
  }
  
  return { valid: true };
}

/**
 * Validate CVC
 */
export function validateCVC(cvc, cardType = null) {
  if (!cvc) {
    return { valid: false, error: 'CVC is required' };
  }
  
  const cleaned = cvc.replace(/\D/g, '');
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  if (cleaned.length !== expectedLength) {
    return { 
      valid: false, 
      error: `CVC must be ${expectedLength} digits` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate postal code
 */
export function validatePostalCode(postalCode) {
  if (!postalCode) {
    return { valid: false, error: 'Postal code is required' };
  }
  
  const cleaned = postalCode.trim();
  
  if (cleaned.length < 3) {
    return { valid: false, error: 'Postal code is too short' };
  }
  
  if (cleaned.length > 10) {
    return { valid: false, error: 'Postal code is too long' };
  }
  
  return { valid: true };
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(value, cardType = null) {
  const digits = value.replace(/\D/g, '');
  
  if (cardType === 'amex') {
    // Amex: 4-6-5 format
    return digits
      .substring(0, 15)
      .match(/.{1,4}/g)
      ?.join(' ') || '';
  }
  
  // Others: 4-4-4-4 format
  return digits
    .substring(0, 16)
    .match(/.{1,4}/g)
    ?.join(' ') || '';
}

/**
 * Format expiry date as MM/YY
 */
export function formatExpiryDate(value) {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length >= 2) {
    return digits.substring(0, 2) + '/' + digits.substring(2, 4);
  }
  
  return digits;
}

/**
 * Get last 4 digits of card
 */
export function getLast4(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '');
  return digits.substring(digits.length - 4);
}
