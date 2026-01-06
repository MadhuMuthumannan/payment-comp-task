import {
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validatePostalCode,
  formatCardNumber,
  formatExpiryDate,
  detectCardType,
  getLast4
} from './utils/validation.js';
import { generateToken } from './utils/crypto.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      --pci-primary-color: #667eea;
      --pci-error-color: #dc3545;
      --pci-success-color: #28a745;
      --pci-border-color: #ddd;
      --pci-border-radius: 8px;
      --pci-background-color: #fff;
      --pci-text-color: #333;
      --pci-placeholder-color: #999;
      --pci-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --pci-input-padding: 14px;
      --pci-focus-ring-color: rgba(102, 126, 234, 0.3);
      
      display: block;
      font-family: var(--pci-font-family);
    }
    
    * {
      box-sizing: border-box;
    }
    
    .payment-form {
      background: var(--pci-background-color);
      border-radius: var(--pci-border-radius);
      padding: 24px;
    }
    
    .form-group {
      margin-bottom: 20px;
      position: relative;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--pci-text-color);
    }
    
    .required {
      color: var(--pci-error-color);
    }
    
    input {
      width: 100%;
      padding: var(--pci-input-padding);
      font-size: 16px;
      font-family: var(--pci-font-family);
      border: 2px solid var(--pci-border-color);
      border-radius: var(--pci-border-radius);
      background: var(--pci-background-color);
      color: var(--pci-text-color);
      transition: all 0.3s ease;
      outline: none;
    }
    
    input::placeholder {
      color: var(--pci-placeholder-color);
    }
    
    input:focus {
      border-color: var(--pci-primary-color);
      box-shadow: 0 0 0 3px var(--pci-focus-ring-color);
    }
    
    input.valid {
      border-color: var(--pci-success-color);
      padding-right: 40px;
    }
    
    input.invalid {
      border-color: var(--pci-error-color);
      padding-right: 40px;
    }
    
    .input-wrapper {
      position: relative;
    }
    
    .validation-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      pointer-events: none;
    }
    
    .validation-icon.valid {
      color: var(--pci-success-color);
    }
    
    .validation-icon.invalid {
      color: var(--pci-error-color);
    }
    
    .card-type-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24px;
      pointer-events: none;
    }
    
    .error-message {
      display: none;
      margin-top: 6px;
      font-size: 13px;
      color: var(--pci-error-color);
    }
    
    .error-message.show {
      display: block;
    }
    
    .help-text {
      margin-top: 6px;
      font-size: 13px;
      color: var(--pci-placeholder-color);
    }
    
    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    
    /* Screen reader only text */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  </style>
  
  <div class="payment-form" role="form" aria-label="Payment card information">
    <div class="form-group">
      <label for="card-number">
        Card Number <span class="required" aria-label="required">*</span>
      </label>
      <div class="input-wrapper">
        <input 
          type="text" 
          id="card-number"
          name="cardNumber"
          autocomplete="cc-number"
          inputmode="numeric"
          placeholder="1234 5678 9012 3456"
          aria-required="true"
          aria-invalid="false"
          aria-describedby="card-number-error card-number-help"
        />
        <span class="card-type-icon" aria-hidden="true"></span>
      </div>
      <div id="card-number-error" class="error-message" role="alert"></div>
      <div id="card-number-help" class="help-text">Enter your 13-19 digit card number</div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="expiry-date">
          Expiration Date <span class="required" aria-label="required">*</span>
        </label>
        <div class="input-wrapper">
          <input 
            type="text" 
            id="expiry-date"
            name="expiryDate"
            autocomplete="cc-exp"
            inputmode="numeric"
            placeholder="MM/YY"
            maxlength="5"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="expiry-error expiry-help"
          />
          <span class="validation-icon" aria-hidden="true"></span>
        </div>
        <div id="expiry-error" class="error-message" role="alert"></div>
        <div id="expiry-help" class="help-text">MM/YY format</div>
      </div>
      
      <div class="form-group">
        <label for="cvc">
          CVC <span class="required" aria-label="required">*</span>
        </label>
        <div class="input-wrapper">
          <input 
            type="text" 
            id="cvc"
            name="cvc"
            autocomplete="cc-csc"
            inputmode="numeric"
            placeholder="123"
            maxlength="4"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="cvc-error cvc-help"
          />
          <span class="validation-icon" aria-hidden="true"></span>
        </div>
        <div id="cvc-error" class="error-message" role="alert"></div>
        <div id="cvc-help" class="help-text">3-4 digit code on back</div>
      </div>
    </div>
    
    <div class="form-group">
      <label for="postal-code">
        Postal Code <span class="required" aria-label="required">*</span>
      </label>
      <div class="input-wrapper">
        <input 
          type="text" 
          id="postal-code"
          name="postalCode"
          autocomplete="postal-code"
          placeholder="12345"
          maxlength="10"
          aria-required="true"
          aria-invalid="false"
          aria-describedby="postal-error postal-help"
        />
        <span class="validation-icon" aria-hidden="true"></span>
      </div>
      <div id="postal-error" class="error-message" role="alert"></div>
      <div id="postal-help" class="help-text">Billing postal/ZIP code</div>
    </div>
    
    <div class="sr-only" role="status" aria-live="polite" aria-atomic="true" id="status-message"></div>
  </div>
