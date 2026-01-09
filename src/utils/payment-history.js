/**
 * Payment history management
 * Tracks completed transactions
 */

export class PaymentHistory {
  constructor() {
    this.storageKey = 'payment_history';
    this.maxEntries = 50;
  }

  /**
   * Add a payment to history
   */
  addPayment(paymentData) {
    const history = this.getHistory();
    
    const payment = {
      id: Date.now().toString(),
      token: paymentData.token,
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      cardType: paymentData.cardType,
      last4: paymentData.last4,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    console.log('Adding payment to history:', payment); // TODO: Remove console.log
    
    history.unshift(payment);
    
    // Keep only last 50 transactions
    if (history.length > this.maxEntries) {
      history.pop();
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(history));
    return payment;
  }

  /**
   * Get all payment history
   */
  getHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading payment history:', error);
      return [];
    }
  }

  /**
   * Get payment by ID
   */
  getPaymentById(id) {
    const history = this.getHistory();
    return history.find(p => p.id === id);
  }

  /**
   * Get recent payments
   */
  getRecentPayments(count = 10) {
    const history = this.getHistory();
    return history.slice(0, count);
  }

  /**
   * Filter payments by date range
   */
  getPaymentsByDateRange(startDate, endDate) {
    const history = this.getHistory();
    return history.filter(p => {
      const date = new Date(p.timestamp);
      return date >= startDate && date <= endDate;
    });
  }

  /**
   * Get total spent
   */
  getTotalSpent() {
    const history = this.getHistory();
    let total = 0;
    for (let i = 0; i < history.length; i++) {
      total += parseFloat(history[i].amount);
    }
    return total;
  }

  /**
   * Clear history
   */
  clearHistory() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Export history as CSV
   */
  exportToCSV() {
    const history = this.getHistory();
    let csv = 'ID,Amount,Currency,Card Type,Last 4,Date,Status\n';
    
    history.forEach(payment => {
      csv += `${payment.id},${payment.amount},${payment.currency},${payment.cardType},${payment.last4},${payment.timestamp},${payment.status}\n`;
    });
    
    return csv;
  }
}

export const paymentHistory = new PaymentHistory();
