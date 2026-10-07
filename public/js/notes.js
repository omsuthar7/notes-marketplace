// Notes Views: Home, Search, Note Details, Add Note, and User Dashboard
const NotesView = {
  activeSearchQuery: {
    q: '',
    type: '',
    category: '',
    university: '',
    course: '',
    country: '',
    rating: '',
    page: 1
  },

  // 1. Render Home Screen (Screenshot 3)
  renderHome(container) {
    container.innerHTML = `
      <div>
        <!-- Hero Section -->
        <section class="home-hero">
          <div class="container">
            <div class="hero-content">
              <h1 class="hero-title">Download Free/Paid Notes<br>or Sale your Book</h1>
              <p class="hero-desc">
                NotesMarketPlace is an online market platform for students and teachers to buy and sell course study materials, exam notes, reference guides and academic books.
              </p>
              <a href="#/search" class="btn-hero-action">LEARN MORE</a>
            </div>
          </div>
        </section>

        <!-- About Section -->
        <section class="section-about">
          <div class="container">
            <div class="about-grid">
              <h2 class="section-heading-purple">About<br>NotesMarketPlace</h2>
              <div class="about-text">
                <p style="margin-bottom: 14px;">
                  NotesMarketPlace is a premier collaborative platform created to empower university students and educators. Whether preparing for semester examinations, entrance tests, or seeking comprehensive course lecture notes, students can easily explore verified academic materials uploaded by peers and professors across institutions.
                </p>
                <p>
                  Sellers can monetize their detailed notes, lecture summaries, and solved question banks with full autonomy over pricing, receiving automated transaction payouts and direct ratings from fellow scholars worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- How It Works Section -->
        <section class="section-how">
          <div class="container">
            <h2 class="section-title-center">How It Works</h2>
            <div class="how-cards-container">
              <!-- Download Card -->
              <div class="how-card">
                <div class="how-icon-circle">
                  <span>📥</span>
                </div>
                <h3 class="how-title">Download Free/Paid Notes</h3>
                <p class="how-desc">Get Material for your Course, Exam preparations and Projects.</p>
                <a href="#/search" class="btn-purple" style="width: 100%;">DOWNLOAD</a>
              </div>

              <!-- Seller Card -->
              <div class="how-card">
                <div class="how-icon-circle">
                  <span>📤</span>
                </div>
                <h3 class="how-title">Seller</h3>
                <p class="how-desc">Upload and Download Course and Materials, books and syllabus.</p>
                <a href="#/add-note" class="btn-purple" style="width: 100%;">SELL BOOK</a>
              </div>
            </div>
          </div>
        </section>

        <!-- What our Customers are Saying Section (Exact 4 cards from Screenshot 3) -->
        <section class="section-testimonials">
          <div class="container">
            <h2 class="section-title-center" style="margin-bottom: 40px;">What our Customers are Saying</h2>
            <div class="testimonials-grid">
              <!-- Walter Meller -->
              <div class="testimonial-card">
                <div class="testimonial-user">
                  <img src="/assets/images/avatar-walter.svg" class="testimonial-avatar" alt="Walter Meller">
                  <div>
                    <h4 class="testimonial-name">Walter Meller</h4>
                    <span class="testimonial-role">Founder & CEO, Matrix Group</span>
                  </div>
                </div>
                <p class="testimonial-quote">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
                </p>
              </div>

              <!-- Jonnie Riley -->
              <div class="testimonial-card">
                <div class="testimonial-user">
                  <img src="/assets/images/avatar-jonnie.svg" class="testimonial-avatar" alt="Jonnie Riley">
                  <div>
                    <h4 class="testimonial-name">Jonnie Riley</h4>
                    <span class="testimonial-role">Employee, Curious Inc.</span>
                  </div>
                </div>
                <p class="testimonial-quote">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
                </p>
              </div>

              <!-- Amilia Luna -->
              <div class="testimonial-card">
                <div class="testimonial-user">
                  <img src="/assets/images/avatar-amilia.svg" class="testimonial-avatar" alt="Amilia Luna">
                  <div>
                    <h4 class="testimonial-name">Amilia Luna</h4>
                    <span class="testimonial-role">Teacher, Saint Joseph High School</span>
                  </div>
                </div>
                <p class="testimonial-quote">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
                </p>
              </div>

              <!-- Daniel Cardos -->
              <div class="testimonial-card">
                <div class="testimonial-user">
                  <img src="/assets/images/avatar-daniel.svg" class="testimonial-avatar" alt="Daniel Cardos">
                  <div>
                    <h4 class="testimonial-name">Daniel Cardos</h4>
                    <span class="testimonial-role">Software Engineer, Infinitum Company</span>
                  </div>
                </div>
                <p class="testimonial-quote">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  // 2. Render Search Notes Screen (Screenshot 4)
  async renderSearch(container) {
    container.innerHTML = `
      <div>
        <!-- Search Top Banner -->
        <div class="search-banner">
          <h1 class="search-banner-title">Search Notes</h1>
        </div>

        <div class="container search-filter-section">
          <h3 class="filter-heading">Search and Filter notes</h3>

          <!-- Filter Panel Card -->
          <div class="filter-panel-card">
            <div class="search-input-wrapper">
              <span class="search-icon-inside">🔍</span>
              <input type="text" id="search-keyword" class="form-control search-input-main" placeholder="Search notes here..." oninput="NotesView.handleSearchInput(this.value)">
            </div>

            <div class="filter-selects-grid">
              <select class="filter-select" id="filter-type" onchange="NotesView.handleFilterChange('type', this.value)">
                <option value="">Select type</option>
              </select>

              <select class="filter-select" id="filter-category" onchange="NotesView.handleFilterChange('category', this.value)">
                <option value="">Select category</option>
              </select>

              <select class="filter-select" id="filter-university" onchange="NotesView.handleFilterChange('university', this.value)">
                <option value="">Select university</option>
                <option value="California">University of California</option>
                <option value="Oxford">Oxford University</option>
                <option value="MIT">MIT</option>
                <option value="Stanford">Stanford University</option>
                <option value="Cambridge">Cambridge University</option>
                <option value="Columbia">Columbia University</option>
                <option value="GTU">Gujarat Technological University</option>
              </select>

              <select class="filter-select" id="filter-course" onchange="NotesView.handleFilterChange('course', this.value)">
                <option value="">Select course</option>
                <option value="Computer">Computer Engineering</option>
                <option value="Operating">Operating Systems</option>
                <option value="Data Science">Data Science</option>
                <option value="Financial">Financial Accounting</option>
                <option value="Social">Social Studies</option>
              </select>

              <select class="filter-select" id="filter-country" onchange="NotesView.handleFilterChange('country', this.value)">
                <option value="">Select country</option>
              </select>

              <select class="filter-select" id="filter-rating" onchange="NotesView.handleFilterChange('rating', this.value)">
                <option value="">Select rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
          </div>

          <!-- Total Notes Counter & Notes Grid Container -->
          <h2 class="search-results-count" id="search-total-count">Total 18 notes</h2>
          
          <div class="notes-grid" id="notes-cards-container">
            <p style="text-align: center; grid-column: 1/-1; padding: 40px; color: var(--text-muted);">Loading notes...</p>
          </div>

          <!-- Pagination -->
          <div class="pagination-wrapper" id="notes-pagination"></div>
        </div>
      </div>
    `;

    // Populate dropdown options
    this.populateFilterDropdowns();
    // Load notes
    this.loadNotes();
  },

  populateFilterDropdowns() {
    const typeSelect = document.getElementById('filter-type');
    const catSelect = document.getElementById('filter-category');
    const countrySelect = document.getElementById('filter-country');

    if (AppState.metadata.noteTypes) {
      AppState.metadata.noteTypes.forEach(t => {
        typeSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
      });
    }
    if (AppState.metadata.categories) {
      AppState.metadata.categories.forEach(c => {
        catSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
      });
    }
    if (AppState.metadata.countries) {
      AppState.metadata.countries.forEach(co => {
        countrySelect.innerHTML += `<option value="${co.id}">${co.name}</option>`;
      });
    }
  },

  searchDebounceTimer: null,
  handleSearchInput(val) {
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.activeSearchQuery.q = val;
      this.activeSearchQuery.page = 1;
      this.loadNotes();
    }, 300);
  },

  handleFilterChange(key, val) {
    this.activeSearchQuery[key] = val;
    this.activeSearchQuery.page = 1;
    this.loadNotes();
  },

  async loadNotes() {
    const container = document.getElementById('notes-cards-container');
    const totalCountElem = document.getElementById('search-total-count');
    const paginationElem = document.getElementById('notes-pagination');
    if (!container) return;

    try {
      const qParams = new URLSearchParams();
      for (const [k, v] of Object.entries(this.activeSearchQuery)) {
        if (v) qParams.append(k, v);
      }

      const res = await API.get(`/notes?${qParams.toString()}`);
      totalCountElem.innerText = `Total ${res.total} notes`;

      if (res.notes.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <div style="font-size: 40px; margin-bottom: 12px;">📚</div>
            <h3>No notes matched your search criteria</h3>
            <p>Try clearing filters or searching for terms like "Computer", "Engineering", "Science" or "Exam".</p>
          </div>
        `;
        paginationElem.innerHTML = '';
        return;
      }

      let gridHtml = '';
      res.notes.forEach(note => {
        const starsHtml = '★'.repeat(Math.round(note.avg_rating)) + '☆'.repeat(5 - Math.round(note.avg_rating));
        const priceLabel = note.sell_type === 'Free' ? 'Free' : `$${note.price}`;
        const priceClass = note.sell_type === 'Free' ? 'note-price-free' : 'note-price-paid';

        gridHtml += `
          <div class="note-card">
            <a href="#/notes/${note.id}" class="note-cover-link">
              <img src="${note.display_picture || '/assets/images/cover-cs.svg'}" alt="${note.title}" class="note-cover-img" onerror="this.src='/assets/images/cover-cs.svg'">
            </a>
            <div class="note-body">
              <a href="#/notes/${note.id}" class="note-card-title">${note.title}</a>
              
              <ul class="note-card-meta-list">
                <li class="note-card-meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/></svg>
                  <span>${note.institution || 'University of California'}, ${note.country_name || 'US'}</span>
                </li>
                <li class="note-card-meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                  <span>${note.pages || 204} Pages</span>
                </li>
                <li class="note-card-meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
                  <span>${new Date(note.published_at || note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </li>
              </ul>

              ${note.inappropriate_reports > 0 ? `
                <div class="note-inappropriate-flag">
                  ${note.inappropriate_reports} Users marked this note as inappropriate
                </div>
              ` : ''}

              <div class="note-card-footer">
                <div class="rating-stars">
                  <span>${starsHtml}</span>
                  <span class="reviews-count-text">${note.review_count || 100} reviews</span>
                </div>
                <div class="note-price-badge ${priceClass}">${priceLabel}</div>
              </div>
            </div>
          </div>
        `;
      });
      container.innerHTML = gridHtml;

      // Render Pagination matching screenshot: < 1 2 3 4 5 >
      let pagHtml = `<button class="page-btn" ${res.page === 1 ? 'disabled' : ''} onclick="NotesView.goToPage(${res.page - 1})">&lt;</button>`;
      const maxPages = Math.max(res.totalPages, 1);
      for (let p = 1; p <= maxPages; p++) {
        pagHtml += `<button class="page-btn ${p === res.page ? 'active' : ''}" onclick="NotesView.goToPage(${p})">${p}</button>`;
      }
      pagHtml += `<button class="page-btn" ${res.page === maxPages ? 'disabled' : ''} onclick="NotesView.goToPage(${res.page + 1})">&gt;</button>`;
      paginationElem.innerHTML = pagHtml;

    } catch (err) {
      container.innerHTML = `<p style="color:var(--accent-red); padding:30px;">Failed to load notes: ${err.message}</p>`;
    }
  },

  goToPage(p) {
    this.activeSearchQuery.page = p;
    this.loadNotes();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  },

  // 3. Render Note Details Screen (Manual Page 48)
  async renderDetails(container, noteId) {
    container.innerHTML = `<div class="container" style="padding:60px 20px; text-align:center;">Loading note details...</div>`;
    try {
      const res = await API.get(`/notes/${noteId}`);
      const n = res.note;
      const reviews = res.reviews || [];
      const hasAccess = res.hasAccess;

      const stars = '★'.repeat(Math.round(n.avg_rating)) + '☆'.repeat(5 - Math.round(n.avg_rating));
      const downloadBtnText = n.sell_type === 'Free' ? 'DOWNLOAD (FREE)' : hasAccess ? 'DOWNLOAD NOTE' : `DOWNLOAD / $${n.price}`;

      container.innerHTML = `
        <div class="container note-details-container">
          <div class="note-details-top">
            <!-- Left: Cover -->
            <div class="note-details-cover">
              <img src="${n.display_picture || '/assets/images/cover-cs.svg'}" alt="${n.title}" onerror="this.src='/assets/images/cover-cs.svg'">
            </div>

            <!-- Middle: Main details & Download action -->
            <div class="note-details-main">
              <h1>${n.title}</h1>
              <div class="note-details-category">${n.category_name || 'Computer Science'}</div>
              <p class="note-details-desc">${n.description}</p>
              
              <button class="btn-download-note" onclick="NotesView.handleDownloadClick(${n.id}, '${n.sell_type}', ${n.price}, ${hasAccess})">
                ${downloadBtnText}
              </button>

              ${!hasAccess && n.sell_type === 'Paid' ? `
                <div style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
                  Instant unlock via our Simulated Secure Payment Gateway.
                </div>
              ` : ''}
            </div>

            <!-- Right: Meta specifications -->
            <div class="note-specs-card">
              <div class="spec-row"><span class="spec-label">Institution:</span> <span class="spec-val">${n.institution || 'University of California'}</span></div>
              <div class="spec-row"><span class="spec-label">Country:</span> <span class="spec-val">${n.country_name || 'United States'}</span></div>
              <div class="spec-row"><span class="spec-label">Course Name:</span> <span class="spec-val">${n.course_name || 'Computer Engineering'}</span></div>
              <div class="spec-row"><span class="spec-label">Course Code:</span> <span class="spec-val">${n.course_code || '248706'}</span></div>
              <div class="spec-row"><span class="spec-label">Professor:</span> <span class="spec-val">${n.professor || 'Mr. Richard Brown'}</span></div>
              <div class="spec-row"><span class="spec-label">Number of Pages:</span> <span class="spec-val">${n.pages || 277}</span></div>
              <div class="spec-row"><span class="spec-label">Approved Date:</span> <span class="spec-val">${new Date(n.published_at || n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
              <div class="spec-row">
                <span class="spec-label">Rating:</span> 
                <span class="spec-val" style="color:#ffc107;">${stars} <small style="color:var(--text-muted)">(${n.review_count || reviews.length} Reviews)</small></span>
              </div>
              <div style="margin-top: 15px; text-align: right;">
                <button class="btn-outline-purple" style="font-size: 11.5px; padding: 4px 10px;" onclick="NotesView.reportNote(${n.id})">🚩 Report Inappropriate</button>
              </div>
            </div>
          </div>

          <!-- Bottom: Notes Preview & Customer Reviews matching Manual Page 48 -->
          <div class="note-details-bottom">
            <!-- Notes Preview Box -->
            <div>
              <h3 style="font-size: 18px; font-weight: 700; color: var(--primary-color); margin-bottom: 16px;">Notes Preview</h3>
              <div class="preview-box">
UNIT 1: INTRODUCTION TO ${n.title.toUpperCase()}
--------------------------------------------------
1. System Fundamentals & Core Architecture
   - Computational models and operational pipelines.
   - Resource allocation, abstraction boundaries and synchronization.
   - Fault tolerance and modular integrity.

2. Comprehensive Analysis
   - Theoretical framework and practical implementations.
   - Problem solving methodologies and algorithmic walkthroughs.
   - Key exam topics and reviewed formulas.

[Full notes document contains ${n.pages || 204} pages of lecture notes and exam guides. Download to view complete source.]
              </div>
            </div>

            <!-- Customer Reviews Box -->
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="font-size: 18px; font-weight: 700; color: var(--primary-color);">Customer Reviews</h3>
                <button class="btn-outline-purple" onclick="NotesView.openReviewModal(${n.id})">+ Add Review</button>
              </div>

              <div class="reviews-container">
                ${reviews.length === 0 ? `<p style="color:var(--text-muted); font-size:13px;">No reviews yet. Be the first to review this note!</p>` : ''}
                ${reviews.map(r => `
                  <div class="review-item">
                    <div class="review-header">
                      <img src="${r.reviewer_avatar || '/assets/images/avatar-richard.svg'}" alt="${r.reviewer_name}">
                      <div>
                        <div class="reviewer-name">${r.reviewer_name}</div>
                        <div style="color:#ffc107; font-size:12px;">${'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}</div>
                      </div>
                    </div>
                    <div class="review-body">${r.comments}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="container" style="padding:60px 20px; color:var(--accent-red);">Note could not be found: ${err.message}</div>`;
    }
  },

  handleDownloadClick(noteId, sellType, price, hasAccess) {
    if (sellType === 'Paid' && !hasAccess) {
      if (!AppState.user) {
        Toast.show('Please log in to purchase this note.', 'error');
        window.location.hash = '/login';
        return;
      }
      // Launch simulated payment gateway
      PaymentGateway.open({ id: noteId, title: document.querySelector('.note-details-main h1').innerText, price, seller_name: 'Academic Author' });
    } else {
      // Trigger download immediately with token if available
      const tokenParam = AppState.token ? `?token=${encodeURIComponent(AppState.token)}` : '';
      window.location.href = `/api/notes/${noteId}/download${tokenParam}`;
      Toast.show('Downloading note material...', 'success');
    }
  },

  async reportNote(noteId) {
    if (!AppState.user) {
      Toast.show('Please log in to report notes.', 'error');
      return;
    }
    try {
      await API.post(`/notes/${noteId}/report`, {});
      Toast.show('Note marked as reported. Admin has been notified.', 'success');
    } catch (err) {
      Toast.show(err.message, 'error');
    }
  },

  openReviewModal(noteId) {
    if (!AppState.user) {
      Toast.show('Please log in to add a review.', 'error');
      window.location.hash = '/login';
      return;
    }

    const rating = prompt('Enter star rating (1 to 5):', '5');
    if (!rating) return;
    const comments = prompt('Enter your feedback/review comments:', 'Great notes! Very helpful for exam prep.');
    if (!comments) return;

    API.post(`/notes/${noteId}/reviews`, { rating: parseInt(rating), comments })
      .then(() => {
        Toast.show('Review submitted successfully!', 'success');
        this.renderDetails(document.getElementById('app'), noteId);
      })
      .catch(err => Toast.show(err.message, 'error'));
  },

  // 4. Render Add Note Screen (Manual Page 49)
  renderAddNote(container) {
    if (!AppState.user) {
      window.location.hash = '/login';
      return;
    }

    container.innerHTML = `
      <div class="search-banner">
        <h1 class="search-banner-title">Add Notes</h1>
      </div>

      <div class="container add-note-container">
        <form id="form-add-note" onsubmit="NotesView.handleAddNote(event)">
          <!-- 1. Basic Note Details -->
          <div class="form-fieldset">
            <h3 class="fieldset-title">Basic Note Details</h3>
            <div class="form-row-2">
              <div class="form-group">
                <label>Title <span class="required-star">*</span></label>
                <input type="text" class="form-control" id="note-title" placeholder="Enter your notes title" required>
              </div>
              <div class="form-group">
                <label>Category <span class="required-star">*</span></label>
                <select class="form-control" id="note-category" required>
                  <option value="">Select your category</option>
                  ${AppState.metadata.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>Display Picture</label>
                <div class="file-upload-box">
                  <input type="file" id="note-pic" accept="image/*">
                </div>
              </div>
              <div class="form-group">
                <label>Upload Notes <span class="required-star">*</span></label>
                <div class="file-upload-box">
                  <input type="file" id="note-file" required>
                </div>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label>Type</label>
                <select class="form-control" id="note-type">
                  <option value="">Select your note type</option>
                  ${AppState.metadata.noteTypes.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Number of Pages</label>
                <input type="number" class="form-control" id="note-pages" placeholder="Enter number of note pages" value="150">
              </div>
            </div>

            <div class="form-group">
              <label>Description <span class="required-star">*</span></label>
              <textarea class="form-control" id="note-desc" placeholder="Enter your description..." required></textarea>
            </div>
          </div>

          <!-- 2. Institution Information -->
          <div class="form-fieldset">
            <h3 class="fieldset-title">Institution Information</h3>
            <div class="form-row-2">
              <div class="form-group">
                <label>Country</label>
                <select class="form-control" id="note-country">
                  <option value="">Select your country</option>
                  ${AppState.metadata.countries.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Institution Name</label>
                <input type="text" class="form-control" id="note-institution" placeholder="Enter your institution name">
              </div>
            </div>
          </div>

          <!-- 3. Course Details -->
          <div class="form-fieldset">
            <h3 class="fieldset-title">Course Details</h3>
            <div class="form-row-2">
              <div class="form-group">
                <label>Course Name</label>
                <input type="text" class="form-control" id="note-course" placeholder="Enter your course name">
              </div>
              <div class="form-group">
                <label>Course Code</label>
                <input type="text" class="form-control" id="note-course-code" placeholder="Enter your course code">
              </div>
            </div>
            <div class="form-group">
              <label>Professor / Lecturer</label>
              <input type="text" class="form-control" id="note-prof" placeholder="Enter your professor name">
            </div>
          </div>

          <!-- 4. Selling Information -->
          <div class="form-fieldset">
            <h3 class="fieldset-title">Selling Information</h3>
            <div class="form-row-2">
              <div class="form-group">
                <label>Sell For <span class="required-star">*</span></label>
                <div class="radio-group-sell">
                  <label class="radio-item">
                    <input type="radio" name="sellFor" value="Free" checked onchange="document.getElementById('price-group').style.display='none'"> Free
                  </label>
                  <label class="radio-item">
                    <input type="radio" name="sellFor" value="Paid" onchange="document.getElementById('price-group').style.display='block'"> Paid
                  </label>
                </div>
              </div>
              <div class="form-group" id="price-group" style="display: none;">
                <label>Sell Price <span class="required-star">*</span></label>
                <input type="number" class="form-control" id="note-price" placeholder="Enter price in USD ($)" value="15">
              </div>
            </div>

            <div class="form-group">
              <label>Note Preview</label>
              <div class="file-upload-box">
                <input type="file" id="note-preview-file">
              </div>
            </div>
          </div>

          <!-- Form Buttons -->
          <div style="display: flex; gap: 15px; margin-top: 30px;">
            <button type="button" class="btn-purple" onclick="NotesView.submitNoteForm('save')">SAVE</button>
            <button type="button" class="btn-purple" onclick="NotesView.submitNoteForm('submit')">SUBMIT</button>
          </div>
        </form>
      </div>
    `;
  },

  async submitNoteForm(action) {
    const title = document.getElementById('note-title').value;
    const category = document.getElementById('note-category').value;
    const desc = document.getElementById('note-desc').value;

    if (!title || !category || !desc) {
      Toast.show('Please fill in required fields (Title, Category, Description)', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('type', document.getElementById('note-type').value);
    formData.append('numberOfPages', document.getElementById('note-pages').value);
    formData.append('description', desc);
    formData.append('country', document.getElementById('note-country').value);
    formData.append('institutionName', document.getElementById('note-institution').value);
    formData.append('courseName', document.getElementById('note-course').value);
    formData.append('courseCode', document.getElementById('note-course-code').value);
    formData.append('professor', document.getElementById('note-prof').value);

    const sellFor = document.querySelector('input[name="sellFor"]:checked').value;
    formData.append('sellFor', sellFor);
    formData.append('sellPrice', document.getElementById('note-price').value);
    formData.append('action', action);

    const picInput = document.getElementById('note-pic');
    if (picInput.files[0]) formData.append('displayPicture', picInput.files[0]);

    const noteInput = document.getElementById('note-file');
    if (noteInput.files[0]) formData.append('uploadNotes', noteInput.files[0]);

    const prevInput = document.getElementById('note-preview-file');
    if (prevInput.files[0]) formData.append('notesPreview', prevInput.files[0]);

    try {
      const res = await API.post('/notes', formData);
      Toast.show(res.message, 'success');
      Mailbox.fetchEmails();
      window.location.hash = '/dashboard';
    } catch (err) {
      Toast.show(err.message, 'error');
    }
  },

  // 5. Render User Dashboard Screen (Manual Page 48)
  async renderDashboard(container) {
    if (!AppState.user) {
      window.location.hash = '/login';
      return;
    }

    container.innerHTML = `<div class="container" style="padding:60px 20px; text-align:center;">Loading your dashboard...</div>`;
    try {
      const data = await API.get('/user/dashboard');
      const stats = data.stats;
      const inProgress = data.inProgressNotes || [];
      const published = data.publishedNotes || [];

      container.innerHTML = `
        <div class="container dashboard-page-container">
          <div class="dashboard-header-row">
            <h1 class="dashboard-title">Dashboard</h1>
            <a href="#/add-note" class="btn-purple">ADD NOTE</a>
          </div>

          <!-- My Earning Stat Cards matching Manual Page 48 -->
          <div class="dashboard-stats-grid">
            <div class="stat-card" style="background-color: var(--primary-light); border-color: var(--primary-color);">
              <div style="font-size: 24px; margin-bottom: 4px;">💰</div>
              <div class="stat-number" style="font-size: 20px;">My Earning</div>
            </div>

            <div class="stat-card">
              <div class="stat-number">${stats.notesSold}</div>
              <div class="stat-label">Number of Notes Sold</div>
            </div>

            <div class="stat-card">
              <div class="stat-number">$${Number(stats.moneyEarned).toLocaleString()}</div>
              <div class="stat-label">Money Earned</div>
            </div>

            <div class="stat-card">
              <div class="stat-number">${stats.myDownloads}</div>
              <div class="stat-label">My Downloads</div>
            </div>

            <div class="stat-card">
              <div class="stat-number">${stats.myRejectedNotes}</div>
              <div class="stat-label">My Rejected Notes</div>
            </div>

            <div class="stat-card">
              <div class="stat-number">${stats.buyerRequests}</div>
              <div class="stat-label">Buyer Requests</div>
            </div>
          </div>

          <!-- Section 1: In Progress Notes Table -->
          <div class="dashboard-section">
            <div class="dashboard-section-header">
              <h3 class="dashboard-section-title">In Progress Notes</h3>
              <div class="table-search-row">
                <input type="text" class="table-search-input" id="search-inprogress" placeholder="Search" oninput="NotesView.filterTable('table-inprogress', this.value)">
                <button class="btn-table-search">SEARCH</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="custom-table" id="table-inprogress">
                <thead>
                  <tr>
                    <th>ADDED DATE</th>
                    <th>TITLE</th>
                    <th>CATEGORY</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  ${inProgress.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">No in-progress notes found</td></tr>` : ''}
                  ${inProgress.map(n => `
                    <tr>
                      <td>${new Date(n.created_at).toLocaleDateString()}</td>
                      <td><strong>${n.title}</strong></td>
                      <td>${n.category_name}</td>
                      <td><span style="font-weight:600; color:${n.status === 'Draft' ? '#6c757d' : '#007bff'}">${n.status}</span></td>
                      <td>
                        <a href="#/notes/${n.id}" style="margin-right:10px;">👁️ View</a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 2: Published Notes Table -->
          <div class="dashboard-section">
            <div class="dashboard-section-header">
              <h3 class="dashboard-section-title">Published Notes</h3>
              <div class="table-search-row">
                <input type="text" class="table-search-input" id="search-published" placeholder="Search" oninput="NotesView.filterTable('table-published', this.value)">
                <button class="btn-table-search">SEARCH</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="custom-table" id="table-published">
                <thead>
                  <tr>
                    <th>ADDED DATE</th>
                    <th>TITLE</th>
                    <th>CATEGORY</th>
                    <th>SELL TYPE</th>
                    <th>PRICE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  ${published.length === 0 ? `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:20px;">No published notes found</td></tr>` : ''}
                  ${published.map(n => `
                    <tr>
                      <td>${new Date(n.published_at || n.created_at).toLocaleDateString()}</td>
                      <td><strong>${n.title}</strong></td>
                      <td>${n.category_name}</td>
                      <td>${n.sell_type}</td>
                      <td>$${n.price}</td>
                      <td>
                        <a href="#/notes/${n.id}">👁️ View</a>
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
      container.innerHTML = `<div class="container" style="padding:60px 20px; color:var(--accent-red);">Dashboard failed to load: ${err.message}</div>`;
    }
  },

  filterTable(tableId, query) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const q = query.toLowerCase();
    for (let i = 0; i < rows.length; i++) {
      const text = rows[i].textContent.toLowerCase();
      rows[i].style.display = text.includes(q) ? '' : 'none';
    }
  }
};

window.NotesView = NotesView;
