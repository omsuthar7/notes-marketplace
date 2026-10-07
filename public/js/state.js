// Global Application State Management
const AppState = {
  user: null,
  token: null,
  isDarkMode: false,
  metadata: {
    categories: [],
    noteTypes: [],
    countries: []
  },
  unreadEmails: 0,

  init() {
    this.token = localStorage.getItem('nm_token') || sessionStorage.getItem('nm_token');
    const storedUser = localStorage.getItem('nm_user') || sessionStorage.getItem('nm_user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (e) {
        this.user = null;
      }
    }

    const savedTheme = localStorage.getItem('nm_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.setTheme(true);
    } else {
      this.setTheme(false);
    }
  },

  setUser(user, token, rememberMe = false) {
    this.user = user;
    this.token = token;
    if (rememberMe) {
      localStorage.setItem('nm_token', token);
      localStorage.setItem('nm_user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('nm_token', token);
      sessionStorage.setItem('nm_user', JSON.stringify(user));
    }
  },

  clearUser() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('nm_token');
    localStorage.removeItem('nm_user');
    sessionStorage.removeItem('nm_token');
    sessionStorage.removeItem('nm_user');
  },

  setTheme(isDark) {
    this.isDarkMode = isDark;
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('nm_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('nm_theme', 'light');
    }
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
    }
  },

  toggleTheme() {
    this.setTheme(!this.isDarkMode);
  }
};

window.AppState = AppState;
