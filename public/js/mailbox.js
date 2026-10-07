// Simulated Mailbox Client-side Component
const Mailbox = {
  drawerOverlay: null,
  badgeElem: null,
  activeEmailId: null,

  init() {
    this.createDomElements();
    this.fetchEmails();
    // Poll emails periodically
    setInterval(() => this.fetchEmails(), 10000);
  },

  createDomElements() {
    // Floating Button
    const btn = document.createElement('div');
    btn.className = 'floating-mailbox-trigger';
    btn.id = 'floating-mailbox-btn';
    btn.innerHTML = `
      <span>📬 Mailbox</span>
      <span class="mailbox-badge" id="mailbox-unread-badge" style="display: none;">0</span>
    `;
    btn.addEventListener('click', () => this.openDrawer());
    document.body.appendChild(btn);

    // Side Drawer Overlay
    const overlay = document.createElement('div');
    overlay.className = 'mailbox-drawer-overlay';
    overlay.id = 'mailbox-drawer-overlay';
    overlay.innerHTML = `
      <div class="mailbox-drawer">
        <div class="drawer-header">
          <h3>📬 Simulated Inbox</h3>
          <button class="btn-modal-close" id="close-mailbox-drawer">&times;</button>
        </div>
        <div class="drawer-body" id="mailbox-drawer-body">
          <div class="email-list-view" id="mailbox-email-list">
            <p style="text-align:center; color:var(--text-muted); padding:30px;">Loading emails...</p>
          </div>
        </div>
      </div>
    `;

    overlay.querySelector('#close-mailbox-drawer').addEventListener('click', () => this.closeDrawer());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeDrawer();
    });

    document.body.appendChild(overlay);
    this.drawerOverlay = overlay;
    this.badgeElem = document.getElementById('mailbox-unread-badge');
  },

  async fetchEmails() {
    try {
      const data = await API.get('/emails');
      AppState.unreadEmails = data.unreadCount;
      if (this.badgeElem) {
        if (data.unreadCount > 0) {
          this.badgeElem.innerText = data.unreadCount;
          this.badgeElem.style.display = 'inline-block';
        } else {
          this.badgeElem.style.display = 'none';
        }
      }
      this.emails = data.emails;
      if (this.isOpen() && !this.activeEmailId) {
        this.renderEmailList();
      }
    } catch (err) {
      console.warn('Mailbox fetch error:', err);
    }
  },

  openDrawer() {
    this.drawerOverlay.classList.add('open');
    this.activeEmailId = null;
    this.fetchEmails().then(() => this.renderEmailList());
  },

  closeDrawer() {
    this.drawerOverlay.classList.remove('open');
  },

  isOpen() {
    return this.drawerOverlay && this.drawerOverlay.classList.contains('open');
  },

  renderEmailList() {
    const listContainer = document.getElementById('mailbox-drawer-body');
    if (!this.emails || this.emails.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 36px; margin-bottom: 10px;">📭</div>
          <p>No simulated emails yet.</p>
          <small>System notifications and verification emails will appear here.</small>
        </div>
      `;
      return;
    }

    let html = `<div class="email-list-view">`;
    for (const em of this.emails) {
      const isUnread = em.is_read === 0;
      const dateStr = new Date(em.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
      html += `
        <div class="email-item-card ${isUnread ? 'unread' : ''}" onclick="Mailbox.viewEmail(${em.id})">
          <div class="email-item-sender">
            <span>To: ${em.recipient_name || em.recipient_email}</span>
            <span class="email-item-time">${dateStr}</span>
          </div>
          <div class="email-item-subject">${em.subject}</div>
          <div class="email-item-preview">Click to view email message content...</div>
        </div>
      `;
    }
    html += `</div>`;
    listContainer.innerHTML = html;
  },

  async viewEmail(id) {
    this.activeEmailId = id;
    try {
      const { email } = await API.get(`/emails/${id}`);
      this.fetchEmails(); // Refresh unread count

      const listContainer = document.getElementById('mailbox-drawer-body');
      listContainer.innerHTML = `
        <div class="email-detail-view">
          <button class="btn-back-to-inbox" onclick="Mailbox.renderEmailList(); Mailbox.activeEmailId = null;">
            &larr; Back to Inbox
          </button>
          <div class="email-detail-content">
            <div style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
              <h4 style="font-size: 16px; color: var(--text-heading); margin-bottom: 4px;">${email.subject}</h4>
              <div style="font-size: 12px; color: var(--text-muted);">
                <strong>To:</strong> ${email.recipient_name} &lt;${email.recipient_email}&gt;<br>
                <strong>Date:</strong> ${new Date(email.created_at).toLocaleString()}
              </div>
            </div>
            <div class="email-html-body" style="background: #ffffff; color: #333333; padding: 15px; border-radius: 4px;">
              ${email.body_html}
            </div>
          </div>
        </div>
      `;

      // Intercept any internal links inside email to close drawer and navigate smoothly
      listContainer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            this.closeDrawer();
            window.location.hash = href.replace(/^#/, '');
          }
        });
      });
    } catch (err) {
      console.error('Failed to view email:', err);
    }
  }
};

window.Mailbox = Mailbox;
