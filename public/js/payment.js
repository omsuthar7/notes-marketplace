// Simulated Payment Gateway Component
const PaymentGateway = {
  currentNote: null,
  activeMethod: 'card',

  init() {
    this.createDomElements();
  },

  createDomElements() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'payment-modal-overlay';
    modal.innerHTML = `
      <div class="payment-modal-card">
        <div class="modal-header">
          <h3>Secure Payment Gateway</h3>
          <button class="btn-modal-close" id="close-payment-modal">&times;</button>
        </div>
        <div class="payment-modal-body" id="payment-modal-body">
          <!-- Dynamically filled -->
        </div>
      </div>
    `;

    modal.querySelector('#close-payment-modal').addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    document.body.appendChild(modal);
    this.modalElem = modal;
  },

  open(note) {
    if (!AppState.user) {
      Toast.show('Please log in to purchase notes.', 'error');
      window.location.hash = '/login';
      return;
    }

    this.currentNote = note;
    this.activeMethod = 'card';
    this.renderForm();
    this.modalElem.classList.add('active');
  },

  close() {
    this.modalElem.classList.remove('active');
  },

  renderForm() {
    const body = document.getElementById('payment-modal-body');
    body.innerHTML = `
      <div class="payment-order-summary">
        <div>
          <div class="payment-summary-title">${this.currentNote.title}</div>
          <small style="color:var(--text-muted)">Author: ${this.currentNote.seller_name || 'Academic Author'}</small>
        </div>
        <div class="payment-summary-price">$${this.currentNote.price}</div>
      </div>

      <div class="payment-methods-tabs">
        <button class="payment-tab-btn ${this.activeMethod === 'card' ? 'active' : ''}" onclick="PaymentGateway.setMethod('card')">💳 Credit / Debit</button>
        <button class="payment-tab-btn ${this.activeMethod === 'upi' ? 'active' : ''}" onclick="PaymentGateway.setMethod('upi')">📱 UPI / QR</button>
        <button class="payment-tab-btn ${this.activeMethod === 'netbanking' ? 'active' : ''}" onclick="PaymentGateway.setMethod('netbanking')">🏦 Net Banking</button>
      </div>

      <div id="payment-method-fields">
        ${this.getMethodFieldsHtml()}
      </div>

      <div style="margin-top: 24px;">
        <button class="btn-purple" style="width: 100%; height: 44px;" id="btn-pay-now" onclick="PaymentGateway.processPayment()">
          PAY $${this.currentNote.price} NOW
        </button>
      </div>

      <div style="text-align: center; margin-top: 14px; font-size: 11.5px; color: var(--text-muted);">
        🔒 256-bit Simulated Secure Checkout &bull; NotesMarketplace Sandbox
      </div>
    `;
  },

  setMethod(method) {
    this.activeMethod = method;
    this.renderForm();
  },

  getMethodFieldsHtml() {
    if (this.activeMethod === 'card') {
      return `
        <div class="form-group">
          <label>Cardholder Name</label>
          <input type="text" class="form-control" id="pay-name" placeholder="Name on card" value="${AppState.user ? AppState.user.firstName + ' ' + AppState.user.lastName : 'John Doe'}">
        </div>
        <div class="form-group">
          <label>Card Number</label>
          <input type="text" class="form-control" id="pay-card" placeholder="4532 8920 1124 9901" maxlength="19" value="4532 8920 1124 9901">
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Expiry Date</label>
            <input type="text" class="form-control" id="pay-exp" placeholder="MM/YY" maxlength="5" value="12/28">
          </div>
          <div class="form-group">
            <label>CVV / CVC</label>
            <input type="password" class="form-control" id="pay-cvv" placeholder="123" maxlength="3" value="888">
          </div>
        </div>
      `;
    } else if (this.activeMethod === 'upi') {
      return `
        <div style="text-align: center; padding: 15px 0;">
          <div style="display: inline-block; padding: 15px; background: white; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 15px;">
            <svg width="140" height="140" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="#ffffff" />
              <path d="M10 10 h30 v30 h-30 z M15 15 v20 h20 v-20 z M20 20 h10 v10 h-10 z" fill="#000" />
              <path d="M60 10 h30 v30 h-30 z M65 15 v20 h20 v-20 z M70 20 h10 v10 h-10 z" fill="#000" />
              <path d="M10 60 h30 v30 h-30 z M15 65 v20 h20 v-20 z M20 70 h10 v10 h-10 z" fill="#000" />
              <rect x="50" y="50" width="10" height="10" fill="#000" />
              <rect x="65" y="65" width="20" height="10" fill="#000" />
              <rect x="80" y="50" width="10" height="10" fill="#000" />
              <rect x="50" y="80" width="20" height="10" fill="#000" />
            </svg>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">Scan QR with Google Pay, PhonePe or Paytm</p>
          <div class="form-group">
            <label>Or enter UPI ID</label>
            <input type="text" class="form-control" id="pay-upi" placeholder="yourname@okhdfcbank" value="student@okhdfcbank">
          </div>
        </div>
      `;
    } else {
      return `
        <div class="form-group">
          <label>Select Your Bank</label>
          <select class="form-control" id="pay-bank">
            <option>State Bank of India (SBI)</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Bank of Baroda</option>
            <option>Citibank</option>
          </select>
        </div>
        <p style="font-size: 12.5px; color: var(--text-muted);">You will be redirected to the secure bank portal simulation to approve payment.</p>
      `;
    }
  },

  async processPayment() {
    const payBtn = document.getElementById('btn-pay-now');
    payBtn.disabled = true;
    payBtn.innerHTML = `⏳ Processing Transaction...`;

    try {
      // Simulate real bank delay
      await new Promise(r => setTimeout(r, 1200));

      const res = await API.post('/payments/charge', {
        noteId: this.currentNote.id,
        paymentMethod: this.activeMethod.toUpperCase()
      });

      // Show Success State inside modal
      const body = document.getElementById('payment-modal-body');
      body.innerHTML = `
        <div style="text-align: center; padding: 25px 10px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background-color: rgba(40, 167, 69, 0.15); color: #28a745; font-size: 32px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            ✓
          </div>
          <h3 style="color: #28a745; margin-bottom: 8px;">Payment Successful!</h3>
          <p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 18px;">
            Transaction ID: <strong>${res.transactionId}</strong><br>
            Receipt and confirmation sent to your Simulated Mailbox!
          </p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn-purple" onclick="PaymentGateway.triggerDownload(${this.currentNote.id})">
              📥 DOWNLOAD NOTE NOW
            </button>
            <button class="btn-outline-purple" onclick="PaymentGateway.close()">
              Close
            </button>
          </div>
        </div>
      `;

      // Refresh emails badge immediately
      Mailbox.fetchEmails();
      Toast.show('Payment processed! Note unlocked for download.', 'success');

    } catch (err) {
      payBtn.disabled = false;
      payBtn.innerHTML = `PAY $${this.currentNote.price} NOW`;
      Toast.show(err.message || 'Payment transaction failed', 'error');
    }
  },

  triggerDownload(noteId) {
    const tokenParam = AppState.token ? `?token=${encodeURIComponent(AppState.token)}` : '';
    window.location.href = `/api/notes/${noteId}/download${tokenParam}`;
    this.close();
  }
};

window.PaymentGateway = PaymentGateway;
