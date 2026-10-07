// Main App Coordinator
const Toast = {
  elem: null,
  timeout: null,

  init() {
    let t = document.getElementById('toast-notification');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast-notification';
      t.className = 'toast-notification';
      document.body.appendChild(t);
    }
    this.elem = t;
  },

  show(message, type = 'info') {
    if (!this.elem) this.init();
    clearTimeout(this.timeout);
    this.elem.className = `toast-notification ${type}`;
    this.elem.innerText = message;
    this.elem.style.display = 'block';

    this.timeout = setTimeout(() => {
      this.elem.style.display = 'none';
    }, 4000);
  }
};
window.Toast = Toast;

const App = {
  async init() {
    AppState.init();
    Toast.init();
    Mailbox.init();
    PaymentGateway.init();

    // Fetch Metadata
    try {
      const meta = await API.get('/metadata');
      AppState.metadata = meta;
    } catch (e) {
      console.warn('Failed to preload metadata:', e);
    }

    this.updateHeaderUser();
    this.bindEvents();
    Router.init();
  },

  updateHeaderUser() {
    const navRight = document.getElementById('header-nav-right');
    if (!navRight) return;

    if (AppState.user) {
      const isAdmin = AppState.user.role === 'admin' || AppState.user.role === 'superadmin';
      navRight.innerHTML = `
        <a href="#/search" class="nav-link" id="nav-search">Search Notes</a>
        ${isAdmin ? `
          <a href="#/admin/dashboard" class="nav-link" id="nav-admin-dashboard">Dashboard</a>
          <a href="#/admin/notes-under-review" class="nav-link" id="nav-admin-notes">Notes Under Review</a>
          <a href="#/admin/members" class="nav-link" id="nav-admin-members">Members</a>
        ` : `
          <a href="#/dashboard" class="nav-link" id="nav-dashboard">Dashboard</a>
          <a href="#/add-note" class="nav-link" id="nav-sell">Sell Your Notes</a>
        `}
        <a href="#/faq" class="nav-link" id="nav-faq">FAQ</a>
        <a href="#/contact" class="nav-link" id="nav-contact">Contact Us</a>

        <!-- Dark / Light Mode Switcher -->
        <button class="theme-toggle-btn" id="theme-toggle-btn" onclick="AppState.toggleTheme()">
          ${AppState.isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <!-- User Profile Dropdown -->
        <div class="user-menu-container">
          <button class="user-profile-btn" onclick="App.toggleUserDropdown()">
            <img src="${AppState.user.profilePicture || '/assets/images/avatar-richard.svg'}" alt="${AppState.user.firstName}">
          </button>
          <div class="user-dropdown" id="user-header-dropdown">
            <div style="padding:10px 18px; border-bottom:1px solid var(--border-color);">
              <strong style="display:block; font-size:13px;">${AppState.user.firstName} ${AppState.user.lastName}</strong>
              <small style="color:var(--text-muted); font-size:11px;">${AppState.user.email}</small>
            </div>
            ${isAdmin ? `
              <a href="#/admin/dashboard">Admin Dashboard</a>
              <a href="#/admin/notes-under-review">Notes Under Review</a>
              <a href="#/admin/members">Manage Members</a>
            ` : `
              <a href="#/dashboard">My Dashboard</a>
              <a href="#/add-note">Add New Note</a>
            `}
            <button onclick="App.logout()">Logout</button>
          </div>
        </div>
      `;
    } else {
      navRight.innerHTML = `
        <a href="#/search" class="nav-link" id="nav-search">Search Notes</a>
        <a href="#/login" class="nav-link" id="nav-sell">Sell Your Notes</a>
        <a href="#/faq" class="nav-link" id="nav-faq">FAQ</a>
        <a href="#/contact" class="nav-link" id="nav-contact">Contact Us</a>

        <!-- Dark / Light Mode Switcher -->
        <button class="theme-toggle-btn" id="theme-toggle-btn" onclick="AppState.toggleTheme()">
          ${AppState.isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        <a href="#/login" class="btn-header-login">Login</a>
      `;
    }
  },

  toggleUserDropdown() {
    const dropdown = document.getElementById('user-header-dropdown');
    if (dropdown) dropdown.classList.toggle('show');
  },

  logout() {
    AppState.clearUser();
    this.updateHeaderUser();
    Toast.show('Logged out successfully', 'info');
    window.location.hash = '/login';
  },

  bindEvents() {
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      const userMenu = document.querySelector('.user-menu-container');
      if (userMenu && !userMenu.contains(e.target)) {
        const dd = document.getElementById('user-header-dropdown');
        if (dd) dd.classList.remove('show');
      }

      if (!e.target.closest('.action-dropdown-wrapper')) {
        document.querySelectorAll('.action-menu').forEach(m => m.classList.remove('show'));
      }
    });
  },

  renderFaq(container) {
    container.innerHTML = `
      <div class="search-banner">
        <h1 class="search-banner-title">Frequently Asked Questions</h1>
      </div>
      <div class="container" style="max-width:850px; padding:50px 20px;">
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div class="filter-panel-card">
            <h3 style="color:var(--primary-color); font-size:16px; margin-bottom:8px;">What is NotesMarketPlace?</h3>
            <p style="font-size:13.5px; color:var(--text-muted);">NotesMarketPlace is an online platform for students and educators to upload, discover, download and sell academic notes and study material.</p>
          </div>
          <div class="filter-panel-card">
            <h3 style="color:var(--primary-color); font-size:16px; margin-bottom:8px;">How do I sell my notes?</h3>
            <p style="font-size:13.5px; color:var(--text-muted);">Create an account, click on "Sell Your Notes" or "Add Notes", fill in the book details, choose whether it is Free or Paid, set your price, and submit for Admin review.</p>
          </div>
          <div class="filter-panel-card">
            <h3 style="color:var(--primary-color); font-size:16px; margin-bottom:8px;">How does the Simulated Payment Gateway work?</h3>
            <p style="font-size:13.5px; color:var(--text-muted);">For any paid note, clicking Download opens our simulated payment gateway where you can pay using mock Card, UPI, or NetBanking to immediately unlock and download the notes.</p>
          </div>
          <div class="filter-panel-card">
            <h3 style="color:var(--primary-color); font-size:16px; margin-bottom:8px;">Where do registration and notification emails go?</h3>
            <p style="font-size:13.5px; color:var(--text-muted);">All system emails are delivered in real time to the floating "Simulated Mailbox" widget at the bottom right of your screen. You can click on any email to view and click verification links.</p>
          </div>
        </div>
      </div>
    `;
  },

  renderContact(container) {
    container.innerHTML = `
      <div class="search-banner">
        <h1 class="search-banner-title">Contact Us</h1>
      </div>
      <div class="container" style="max-width:750px; padding:50px 20px;">
        <div class="auth-card" style="text-align:left;">
          <h2 class="auth-title" style="margin-bottom:8px;">Get in Touch</h2>
          <p class="auth-subtitle">Let us know how to get back to you</p>
          <form onsubmit="App.handleContact(event)">
            <div class="form-row-2">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" class="form-control" id="c-name" placeholder="Enter your name" required>
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" class="form-control" id="c-email" placeholder="Enter your email" required>
              </div>
            </div>
            <div class="form-group">
              <label>Subject *</label>
              <input type="text" class="form-control" id="c-subject" placeholder="Enter subject" required>
            </div>
            <div class="form-group">
              <label>Comments / Questions *</label>
              <textarea class="form-control" id="c-msg" placeholder="Write your message here..." required></textarea>
            </div>
            <button type="submit" class="btn-purple" style="margin-top:10px;">SUBMIT</button>
          </form>
        </div>
      </div>
    `;
  },

  handleContact(e) {
    e.preventDefault();
    Toast.show('Thank you! Your message has been sent to our support team.', 'success');
    e.target.reset();
  },

  downloadNote(noteId) {
    const tokenQuery = AppState.token ? `?token=${encodeURIComponent(AppState.token)}` : '';
    window.location.href = `/api/notes/${noteId}/download${tokenQuery}`;
  }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
