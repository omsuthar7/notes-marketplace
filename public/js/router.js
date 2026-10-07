// Client-side Hash Router
const Router = {
  routes: {},

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    let hash = window.location.hash.slice(1) || '/';
    const [pathPart, queryPart] = hash.split('?');
    const queryParams = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // Close any open popups/menus
    document.querySelectorAll('.user-dropdown, .action-menu').forEach(el => el.classList.remove('show'));

    // Route matching
    if (pathPart === '/' || pathPart === '/home') {
      this.setActiveNav('nav-home');
      NotesView.renderHome(appContainer);
    } else if (pathPart === '/search') {
      this.setActiveNav('nav-search');
      NotesView.renderSearch(appContainer);
    } else if (pathPart.startsWith('/notes/')) {
      const noteId = pathPart.split('/')[2];
      this.setActiveNav('nav-search');
      NotesView.renderDetails(appContainer, noteId);
    } else if (pathPart === '/login') {
      this.setActiveNav('nav-login');
      AuthView.renderLogin(appContainer);
    } else if (pathPart === '/register') {
      this.setActiveNav('nav-register');
      AuthView.renderRegister(appContainer);
    } else if (pathPart === '/verify-email') {
      this.setActiveNav('');
      AuthView.renderVerifyEmail(appContainer, queryParams);
    } else if (pathPart === '/forgot-password') {
      this.setActiveNav('');
      AuthView.renderForgotPassword(appContainer);
    } else if (pathPart === '/reset-password') {
      this.setActiveNav('');
      AuthView.renderResetPassword(appContainer, queryParams);
    } else if (pathPart === '/dashboard') {
      this.setActiveNav('nav-dashboard');
      NotesView.renderDashboard(appContainer);
    } else if (pathPart === '/add-note') {
      this.setActiveNav('nav-sell');
      NotesView.renderAddNote(appContainer);
    } else if (pathPart === '/admin/dashboard') {
      this.setActiveNav('nav-admin-dashboard');
      AdminView.renderDashboard(appContainer);
    } else if (pathPart === '/admin/notes-under-review') {
      this.setActiveNav('nav-admin-notes');
      AdminView.renderNotesUnderReview(appContainer);
    } else if (pathPart.startsWith('/admin/member-details/')) {
      const memberId = pathPart.split('/')[3];
      this.setActiveNav('nav-admin-members');
      AdminView.renderMemberDetails(appContainer, memberId);
    } else if (pathPart === '/admin/members') {
      this.setActiveNav('nav-admin-members');
      AdminView.renderMembersList(appContainer);
    } else if (pathPart === '/faq') {
      this.setActiveNav('nav-faq');
      App.renderFaq(appContainer);
    } else if (pathPart === '/contact') {
      this.setActiveNav('nav-contact');
      App.renderContact(appContainer);
    } else {
      // Default fallback
      NotesView.renderHome(appContainer);
    }

    // Toggle header appearance for Auth pages vs standard pages
    const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(pathPart);
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.site-footer');
    if (header) header.style.display = isAuthPage ? 'none' : 'block';
    if (footer) footer.style.display = isAuthPage ? 'none' : 'block';

    window.scrollTo(0, 0);
  },

  setActiveNav(navId) {
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    if (navId) {
      const activeEl = document.getElementById(navId);
      if (activeEl) activeEl.classList.add('active');
    }
  }
};

window.Router = Router;
