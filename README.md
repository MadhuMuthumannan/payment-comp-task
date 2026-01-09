# Payment Card Input Component 💳

A production-grade, framework-agnostic, accessible Web Component for collecting payment card information securely.

## ✨ Features

- 🎯 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript
- 🔒 **Secure** - Client-side tokenization, sensitive data never touches your server
- ♿ **Accessible** - WCAG 2.1 AA compliant with full keyboard navigation and screen reader support
- 🎨 **Customizable** - Easy theming with CSS custom properties
- ✅ **Real-time Validation** - Luhn algorithm, card type detection, expiry validation
- 📱 **Responsive** - Mobile-friendly design
- 🚀 **Lightweight** - Minimal dependencies, small bundle size

## � Installation

### Via npm

```bash
npm install payment-card-input
```

### Via CDN

```html
<!-- Latest version -->
<script src="https://unpkg.com/payment-card-input@latest/dist/payment-card-input.umd.js"></script>

<!-- Specific version -->
<script src="https://unpkg.com/payment-card-input@1.0.0/dist/payment-card-input.umd.js"></script>
```

**Alternative CDNs:**
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/payment-card-input@1.0.0/dist/payment-card-input.umd.js`
- **unpkg**: `https://unpkg.com/payment-card-input@1.0.0/dist/payment-card-input.umd.js`

## 🚀 Quick Start

### Using npm Package

```javascript
// Import in your JavaScript/TypeScript project
import 'payment-card-input';

// Or with CommonJS
require('payment-card-input');

// Now use the component in your HTML
```

```html
<payment-card-input id="payment"></payment-card-input>

<script>
  const component = document.querySelector('#payment');
  
  component.addEventListener('validation-change', (e) => {
    console.log('Valid:', e.detail.isValid);
  });
  
  component.addEventListener('payment-complete', (e) => {
    console.log('Payment successful:', e.detail);
  });
</script>
```

### Using CDN

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/payment-card-input@1.0.0/dist/payment-card-input.umd.js"></script>
</head>
<body>
  <payment-card-input id="payment"></payment-card-input>
  <button id="pay-btn">Process Payment</button>
  
  <script>
    const component = document.querySelector('#payment');
    const payBtn = document.querySelector('#pay-btn');
    
    component.addEventListener('validation-change', (e) => {
      payBtn.disabled = !e.detail.isValid;
    });
    
    payBtn.addEventListener('click', async () => {
      const result = await component.processPayment(1000, 'USD');
      console.log('Payment result:', result);
    });
  </script>
</body>
</html>
```

## 🛠️ Development Setup (for contributors)

### Installation

```bash
npm install
```

### Run Development Server

```bash
# Terminal 1 - Start the mock API server
npm run start:api

# Terminal 2 - Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

This creates:
- `dist/payment-card-input.es.js` - ES module
- `dist/payment-card-input.umd.js` - UMD bundle for CDN

## 📖 Usage

### Vanilla JavaScript / HTML

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include via CDN or local file -->
    <script src="dist/payment-card-input.umd.js"></script>
</head>
<body>
    <!-- Use the component -->
    <payment-card-input id="payment"></payment-card-input>
    
    <button id="submit-btn">Pay Now</button>
    
    <script>
        const component = document.querySelector('#payment');
        const submitBtn = document.querySelector('#submit-btn');
        
        // Listen for validation changes
        component.addEventListener('validation-change', (e) => {
            submitBtn.disabled = !e.detail.isValid;
        });
        
        // Process payment
        submitBtn.addEventListener('click', async () => {
            try {
                const result = await component.processPayment(1000, 'USD');
                console.log('Payment result:', result);
            } catch (error) {
                console.error('Payment failed:', error);
            }
        });
    </script>
</body>
</html>
```

### React

**Installation:**
```bash
npm install payment-card-input
```

**Usage:**
```jsx
import { useEffect, useRef, useState } from 'react';
import 'payment-card-input';

