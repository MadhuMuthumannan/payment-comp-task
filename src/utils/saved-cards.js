/**
 * Saved cards management
 * Allows users to save and manage payment methods
 */

import { validateCardNumber } from './validation.js';

export class SavedCardsManager {
  constructor() {
    this.storageKey = 'saved_cards';
  }

  /**
   * Save a new card
   */
  saveCard(cardData) {
    const cards = this.getSavedCards();
    
    // Check if card already exists
    const exists = cards.find(c => c.last4 === cardData.last4 && c.cardType === cardData.cardType);
    if (exists) {
      console.log('Card already saved');
      return { success: false, error: 'Card already saved' };
    }
    
    const savedCard = {
      id: this.generateCardId(),
      cardType: cardData.cardType,
      last4: cardData.last4,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      nickname: cardData.nickname || `${cardData.cardType} ****${cardData.last4}`,
      isDefault: cards.length === 0,
      addedAt: new Date().toISOString()
    };
    
    cards.push(savedCard);
    localStorage.setItem(this.storageKey, JSON.stringify(cards));
    
    return { success: true, card: savedCard };
  }

  /**
   * Get all saved cards
   */
  getSavedCards() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Get card by ID
   */
  getCardById(id) {
    const cards = this.getSavedCards();
    return cards.find(c => c.id === id);
  }

  /**
   * Get default card
   */
  getDefaultCard() {
    const cards = this.getSavedCards();
    return cards.find(c => c.isDefault) || cards[0];
  }

  /**
   * Set default card
   */
  setDefaultCard(cardId) {
    const cards = this.getSavedCards();
    
    cards.forEach(card => {
      card.isDefault = card.id === cardId;
    });
    
    localStorage.setItem(this.storageKey, JSON.stringify(cards));
  }

  /**
   * Delete card
   */
  deleteCard(cardId) {
    let cards = this.getSavedCards();
    const cardToDelete = cards.find(c => c.id === cardId);
    
    if (!cardToDelete) {
      return { success: false, error: 'Card not found' };
    }
    
    cards = cards.filter(c => c.id !== cardId);
    
    // If deleted card was default, set first remaining card as default
    if (cardToDelete.isDefault && cards.length > 0) {
      cards[0].isDefault = true;
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(cards));
    return { success: true };
  }

  /**
   * Update card nickname
   */
  updateCardNickname(cardId, nickname) {
    const cards = this.getSavedCards();
    const card = cards.find(c => c.id === cardId);
    
    if (card) {
      card.nickname = nickname;
      localStorage.setItem(this.storageKey, JSON.stringify(cards));
      return true;
    }
    
    return false;
  }

  /**
   * Check if card is expired
   */
  isCardExpired(card) {
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    const expYear = parseInt(card.expiryYear);
    const expMonth = parseInt(card.expiryMonth);
    
    if (expYear < currentYear) {
      return true;
    }
    
    if (expYear === currentYear && expMonth < currentMonth) {
      return true;
    }
    
    return false;
  }

  /**
   * Get valid (non-expired) cards
   */
  getValidCards() {
    const cards = this.getSavedCards();
    return cards.filter(card => !this.isCardExpired(card));
  }

  /**
   * Generate unique card ID
   */
  generateCardId() {
    return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Clear all saved cards
   */
  clearAllCards() {
    localStorage.removeItem(this.storageKey);
  }
}

export const savedCardsManager = new SavedCardsManager();