`;

const CARD_TYPE_ICONS = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  diners: '💳',
  jcb: '💳'
};

class PaymentCardInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.state = {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      postalCode: '',
      cardType: null,
      errors: {
        cardNumber: null,
        expiryDate: null,
        cvc: null,
        postalCode: null
      },
      touched: {
        cardNumber: false,
        expiryDate: false,
        cvc: false,
        postalCode: false
      },
      isValid: false
    };
    
    this.tokenizationEndpoint = 'http://localhost:3000/api/tokenize';
    this.paymentEndpoint = 'http://localhost:3000/api/payments';
  }
  
  connectedCallback() {
    this.setupEventListeners();
    this.announceToScreenReader('Payment form loaded and ready');
  }
  
  setupEventListeners() {
    const cardNumberInput = this.shadowRoot.getElementById('card-number');
    const expiryInput = this.shadowRoot.getElementById('expiry-date');
    const cvcInput = this.shadowRoot.getElementById('cvc');
    const postalInput = this.shadowRoot.getElementById('postal-code');
    
    // Card number
    cardNumberInput.addEventListener('input', (e) => this.handleCardNumberInput(e));
    cardNumberInput.addEventListener('blur', () => this.handleBlur('cardNumber'));
    
    // Expiry date
    expiryInput.addEventListener('input', (e) => this.handleExpiryInput(e));
    expiryInput.addEventListener('blur', () => this.handleBlur('expiryDate'));
    
    // CVC
    cvcInput.addEventListener('input', (e) => this.handleCVCInput(e));
    cvcInput.addEventListener('blur', () => this.handleBlur('cvc'));
    
    // Postal code
    postalInput.addEventListener('input', (e) => this.handlePostalInput(e));
    postalInput.addEventListener('blur', () => this.handleBlur('postalCode'));
  }
  
  handleCardNumberInput(e) {
    const input = e.target;
    let value = input.value.replace(/\s/g, '');
    
    // Detect card type
    const cardType = detectCardType(value);
    this.state.cardType = cardType;
    
    // Format the number
    const formatted = formatCardNumber(value, cardType);
    input.value = formatted;
    this.state.cardNumber = formatted;
    
    // Update card type icon
    this.updateCardTypeIcon(cardType);
    
    // Validate
    this.validateField('cardNumber');
    this.updateValidationState();
    this.emitValidationChange();
  }
  
  handleExpiryInput(e) {
    const input = e.target;
    const formatted = formatExpiryDate(input.value);
    input.value = formatted;
    this.state.expiryDate = formatted;
    
    this.validateField('expiryDate');
    this.updateValidationState();
    this.emitValidationChange();
  }
  
  handleCVCInput(e) {
    const input = e.target;
    const value = input.value.replace(/\D/g, '');
    const maxLength = this.state.cardType === 'amex' ? 4 : 3;
    input.value = value.substring(0, maxLength);
    this.state.cvc = input.value;
    
    this.validateField('cvc');
    this.updateValidationState();
    this.emitValidationChange();
  }
  
  handlePostalInput(e) {
    const input = e.target;
    this.state.postalCode = input.value.trim();
    
    this.validateField('postalCode');
    this.updateValidationState();
    this.emitValidationChange();
  }
  
  handleBlur(fieldName) {
    this.state.touched[fieldName] = true;
    this.updateFieldUI(fieldName);
  }
  
  validateField(fieldName) {
    let result;
    
    switch (fieldName) {
      case 'cardNumber':
        result = validateCardNumber(this.state.cardNumber);
        break;
      case 'expiryDate':
        result = validateExpiryDate(this.state.expiryDate);
        break;
      case 'cvc':
        result = validateCVC(this.state.cvc, this.state.cardType);
        break;
      case 'postalCode':
        result = validatePostalCode(this.state.postalCode);
        break;
    }
    
    this.state.errors[fieldName] = result.valid ? null : result.error;
    
    if (this.state.touched[fieldName]) {
      this.updateFieldUI(fieldName);
    }
  }
  
  updateFieldUI(fieldName) {
    const fieldMap = {
      cardNumber: 'card-number',
      expiryDate: 'expiry-date',
      cvc: 'cvc',
      postalCode: 'postal-code'
    };
    
    const inputId = fieldMap[fieldName];
    const input = this.shadowRoot.getElementById(inputId);
    const errorEl = this.shadowRoot.getElementById(`${inputId}-error`);
    const icon = input.parentElement.querySelector('.validation-icon');
    
    const error = this.state.errors[fieldName];
    const hasValue = this.state[fieldName].length > 0;
    
    // Remove existing classes
    input.classList.remove('valid', 'invalid');
    if (icon) {
      icon.classList.remove('valid', 'invalid');
      icon.textContent = '';
    }
    
    if (hasValue && this.state.touched[fieldName]) {
      if (error) {
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
        errorEl.textContent = error;
        errorEl.classList.add('show');
        if (icon) {
          icon.classList.add('invalid');
          icon.textContent = '✕';
        }
      } else {
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
        errorEl.textContent = '';
        errorEl.classList.remove('show');
        if (icon) {
          icon.classList.add('valid');
          icon.textContent = '✓';
        }
      }
    } else {
      input.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    }
  }
  
  updateCardTypeIcon(cardType) {
    const icon = this.shadowRoot.querySelector('.card-type-icon');
    if (cardType && CARD_TYPE_ICONS[cardType]) {
      icon.textContent = CARD_TYPE_ICONS[cardType];
    } else {
      icon.textContent = '';
    }
  }
  
  updateValidationState() {
    const allFieldsValid = Object.values(this.state.errors).every(error => error === null);
    const allFieldsFilled = this.state.cardNumber && this.state.expiryDate && 
                           this.state.cvc && this.state.postalCode;
    
    this.state.isValid = allFieldsValid && allFieldsFilled;
  }
  
  emitValidationChange() {
    this.dispatchEvent(new CustomEvent('validation-change', {
      detail: {
        isValid: this.state.isValid,
        errors: { ...this.state.errors }
      },
      bubbles: true,
      composed: true
    }));
  }
  
  announceToScreenReader(message) {
    const statusEl = this.shadowRoot.getElementById('status-message');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }
  
  async generateToken() {
    try {
      const tokenData = await generateToken({
        cardNumber: this.state.cardNumber,
        expiry: this.state.expiryDate,
        cvc: this.state.cvc,
        postalCode: this.state.postalCode,
        cardType: this.state.cardType
      });
      
      this.dispatchEvent(new CustomEvent('token-generated', {
        detail: tokenData,
        bubbles: true,
        composed: true
      }));
      
      return tokenData.token;
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: {
          type: 'tokenization',
          message: error.message
        },
        bubbles: true,
        composed: true
      }));
      throw error;
    }
  }
  
  async processPayment(amount, currency = 'USD') {
    if (!this.state.isValid) {
      // Touch all fields to show errors
      Object.keys(this.state.touched).forEach(field => {
        this.state.touched[field] = true;
        this.updateFieldUI(field);
      });
      throw new Error('Please fill in all required fields correctly');
    }
    
    try {
      // Generate token
      const token = await this.generateToken();
      
      // Call payment API
      const response = await fetch(this.paymentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          amount,
          currency
        })
      });
      
      const result = await response.json();
      
      this.dispatchEvent(new CustomEvent('payment-complete', {
        detail: result,
        bubbles: true,
        composed: true
      }));
      
      if (result.success) {
        this.announceToScreenReader('Payment successful');
      } else {
        this.announceToScreenReader('Payment failed');
      }
      
      return result;
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error', {
        detail: {
          type: 'payment',
          message: error.message
        },
        bubbles: true,
        composed: true
      }));
      throw error;
    }
  }
  
  reset() {
    // Reset state
    this.state = {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      postalCode: '',
      cardType: null,
      errors: {
        cardNumber: null,
        expiryDate: null,
        cvc: null,
        postalCode: null
      },
      touched: {
        cardNumber: false,
        expiryDate: false,
        cvc: false,
        postalCode: false
      },
      isValid: false
    };
    
    // Clear inputs
    this.shadowRoot.getElementById('card-number').value = '';
    this.shadowRoot.getElementById('expiry-date').value = '';
    this.shadowRoot.getElementById('cvc').value = '';
    this.shadowRoot.getElementById('postal-code').value = '';
    
    // Clear validation UI
    Object.keys(this.state.touched).forEach(field => {
      this.updateFieldUI(field);
    });
    
    this.updateCardTypeIcon(null);
    this.emitValidationChange();
    this.announceToScreenReader('Form reset');
  }
  
  // Public API
  getState() {
    return {
      isValid: this.state.isValid,
      errors: { ...this.state.errors },
      cardType: this.state.cardType,
      last4: this.state.cardNumber ? getLast4(this.state.cardNumber) : null
    };
  }
}

// Register the custom element
customElements.define('payment-card-input', PaymentCardInput);

export default PaymentCardInput;
