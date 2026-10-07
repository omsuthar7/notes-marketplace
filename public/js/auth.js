// Authentication Views & Form Handlers
const AuthView = {
  // Toggle password input visibility
  togglePassword(inputId, iconElem) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      iconElem.innerHTML = '👁️';
    } else {
      input.type = 'password';
      iconElem.innerHTML = '👁️‍🗨️';
    }
  },

  // 1. Render Login Screen (Screenshot 1)
  renderLogin(container) {
    container.innerHTML = `
      <div class="auth-page-wrapper">
        <div class="auth-card-container">
          <div class="auth-logo-header">
            <a href="#/"><img src="/assets/images/logo-white.svg" alt="Notes MarketPlace"></a>
          </div>
          <div class="auth-card">
            <h2 class="auth-title">Login</h2>
            <p class="auth-subtitle">Enter your email address and password to login</p>
            
            <form id="form-login" onsubmit="AuthView.handleLogin(event)">
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" id="login-email" placeholder="Enter your email" value="notesmarketplace77@gmail.com" required>
              </div>

              <div class="form-group">
                <div class="auth-input-header">
                  <label>Password</label>
                  <a href="#/forgot-password" class="auth-forgot-link">Forgot Password?</a>
                </div>
                <div class="input-password-wrapper">
                  <input type="password" class="form-control" id="login-password" placeholder="Enter your password" value="Password@123" required>
                  <button type="button" class="password-toggle-eye" onclick="AuthView.togglePassword('login-password', this)">👁️‍🗨️</button>
                </div>
                <div id="login-error-msg" class="auth-error-msg" style="display: none;"></div>
              </div>

              <div class="auth-remember-row">
                <input type="checkbox" id="login-remember" checked>
                <label for="login-remember" style="margin-bottom:0; cursor:pointer;">Remember Me</label>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-login-submit">LOGIN</button>

              <div class="auth-footer-prompt">
                Don't have an account? <a href="#/register">Sign Up</a>
              </div>
            </form>

            <!-- Quick Demo Credentials Selector -->
            <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed var(--border-color); font-size: 11.5px; color: var(--text-muted);">
              <strong>Quick Demo Logins:</strong><br>
              <a href="javascript:void(0)" onclick="AuthView.fillDemo('notesmarketplace77@gmail.com', 'Password@123')" style="color:var(--primary-color);">Member (John)</a> &bull;
              <a href="javascript:void(0)" onclick="AuthView.fillDemo('richardbrown77@gmail.com', 'Password@123')" style="color:var(--primary-color);">Member (Richard Brown)</a> &bull;
              <a href="javascript:void(0)" onclick="AuthView.fillDemo('admin@notesmarketplace.com', 'Admin@123')" style="color:var(--primary-color);">Admin</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  fillDemo(email, pass) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = pass;
  },

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('login-remember').checked;
    const errorDiv = document.getElementById('login-error-msg');
    const submitBtn = document.getElementById('btn-login-submit');

    errorDiv.style.display = 'none';
    submitBtn.innerText = 'LOGGING IN...';
    submitBtn.disabled = true;

    try {
      const res = await API.post('/auth/login', { email, password, rememberMe });
      AppState.setUser(res.user, res.token, rememberMe);
      App.updateHeaderUser();
      Toast.show(`Welcome back, ${res.user.firstName}!`, 'success');

      if (res.user.role === 'admin' || res.user.role === 'superadmin') {
        window.location.hash = '/admin/dashboard';
      } else {
        window.location.hash = '/dashboard';
      }
    } catch (err) {
      errorDiv.innerText = `*${err.message || 'The password that you entered is incorrect'}`;
      errorDiv.style.display = 'block';
      submitBtn.innerText = 'LOGIN';
      submitBtn.disabled = false;
    }
  },

  // 2. Render Register Screen (Screenshot 2)
  renderRegister(container) {
    container.innerHTML = `
      <div class="auth-page-wrapper">
        <div class="auth-card-container">
          <div class="auth-logo-header">
            <a href="#/"><img src="/assets/images/logo-white.svg" alt="Notes MarketPlace"></a>
          </div>
          <div class="auth-card">
            <h2 class="auth-title">Create an Account</h2>
            <p class="auth-subtitle">Enter your details to signup</p>
            
            <div id="register-success-badge" class="auth-success-badge" style="display: none;">
              <span>✔</span> Your account has been successfully created.
            </div>

            <form id="form-register" onsubmit="AuthView.handleRegister(event)">
              <div class="form-group">
                <label>First Name <span class="required-star">*</span></label>
                <input type="text" class="form-control" id="reg-fname" placeholder="Enter your first name" value="John" required>
              </div>

              <div class="form-group">
                <label>Last Name <span class="required-star">*</span></label>
                <input type="text" class="form-control" id="reg-lname" placeholder="Enter your last name" value="Doe" required>
              </div>

              <div class="form-group">
                <label>Email <span class="required-star">*</span></label>
                <input type="email" class="form-control" id="reg-email" placeholder="Enter your email address" value="john.student@example.com" required>
              </div>

              <div class="form-group">
                <label>Password <span class="required-star">*</span></label>
                <div class="input-password-wrapper">
                  <input type="password" class="form-control" id="reg-password" placeholder="Enter your password" value="Student@123" required>
                  <button type="button" class="password-toggle-eye" onclick="AuthView.togglePassword('reg-password', this)">👁️‍🗨️</button>
                </div>
              </div>

              <div class="form-group">
                <label>Confirm Password <span class="required-star">*</span></label>
                <div class="input-password-wrapper">
                  <input type="password" class="form-control" id="reg-cpassword" placeholder="Re-enter your password" value="Student@123" required>
                  <button type="button" class="password-toggle-eye" onclick="AuthView.togglePassword('reg-cpassword', this)">👁️‍🗨️</button>
                </div>
                <div id="reg-error-msg" class="auth-error-msg" style="display: none;"></div>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-reg-submit" style="margin-top: 15px;">SIGN UP</button>

              <div class="auth-footer-prompt">
                Already have an account? <a href="#/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById('reg-fname').value;
    const lastName = document.getElementById('reg-lname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const cpassword = document.getElementById('reg-cpassword').value;
    const errorDiv = document.getElementById('reg-error-msg');
    const successBadge = document.getElementById('register-success-badge');
    const submitBtn = document.getElementById('btn-reg-submit');

    errorDiv.style.display = 'none';

    if (password !== cpassword) {
      errorDiv.innerText = '*Passwords do not match.';
      errorDiv.style.display = 'block';
      return;
    }

    submitBtn.innerText = 'CREATING ACCOUNT...';
    submitBtn.disabled = true;

    try {
      const res = await API.post('/auth/register', { firstName, lastName, email, password });
      successBadge.style.display = 'flex';
      submitBtn.innerText = 'SIGN UP';
      submitBtn.disabled = false;

      // Update Simulated Mailbox immediately
      Mailbox.fetchEmails();
      Toast.show('Account created! Verification email delivered to Simulated Mailbox.', 'success');

      // Scroll up to see the success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      errorDiv.innerText = `*${err.message || 'Registration failed'}`;
      errorDiv.style.display = 'block';
      submitBtn.innerText = 'SIGN UP';
      submitBtn.disabled = false;
    }
  },

  // 3. Render Email Verification Page (Manual Page 51)
  async renderVerifyEmail(container, queryParams) {
    const token = queryParams.token;
    let statusHtml = '<p style="color:var(--text-muted);">Verifying your account...</p>';

    container.innerHTML = `
      <div class="auth-page-wrapper">
        <div class="auth-card-container">
          <div class="auth-card" style="text-align: left; padding: 40px 35px;">
            <div style="margin-bottom: 25px;"><img src="/assets/images/logo.svg" alt="Notes MarketPlace" height="42"></div>
            <h2 style="color: #6255a5; font-size: 24px; margin-bottom: 15px;">Email Verification</h2>
            <div id="verify-content-box">
              ${statusHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    const box = document.getElementById('verify-content-box');
    if (!token) {
      box.innerHTML = `
        <p style="color: #ff392b; margin-bottom: 20px;">Missing verification token.</p>
        <a href="#/login" class="btn-purple" style="display:inline-block;">GO TO LOGIN</a>
      `;
      return;
    }

    try {
      const res = await API.get(`/auth/verify-email?token=${token}`);
      box.innerHTML = `
        <p style="font-size: 15px; color: var(--text-main); margin-bottom: 8px;"><strong>Account Verified!</strong></p>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 25px;">${res.message}</p>
        <a href="#/login" class="btn-purple" style="display:inline-block;">LOGIN NOW</a>
      `;
      Toast.show('Account verified successfully!', 'success');
    } catch (err) {
      box.innerHTML = `
        <p style="color: #ff392b; margin-bottom: 20px;">*${err.message || 'Verification link expired or invalid.'}</p>
        <a href="#/login" class="btn-outline-purple" style="display:inline-block;">Back to Login</a>
      `;
    }
  },

  // 4. Render Forgot Password
  renderForgotPassword(container) {
    container.innerHTML = `
      <div class="auth-page-wrapper">
        <div class="auth-card-container">
          <div class="auth-logo-header">
            <a href="#/"><img src="/assets/images/logo-white.svg" alt="Notes MarketPlace"></a>
          </div>
          <div class="auth-card">
            <h2 class="auth-title">Forgot Password?</h2>
            <p class="auth-subtitle">Enter your email to receive password reset link</p>
            
            <form onsubmit="AuthView.handleForgotPassword(event)">
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" id="forgot-email" placeholder="Enter your email" required>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-forgot-submit" style="margin-top: 10px;">SUBMIT</button>

              <div class="auth-footer-prompt">
                Remember your password? <a href="#/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const btn = document.getElementById('btn-forgot-submit');
    btn.disabled = true;
    btn.innerText = 'SENDING...';

    try {
      await API.post('/auth/forgot-password', { email });
      Toast.show('Reset link sent to your simulated mailbox!', 'success');
      Mailbox.fetchEmails();
      btn.innerText = 'SUBMIT';
      btn.disabled = false;
    } catch (err) {
      Toast.show(err.message, 'error');
      btn.innerText = 'SUBMIT';
      btn.disabled = false;
    }
  },

  // 5. Render Reset Password
  renderResetPassword(container, queryParams) {
    const token = queryParams.token;
    container.innerHTML = `
      <div class="auth-page-wrapper">
        <div class="auth-card-container">
          <div class="auth-logo-header">
            <a href="#/"><img src="/assets/images/logo-white.svg" alt="Notes MarketPlace"></a>
          </div>
          <div class="auth-card">
            <h2 class="auth-title">Reset Password</h2>
            <p class="auth-subtitle">Enter your new password below</p>
            
            <form onsubmit="AuthView.handleResetPassword(event, '${token}')">
              <div class="form-group">
                <label>New Password</label>
                <div class="input-password-wrapper">
                  <input type="password" class="form-control" id="reset-password" placeholder="Enter new password" required>
                  <button type="button" class="password-toggle-eye" onclick="AuthView.togglePassword('reset-password', this)">👁️‍🗨️</button>
                </div>
              </div>

              <div class="form-group">
                <label>Confirm Password</label>
                <div class="input-password-wrapper">
                  <input type="password" class="form-control" id="reset-cpassword" placeholder="Confirm new password" required>
                  <button type="button" class="password-toggle-eye" onclick="AuthView.togglePassword('reset-cpassword', this)">👁️‍🗨️</button>
                </div>
              </div>

              <button type="submit" class="btn-auth-submit" id="btn-reset-submit" style="margin-top: 10px;">SAVE PASSWORD</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async handleResetPassword(e, token) {
    e.preventDefault();
    const p1 = document.getElementById('reset-password').value;
    const p2 = document.getElementById('reset-cpassword').value;
    if (p1 !== p2) {
      Toast.show('Passwords do not match', 'error');
      return;
    }

    try {
      await API.post('/auth/reset-password', { token, newPassword: p1 });
      Toast.show('Password reset successful! Please login.', 'success');
      window.location.hash = '/login';
    } catch (err) {
      Toast.show(err.message, 'error');
    }
  }
};

window.AuthView = AuthView;
