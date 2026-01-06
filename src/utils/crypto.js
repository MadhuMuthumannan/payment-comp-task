/**
 * Simple encryption utilities using Web Crypto API
 * Note: In production, you'd use a proper encryption library
 * and server-side key management
 */

/**
 * Generate a simple token from card data
 * In production, this would encrypt data and send to tokenization service
 */
export async function generateToken(cardData) {
  // Simulate encryption by creating a base64 encoded token
  const tokenData = {
    timestamp: Date.now(),
    last4: cardData.cardNumber.replace(/\D/g, '').slice(-4),
    cardType: cardData.cardType,
    expiryMonth: cardData.expiry.substring(0, 2),
    expiryYear: cardData.expiry.substring(3, 5)
  };
  
  // Create a token string
  const tokenString = JSON.stringify(tokenData);
  const encoded = btoa(tokenString);
  
  return {
    token: `tok_${encoded.substring(0, 32)}`,
    metadata: {
      cardType: cardData.cardType,
      last4: tokenData.last4,
      expiryMonth: tokenData.expiryMonth,
      expiryYear: tokenData.expiryYear
    }
  };
}

/**
 * Hash sensitive data (one-way)
 * Used for CVC and full card number to prevent storing in plain text
 */
export async function hashData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generate a random ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
