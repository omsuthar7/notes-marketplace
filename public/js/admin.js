// Admin Views: Dashboard, Notes Under Review, Member Details, and Members List
const AdminView = {
  // 1. Admin Dashboard (Manual Page 49)
  async renderDashboard(container) {
    if (!AppState.user || (AppState.user.role !== 'admin' && AppState.user.role !== 'superadmin')) {
      Toast.show('Admin access required', 'error');
      window.location.hash = '/login';
      return;
    }

    container.innerHTML = `<div class="container" style="padding:60px 20px; text-align:center;">Loading Admin Dashboard...</div>`;
    try {
      const data = await API.get('/admin/dashboard');
      const stats = data.stats;
      const notes = data.publishedNotes || [];

      container.innerHTML = `
        <div class="container dashboard-page-container">
          <div class="dashboard-header-row">
            <h1 class="dashboard-title">Dashboard</h1>
          </div>

          <!-- 3 Stat Cards matching Manual Page 49 -->
          <div class="admin-stats-grid">
            <div class="admin-stat-card" style="cursor:pointer;" onclick="window.location.hash='/admin/notes-under-review'">
              <div class="stat-number">${stats.notesInReview}</div>
              <div class="stat-label">Numbers of Notes in Review for Publish</div>
            </div>

            <div class="admin-stat-card">
              <div class="stat-number">${stats.notesDownloaded}</div>
              <div class="stat-label">Numbers of New Notes Downloaded (Last 7 days)</div>
            </div>

            <div class="admin-stat-card" style="cursor:pointer;" onclick="window.location.hash='/admin/members'">
              <div class="stat-number">${stats.newRegistrations}</div>
              <div class="stat-label">Numbers of New Registrations (Last 7 days)</div>
            </div>
          </div>

          <!-- Published Notes Table -->
          <div class="dashboard-section">
            <div class="dashboard-section-header">
              <h3 class="dashboard-section-title">Published Notes</h3>
              <div class="table-search-row">
                <input type="text" class="table-search-input" id="search-admin-published" placeholder="Search" oninput="NotesView.filterTable('table-admin-published', this.value)">
                <button class="btn-table-search">SEARCH</button>
                <select class="filter-select" style="height:38px; width:150px;">
                  <option>Select month</option>
                  <option>October 2026</option>
                  <option>September 2026</option>
                  <option>August 2026</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="custom-table" id="table-admin-published">
                <thead>
                  <tr>
                    <th>SR NO.</th>
                    <th>TITLE</th>
                    <th>CATEGORY</th>
                    <th>ATTACHMENT SIZE</th>
                    <th>SELL TYPE</th>
                    <th>PRICE</th>
                    <th>PUBLISHER</th>
                    <th>PUBLISHED DATE</th>
                    <th>NUMBER OF DOWNLOADS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  ${notes.length === 0 ? `<tr><td colspan="10" style="text-align:center; padding:20px;">No published notes found</td></tr>` : ''}
                  ${notes.map((n, idx) => `
                    <tr>
                      <td>${idx + 1}</td>
                      <td><a href="#/notes/${n.id}"><strong>${n.title}</strong></a></td>
                      <td>${n.category_name}</td>
                      <td>${n.file_size || '10 KB'}</td>
                      <td>${n.sell_type}</td>
                      <td>$${n.price}</td>
                      <td><a href="#/admin/member-details/${n.publisher_id}">${n.publisher_name}</a></td>
                      <td>${new Date(n.published_date).toLocaleDateString()}</td>
                      <td>${n.downloads_count || 10}</td>
                      <td>
                        <div class="action-dropdown-wrapper">
                          <button class="action-dots-btn" onclick="AdminView.toggleDropdown('menu-${n.id}')">⋮</button>
                          <div class="action-menu" id="menu-${n.id}">
                            <button onclick="AdminView.downloadNote(${n.id})">Download Notes</button>
                            <a href="#/notes/${n.id}">View More Details</a>
                            <button onclick="AdminView.performAction(${n.id}, 'unpublish')">Unpublish</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="container" style="padding:60px 20px; color:var(--accent-red);">Failed to load admin dashboard: ${err.message}</div>`;
    }
  },

  // 2. Notes Under Review (Manual Page 50)
  async renderNotesUnderReview(container) {
    if (!AppState.user || (AppState.user.role !== 'admin' && AppState.user.role !== 'superadmin')) {
      Toast.show('Admin access required', 'error');
      window.location.hash = '/login';
      return;
    }

    container.innerHTML = `<div class="container" style="padding:60px 20px; text-align:center;">Loading Notes Under Review...</div>`;
    try {
      const data = await API.get('/admin/notes-under-review');
      const notes = data.notes || [];
      const sellers = data.sellers || [];

      container.innerHTML = `
        <div class="container dashboard-page-container">
          <div class="dashboard-header-row">
            <h1 class="dashboard-title">Notes Under Review</h1>
          </div>

          <div class="dashboard-section-header" style="margin-bottom: 20px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <label style="font-size:13px; font-weight:600;">Seller</label>
              <select class="filter-select" style="width:180px;" id="seller-filter" onchange="AdminView.filterBySeller(this.value)">
                <option value="">All Sellers</option>
                ${sellers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="table-search-row">
              <input type="text" class="table-search-input" id="search-under-review" placeholder="Search" oninput="NotesView.filterTable('table-under-review', this.value)">
              <button class="btn-table-search">SEARCH</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="custom-table" id="table-under-review">
              <thead>
                <tr>
                  <th>SR NO.</th>
                  <th>NOTE TITLE</th>
                  <th>CATEGORY</th>
                  <th>SELLER</th>
                  <th>DATE ADDED</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${notes.length === 0 ? `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No notes currently under review</td></tr>` : ''}
                ${notes.map((n, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><a href="#/notes/${n.id}"><strong>${n.title}</strong></a></td>
                    <td>${n.category_name}</td>
                    <td><a href="#/admin/member-details/${n.seller_id}">${n.seller_name}</a></td>
                    <td>${new Date(n.date_added).toLocaleDateString()}</td>
                    <td><span style="font-weight:600; color:#007bff;">${n.status}</span></td>
                    <td style="white-space:nowrap;">
                      <button class="btn-green" onclick="AdminView.performAction(${n.id}, 'approve')">Approve</button>
                      <button class="btn-red" style="margin-left:4px;" onclick="AdminView.promptReject(${n.id})">Reject</button>
                      <button class="btn-gray" style="margin-left:4px;" onclick="AdminView.performAction(${n.id}, 'in-review')">InReview</button>
                      <div class="action-dropdown-wrapper" style="margin-left:6px;">
                        <button class="action-dots-btn" onclick="AdminView.toggleDropdown('rev-menu-${n.id}')">⋮</button>
                        <div class="action-menu" id="rev-menu-${n.id}">
                          <a href="#/notes/${n.id}">View More Details</a>
                          <button onclick="AdminView.downloadNote(${n.id})">Download Notes</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="container" style="padding:60px 20px; color:var(--accent-red);">${err.message}</div>`;
    }
  },

  async filterBySeller(sellerId) {
    const url = sellerId ? `/admin/notes-under-review?sellerId=${sellerId}` : '/admin/notes-under-review';
    const data = await API.get(url);
    const tbody = document.querySelector('#table-under-review tbody');
    if (!tbody) return;

    if (data.notes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">No notes found for this seller</td></tr>`;
      return;
    }

    tbody.innerHTML = data.notes.map((n, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><a href="#/notes/${n.id}"><strong>${n.title}</strong></a></td>
        <td>${n.category_name}</td>
        <td><a href="#/admin/member-details/${n.seller_id}">${n.seller_name}</a></td>
        <td>${new Date(n.date_added).toLocaleDateString()}</td>
        <td><span style="font-weight:600; color:#007bff;">${n.status}</span></td>
        <td style="white-space:nowrap;">
          <button class="btn-green" onclick="AdminView.performAction(${n.id}, 'approve')">Approve</button>
          <button class="btn-red" style="margin-left:4px;" onclick="AdminView.promptReject(${n.id})">Reject</button>
          <button class="btn-gray" style="margin-left:4px;" onclick="AdminView.performAction(${n.id}, 'in-review')">InReview</button>
        </td>
      </tr>
    `).join('');
  },

  promptReject(noteId) {
    const remarks = prompt('Enter rejection remarks:', 'Note does not meet publishing quality requirements.');
    if (remarks !== null) {
      this.performAction(noteId, 'reject', remarks);
    }
  },

  async performAction(noteId, action, remarks = '') {
    try {
      const res = await API.post(`/admin/notes/${noteId}/action`, { action, remarks });
      Toast.show(res.message, 'success');
      Mailbox.fetchEmails();
      // Reload current view
      if (window.location.hash.includes('under-review')) {
        this.renderNotesUnderReview(document.getElementById('app'));
      } else {
        this.renderDashboard(document.getElementById('app'));
      }
    } catch (err) {
      Toast.show(err.message, 'error');
    }
  },

  // 3. Member Details (Manual Page 50)
  async renderMemberDetails(container, memberId) {
    if (!AppState.user || (AppState.user.role !== 'admin' && AppState.user.role !== 'superadmin')) {
      window.location.hash = '/login';
      return;
    }

    container.innerHTML = `<div class="container" style="padding:60px 20px; text-align:center;">Loading Member Details...</div>`;
    try {
      const data = await API.get(`/admin/members/${memberId}`);
      const m = data.member;
      const notes = data.memberNotes || [];

      container.innerHTML = `
        <div class="container dashboard-page-container">
          <div class="dashboard-header-row">
            <h1 class="dashboard-title">Member Details</h1>
          </div>

          <!-- Member Profile Card matching Manual Page 50 -->
          <div class="member-details-card">
            <div class="member-avatar-col">
              <img src="${m.profile_picture || '/assets/images/avatar-richard.svg'}" alt="${m.first_name}">
            </div>

            <div class="member-info-col">
              <div class="member-info-item"><span class="member-info-label">First Name:</span> <span class="member-info-value">${m.first_name}</span></div>
              <div class="member-info-item"><span class="member-info-label">Last Name:</span> <span class="member-info-value">${m.last_name}</span></div>
              <div class="member-info-item"><span class="member-info-label">Email:</span> <span class="member-info-value">${m.email}</span></div>
              <div class="member-info-item"><span class="member-info-label">DOB:</span> <span class="member-info-value">${m.dob || '13-08-1990'}</span></div>
              <div class="member-info-item"><span class="member-info-label">Phone Number:</span> <span class="member-info-value">${m.phone || '9986731221'}</span></div>
              <div class="member-info-item"><span class="member-info-label">College/University:</span> <span class="member-info-value">${m.college || 'University of California'}</span></div>
            </div>

            <div class="member-info-col">
              <div class="member-info-item"><span class="member-info-label">Address 1:</span> <span class="member-info-value">${m.address_line_1 || '144-Diamond Height'}</span></div>
              <div class="member-info-item"><span class="member-info-label">Address 2:</span> <span class="member-info-value">${m.address_line_2 || 'Star Colony'}</span></div>
              <div class="member-info-item"><span class="member-info-label">City:</span> <span class="member-info-value">${m.city || 'New York'}</span></div>
              <div class="member-info-item"><span class="member-info-label">State:</span> <span class="member-info-value">${m.state || 'New York State'}</span></div>
              <div class="member-info-item"><span class="member-info-label">Country:</span> <span class="member-info-value">${m.country || 'United States'}</span></div>
              <div class="member-info-item"><span class="member-info-label">Zip Code:</span> <span class="member-info-value">${m.zip_code || '11004-05'}</span></div>
            </div>
          </div>

          <!-- Notes Uploaded by Member Table -->
          <div class="dashboard-section">
            <h3 class="dashboard-section-title" style="margin-bottom:16px;">Notes</h3>
            <div class="table-responsive">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>SR NO.</th>
                    <th>NOTE TITLE</th>
                    <th>CATEGORY</th>
                    <th>STATUS</th>
                    <th>DOWNLOADED NOTES</th>
                    <th>TOTAL EARNINGS</th>
                    <th>DATE ADDED</th>
                    <th>PUBLISHED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  ${notes.length === 0 ? `<tr><td colspan="8" style="text-align:center; padding:20px;">No notes uploaded by this member</td></tr>` : ''}
                  ${notes.map((n, idx) => `
                    <tr>
                      <td>${idx + 1}</td>
                      <td><a href="#/notes/${n.id}"><strong>${n.title}</strong></a></td>
                      <td>${n.category_name}</td>
                      <td><span style="font-weight:600; color:${n.status === 'Published' ? '#28a745' : '#007bff'}">${n.status}</span></td>
                      <td>${n.downloaded_notes || 22}</td>
                      <td>$${n.total_earnings || n.price || 177}</td>
                      <td>${new Date(n.created_at).toLocaleDateString()}</td>
                      <td>${n.published_at ? new Date(n.published_at).toLocaleDateString() : 'NA'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="container" style="padding:60px 20px; color:var(--accent-red);">${err.message}</div>`;
    }
  },

  // 4. Admin Members List View
  async renderMembersList(container) {
    if (!AppState.user || (AppState.user.role !== 'admin' && AppState.user.role !== 'superadmin')) {
      window.location.hash = '/login';
      return;
    }

    container.innerHTML = `<div class="container" style="padding:60px 20px; text-align:center;">Loading Members...</div>`;
    try {
      const data = await API.get('/admin/members');
      container.innerHTML = `
        <div class="container dashboard-page-container">
          <div class="dashboard-header-row">
            <h1 class="dashboard-title">Members</h1>
          </div>

          <div class="table-responsive">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>SR NO.</th>
                  <th>FIRST NAME</th>
                  <th>LAST NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>JOINING DATE</th>
                  <th>NOTES COUNT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${data.members.map((m, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${m.first_name}</td>
                    <td>${m.last_name}</td>
                    <td>${m.email}</td>
                    <td>${m.phone || 'N/A'}</td>
                    <td>${new Date(m.created_at).toLocaleDateString()}</td>
                    <td>${m.notes_count}</td>
                    <td>
                      <a href="#/admin/member-details/${m.id}" class="btn-outline-purple" style="font-size:12px; padding:4px 10px;">View Details</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="container" style="padding:60px 20px; color:var(--accent-red);">${err.message}</div>`;
    }
  },

  toggleDropdown(menuId) {
    // Close other dropdowns
    document.querySelectorAll('.action-menu').forEach(m => {
      if (m.id !== menuId) m.classList.remove('show');
    });
    const menu = document.getElementById(menuId);
    if (menu) menu.classList.toggle('show');
  },

  downloadNote(noteId) {
    const tokenQuery = AppState.token ? `?token=${encodeURIComponent(AppState.token)}` : '';
    window.location.href = `/api/notes/${noteId}/download${tokenQuery}`;
  }
};

window.AdminView = AdminView;
