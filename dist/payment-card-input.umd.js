(function(n,l){typeof exports=="object"&&typeof module<"u"?module.exports=l():typeof define=="function"&&define.amd?define(l):(n=typeof globalThis<"u"?globalThis:n||self,n.PaymentCardInput=l())})(this,function(){"use strict";const n={visa:/^4[0-9]{12}(?:[0-9]{3})?$/,mastercard:/^5[1-5][0-9]{14}$/,amex:/^3[47][0-9]{13}$/,discover:/^6(?:011|5[0-9]{2})[0-9]{12}$/,diners:/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,jcb:/^(?:2131|1800|35\d{3})\d{11}$/};function l(a){if(!a||typeof a!="string")return!1;const e=a.replace(/\D/g,"");if(e.length<13||e.length>19)return!1;let t=0,r=!1;for(let s=e.length-1;s>=0;s--){let i=parseInt(e[s],10);r&&(i*=2,i>9&&(i-=9)),t+=i,r=!r}return t%10===0}function d(a){if(!a)return null;const e=a.replace(/\D/g,"");for(const[t,r]of Object.entries(n))if(r.test(e))return t;return e.startsWith("4")?"visa":/^5[1-5]/.test(e)?"mastercard":/^3[47]/.test(e)?"amex":/^6(?:011|5)/.test(e)?"discover":null}function v(a){if(!a)return{valid:!1,error:"Card number is required"};const e=a.replace(/\D/g,"");if(e.length<13)return{valid:!1,error:"Card number is too short"};if(e.length>19)return{valid:!1,error:"Card number is too long"};const t=d(a);return t==="amex"&&e.length!==15?{valid:!1,error:"Amex cards must be 15 digits"}:(t==="visa"||t==="mastercard"||t==="discover")&&(e.length<16||e.length>16)?{valid:!1,error:"Card number must be 16 digits"}:l(a)?{valid:!0,cardType:t||"unknown"}:{valid:!1,error:"Invalid card number (check digit failed)"}}function m(a){if(!a)return{valid:!1,error:"Expiration date is required"};const e=a.replace(/\D/g,"");if(e.length!==4)return{valid:!1,error:"Invalid format (use MM/YY)"};const t=parseInt(e.substring(0,2),10),r=parseInt(e.substring(2,4),10);if(t<1||t>12)return{valid:!1,error:"Invalid month"};const s=new Date,i=s.getFullYear()%100,o=s.getMonth()+1;return r<i||r===i&&t<o?{valid:!1,error:"Card has expired"}:{valid:!0}}function f(a,e=null){if(!a)return{valid:!1,error:"CVC is required"};const t=a.replace(/\D/g,""),r=e==="amex"?4:3;return t.length!==r?{valid:!1,error:`CVC must be ${r} digits`}:{valid:!0}}function g(a){if(!a)return{valid:!1,error:"Postal code is required"};const e=a.trim();return e.length<3?{valid:!1,error:"Postal code is too short"}:e.length>10?{valid:!1,error:"Postal code is too long"}:{valid:!0}}function b(a,e=null){var r,s;const t=a.replace(/\D/g,"");return e==="amex"?((r=t.substring(0,15).match(/.{1,4}/g))==null?void 0:r.join(" "))||"":((s=t.substring(0,16).match(/.{1,4}/g))==null?void 0:s.join(" "))||""}function y(a){const e=a.replace(/\D/g,"");return e.length>=2?e.substring(0,2)+"/"+e.substring(2,4):e}function x(a){const e=a.replace(/\D/g,"");return e.substring(e.length-4)}async function C(a){const e={timestamp:Date.now(),last4:a.cardNumber.replace(/\D/g,"").slice(-4),cardType:a.cardType,expiryMonth:a.expiry.substring(0,2),expiryYear:a.expiry.substring(3,5)},t=JSON.stringify(e);return{token:`tok_${btoa(t).substring(0,32)}`,metadata:{cardType:a.cardType,last4:e.last4,expiryMonth:e.expiryMonth,expiryYear:e.expiryYear}}}const c=document.createElement("template");c.innerHTML=`
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
`;const p={visa:"💳",mastercard:"💳",amex:"💳",discover:"💳",diners:"💳",jcb:"💳"};class u extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(c.content.cloneNode(!0)),this.state={cardNumber:"",expiryDate:"",cvc:"",postalCode:"",cardType:null,errors:{cardNumber:null,expiryDate:null,cvc:null,postalCode:null},touched:{cardNumber:!1,expiryDate:!1,cvc:!1,postalCode:!1},isValid:!1},this.tokenizationEndpoint="http://localhost:3000/api/tokenize",this.paymentEndpoint="http://localhost:3000/api/payments"}connectedCallback(){this.setupEventListeners(),this.announceToScreenReader("Payment form loaded and ready")}setupEventListeners(){const e=this.shadowRoot.getElementById("card-number"),t=this.shadowRoot.getElementById("expiry-date"),r=this.shadowRoot.getElementById("cvc"),s=this.shadowRoot.getElementById("postal-code");e.addEventListener("input",i=>this.handleCardNumberInput(i)),e.addEventListener("blur",()=>this.handleBlur("cardNumber")),t.addEventListener("input",i=>this.handleExpiryInput(i)),t.addEventListener("blur",()=>this.handleBlur("expiryDate")),r.addEventListener("input",i=>this.handleCVCInput(i)),r.addEventListener("blur",()=>this.handleBlur("cvc")),s.addEventListener("input",i=>this.handlePostalInput(i)),s.addEventListener("blur",()=>this.handleBlur("postalCode"))}handleCardNumberInput(e){const t=e.target;let r=t.value.replace(/\s/g,"");const s=d(r);this.state.cardType=s;const i=b(r,s);t.value=i,this.state.cardNumber=i,this.updateCardTypeIcon(s),this.validateField("cardNumber"),this.updateValidationState(),this.emitValidationChange()}handleExpiryInput(e){const t=e.target,r=y(t.value);t.value=r,this.state.expiryDate=r,this.validateField("expiryDate"),this.updateValidationState(),this.emitValidationChange()}handleCVCInput(e){const t=e.target,r=t.value.replace(/\D/g,""),s=this.state.cardType==="amex"?4:3;t.value=r.substring(0,s),this.state.cvc=t.value,this.validateField("cvc"),this.updateValidationState(),this.emitValidationChange()}handlePostalInput(e){const t=e.target;this.state.postalCode=t.value.trim(),this.validateField("postalCode"),this.updateValidationState(),this.emitValidationChange()}handleBlur(e){this.state.touched[e]=!0,this.updateFieldUI(e)}validateField(e){let t;switch(e){case"cardNumber":t=v(this.state.cardNumber);break;case"expiryDate":t=m(this.state.expiryDate);break;case"cvc":t=f(this.state.cvc,this.state.cardType);break;case"postalCode":t=g(this.state.postalCode);break}this.state.errors[e]=t.valid?null:t.error,this.state.touched[e]&&this.updateFieldUI(e)}updateFieldUI(e){const r={cardNumber:"card-number",expiryDate:"expiry-date",cvc:"cvc",postalCode:"postal-code"}[e],s=this.shadowRoot.getElementById(r),i=this.shadowRoot.getElementById(`${r}-error`),o=s.parentElement.querySelector(".validation-icon"),h=this.state.errors[e],w=this.state[e].length>0;s.classList.remove("valid","invalid"),o&&(o.classList.remove("valid","invalid"),o.textContent=""),w&&this.state.touched[e]?h?(s.classList.add("invalid"),s.setAttribute("aria-invalid","true"),i.textContent=h,i.classList.add("show"),o&&(o.classList.add("invalid"),o.textContent="✕")):(s.classList.add("valid"),s.setAttribute("aria-invalid","false"),i.textContent="",i.classList.remove("show"),o&&(o.classList.add("valid"),o.textContent="✓")):(s.setAttribute("aria-invalid","false"),i.textContent="",i.classList.remove("show"))}updateCardTypeIcon(e){const t=this.shadowRoot.querySelector(".card-type-icon");e&&p[e]?t.textContent=p[e]:t.textContent=""}updateValidationState(){const e=Object.values(this.state.errors).every(r=>r===null),t=this.state.cardNumber&&this.state.expiryDate&&this.state.cvc&&this.state.postalCode;this.state.isValid=e&&t}emitValidationChange(){this.dispatchEvent(new CustomEvent("validation-change",{detail:{isValid:this.state.isValid,errors:{...this.state.errors}},bubbles:!0,composed:!0}))}announceToScreenReader(e){const t=this.shadowRoot.getElementById("status-message");t&&(t.textContent=e)}async generateToken(){try{const e=await C({cardNumber:this.state.cardNumber,expiry:this.state.expiryDate,cvc:this.state.cvc,postalCode:this.state.postalCode,cardType:this.state.cardType});return this.dispatchEvent(new CustomEvent("token-generated",{detail:e,bubbles:!0,composed:!0})),e.token}catch(e){throw this.dispatchEvent(new CustomEvent("error",{detail:{type:"tokenization",message:e.message},bubbles:!0,composed:!0})),e}}async processPayment(e,t="USD"){if(!this.state.isValid)throw Object.keys(this.state.touched).forEach(r=>{this.state.touched[r]=!0,this.updateFieldUI(r)}),new Error("Please fill in all required fields correctly");try{const r=await this.generateToken(),i=await(await fetch(this.paymentEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:r,amount:e,currency:t})})).json();return this.dispatchEvent(new CustomEvent("payment-complete",{detail:i,bubbles:!0,composed:!0})),i.success?this.announceToScreenReader("Payment successful"):this.announceToScreenReader("Payment failed"),i}catch(r){throw this.dispatchEvent(new CustomEvent("error",{detail:{type:"payment",message:r.message},bubbles:!0,composed:!0})),r}}reset(){this.state={cardNumber:"",expiryDate:"",cvc:"",postalCode:"",cardType:null,errors:{cardNumber:null,expiryDate:null,cvc:null,postalCode:null},touched:{cardNumber:!1,expiryDate:!1,cvc:!1,postalCode:!1},isValid:!1},this.shadowRoot.getElementById("card-number").value="",this.shadowRoot.getElementById("expiry-date").value="",this.shadowRoot.getElementById("cvc").value="",this.shadowRoot.getElementById("postal-code").value="",Object.keys(this.state.touched).forEach(e=>{this.updateFieldUI(e)}),this.updateCardTypeIcon(null),this.emitValidationChange(),this.announceToScreenReader("Form reset")}getState(){return{isValid:this.state.isValid,errors:{...this.state.errors},cardType:this.state.cardType,last4:this.state.cardNumber?x(this.state.cardNumber):null}}}return customElements.define("payment-card-input",u),u});