function PaymentForm() {
    const paymentRef = useRef(null);
    const [isValid, setIsValid] = useState(false);
    
    useEffect(() => {
        const component = paymentRef.current;
        
        const handleValidation = (e) => {
            setIsValid(e.detail.isValid);
        };
        
        component.addEventListener('validation-change', handleValidation);
        
        return () => {
            component.removeEventListener('validation-change', handleValidation);
        };
    }, []);
    
    const handleSubmit = async () => {
        try {
            const result = await paymentRef.current.processPayment(1000, 'USD');
            console.log('Payment successful:', result);
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };
    
    return (
        <div>
            <payment-card-input ref={paymentRef} />
            <button onClick={handleSubmit} disabled={!isValid}>
                Pay Now
            </button>
        </div>
    );
}
```

### Vue

**Installation:**
```bash
npm install payment-card-input
```

**Usage:**
```vue
<template>
    <div>
        <payment-card-input ref="payment" @validation-change="onValidationChange" />
        <button @click="handleSubmit" :disabled="!isValid">Pay Now</button>
    </div>
</template>

<script>
import 'payment-card-input';

export default {
    data() {
        return {
            isValid: false
        };
    },
    methods: {
        onValidationChange(e) {
            this.isValid = e.detail.isValid;
        },
        async handleSubmit() {
            try {
                const result = await this.$refs.payment.processPayment(1000, 'USD');
                console.log('Payment successful:', result);
            } catch (error) {
                console.error('Payment failed:', error);
            }
        }
    }
};
</script>
```

### Angular

**Installation:**
```bash
npm install payment-card-input
```

**Step 1:** Add the schema to your module to allow custom elements

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**Step 2:** Import the component in your component file

```typescript
// payment.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import 'payment-card-input';

@Component({
  selector: 'app-payment',
  template: `
    <div>
      <payment-card-input #payment></payment-card-input>
      <button (click)="handleSubmit()" [disabled]="!isValid">
        Pay Now
      </button>
      <div *ngIf="statusMessage" [class]="statusClass">
        {{ statusMessage }}
      </div>
    </div>
  `,
  styles: []
})
export class PaymentComponent implements AfterViewInit {
  @ViewChild('payment', { static: false }) paymentElement!: ElementRef;
  
  isValid = false;
  statusMessage = '';
  statusClass = '';

  ngAfterViewInit() {
    const component = this.paymentElement.nativeElement;
    
    // Listen for validation changes
    component.addEventListener('validation-change', (e: any) => {
      this.isValid = e.detail.isValid;
    });
    
    // Listen for payment completion
    component.addEventListener('payment-complete', (e: any) => {
      if (e.detail.success) {
        this.statusMessage = `Payment successful! Transaction: ${e.detail.transactionId}`;
        this.statusClass = 'success';
      } else {
        this.statusMessage = `Payment failed: ${e.detail.message}`;
        this.statusClass = 'error';
      }
    });
    
    // Listen for errors
    component.addEventListener('error', (e: any) => {
      this.statusMessage = `Error: ${e.detail.message}`;
      this.statusClass = 'error';
    });
  }

  async handleSubmit() {
    try {
      const component = this.paymentElement.nativeElement;
      const result = await component.processPayment(1000, 'USD');
      console.log('Payment result:', result);
    } catch (error: any) {
      console.error('Payment failed:', error);
      this.statusMessage = error.message;
      this.statusClass = 'error';
    }
  }
}
```

**Alternative:** For standalone components (Angular 14+)

```typescript
// payment.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'payment-card-input';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div>
      <payment-card-input #payment></payment-card-input>
      <button (click)="handleSubmit()" [disabled]="!isValid">
        Pay Now
      </button>
    </div>
  `
})
export class PaymentComponent implements AfterViewInit {
  // ... same implementation as above
}
```

## 🎨 Theming

Customize the appearance using CSS custom properties:

```css
payment-card-input {
    --pci-primary-color: #667eea;
    --pci-error-color: #dc3545;
    --pci-success-color: #28a745;
    --pci-border-color: #ddd;
    --pci-border-radius: 8px;
    --pci-background-color: #fff;
    --pci-text-color: #333;
    --pci-placeholder-color: #999;
    --pci-font-family: -apple-system, sans-serif;
    --pci-input-padding: 14px;
    --pci-focus-ring-color: rgba(102, 126, 234, 0.3);
}
```

## 📡 Events

The component emits the following events:

### `validation-change`

Fired when validation state changes.

```javascript
component.addEventListener('validation-change', (e) => {
    console.log('Valid:', e.detail.isValid);
    console.log('Errors:', e.detail.errors);
});
```

**Event Detail:**
```javascript
{
    isValid: boolean,
    errors: {
        cardNumber: string | null,
        expiryDate: string | null,
        cvc: string | null,
        postalCode: string | null
    }
}
```

### `token-generated`

Fired when payment token is generated.

```javascript
component.addEventListener('token-generated', (e) => {
    console.log('Token:', e.detail.token);
    console.log('Metadata:', e.detail.metadata);
});
```

**Event Detail:**
```javascript
{
    token: string,
    metadata: {
        cardType: string,
        last4: string,
        expiryMonth: string,
        expiryYear: string
    }
}
```

### `payment-complete`

Fired when payment processing completes.

```javascript
component.addEventListener('payment-complete', (e) => {
    console.log('Success:', e.detail.success);
    console.log('Transaction ID:', e.detail.transactionId);
});
```

**Event Detail:**
```javascript
{
    success: boolean,
    transactionId: string,
    amount: number,
    currency: string,
    status: string,
    message: string
}
```

### `error`

Fired when an error occurs.

```javascript
component.addEventListener('error', (e) => {
    console.error('Error type:', e.detail.type);
    console.error('Message:', e.detail.message);
});
```

## 🔌 API Methods

### `processPayment(amount, currency)`

Process a payment with the current card data.

```javascript
const result = await component.processPayment(1000, 'USD');
```

### `reset()`

Clear all fields and reset the form.

```javascript
component.reset();
```

### `getState()`

Get the current component state.

```javascript
const state = component.getState();
// Returns: { isValid, errors, cardType, last4 }
```

## 🧪 Test Cards

Use these test card numbers for development (all pass Luhn validation):

| Card Type   | Number             | Notes |
|-------------|-------------------|-------|
| Visa        | 4242 4242 4242 4242 | Standard test card |
| Visa        | 4000 0000 0000 0002 | Declined card |
| Mastercard  | 5555 5555 5555 4444 | Standard test card |
| Mastercard  | 5105 1051 0510 5100 | Alternative test card |
| Amex        | 3782 822463 10005 | 15-digit format |
| Discover    | 6011 1111 1111 1117 | Standard test card |

- **Expiry:** Any future date (e.g., 12/28)
- **CVC:** Any 3 digits (4 for Amex)
- **Postal:** Any valid postal code (e.g., 12345)

## 🏗️ Architecture

### Component Structure

```
src/
├── payment-card-input.js    # Main Web Component
├── utils/
│   ├── validation.js        # Validation logic & Luhn algorithm
│   └── crypto.js            # Token generation utilities
server/
└── api.js                   # Mock API server
```

### Security

1. **Client-side tokenization** - Card data is tokenized before leaving the client
2. **No server storage** - Sensitive data never stored on your server
3. **Token-based payments** - Only tokens are transmitted
4. **HTTPS required** - Always use HTTPS in production

### Validation

- **Card Number:** Luhn algorithm + card type detection
- **Expiry Date:** Format validation + future date check
- **CVC:** Length validation based on card type
- **Postal Code:** Format validation

## ♿ Accessibility

- ✅ Full keyboard navigation
- ✅ ARIA labels and descriptions
- ✅ Screen reader announcements
- ✅ High contrast support
- ✅ Focus indicators
- ✅ Error announcements
- ✅ WCAG 2.1 AA compliant

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📦 Bundle Sizes

- ES Module: ~15KB (gzipped)
- UMD Bundle: ~18KB (gzipped)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start API server
npm run start:api
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Known Issues

- None currently. Please report any issues on GitHub.

## 🚀 Future Enhancements

- [ ] Support for more card types (UnionPay, Maestro)
- [ ] Billing address collection
- [ ] Multi-language support
- [ ] Apple Pay / Google Pay integration
- [ ] 3D Secure support
- [ ] Framework-specific wrappers (npm packages)

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

# adding a comment to trigger pr review ai bot, second time

Built with ❤️ using Web Components
