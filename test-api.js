// Automated Test Suite for NotesMarketplace API
const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search
    };

    if (body) {
      reqOptions.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting NotesMarketplace API Tests ---');
  let passed = 0;
  let total = 0;

  function assert(desc, condition) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
    }
  }

  try {
    // 1. Test Metadata
    const metaRes = await request('/metadata');
    assert('GET /api/metadata returns categories and types', metaRes.status === 200 && metaRes.data.categories.length > 0);

    // 2. Test Notes Listing & Search
    const notesRes = await request('/notes');
    assert('GET /api/notes returns published notes', notesRes.status === 200 && notesRes.data.notes.length > 0);
    assert('Notes total count is at least 10', notesRes.data.total >= 10);

    // 3. Test Note Details
    const note1 = notesRes.data.notes[0];
    const detailRes = await request(`/notes/${note1.id}`);
    assert('GET /api/notes/:id returns note details', detailRes.status === 200 && detailRes.data.note.id === note1.id);

    // 4. Test Login (Admin)
    const adminLoginRes = await request('/auth/login', { method: 'POST' }, {
      email: 'admin@notesmarketplace.com',
      password: 'Admin@123'
    });
    assert('POST /api/auth/login works for Admin', adminLoginRes.status === 200 && adminLoginRes.data.token);
    const adminToken = adminLoginRes.data.token;

    // 5. Test Login (Member)
    const memberLoginRes = await request('/auth/login', { method: 'POST' }, {
      email: 'notesmarketplace77@gmail.com',
      password: 'Password@123'
    });
    assert('POST /api/auth/login works for Member', memberLoginRes.status === 200 && memberLoginRes.data.token);
    const memberToken = memberLoginRes.data.token;

    // 6. Test User Dashboard
    const userDashRes = await request('/user/dashboard', {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    assert('GET /api/user/dashboard returns stats', userDashRes.status === 200 && userDashRes.data.stats);

    // 7. Test Admin Dashboard
    const adminDashRes = await request('/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert('GET /api/admin/dashboard returns admin stats', adminDashRes.status === 200 && adminDashRes.data.stats);

    // 8. Test Admin Notes Under Review
    const reviewNotesRes = await request('/admin/notes-under-review', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert('GET /api/admin/notes-under-review returns pending notes', reviewNotesRes.status === 200 && Array.isArray(reviewNotesRes.data.notes));

    // 9. Test Simulated Emails
    const emailRes = await request('/emails');
    assert('GET /api/emails returns simulated inbox messages', emailRes.status === 200 && emailRes.data.emails.length > 0);

    // 10. Test Simulated Payment Gateway Charge
    const payRes = await request('/payments/charge', {
      method: 'POST',
      headers: { Authorization: `Bearer ${memberToken}` }
    }, {
      noteId: note1.id,
      paymentMethod: 'CARD'
    });
    assert('POST /api/payments/charge processes simulated payment', payRes.status === 200 && payRes.data.success);

    // 11. Test Registration
    const testEmail = `student_${Date.now()}@example.com`;
    const regRes = await request('/auth/register', { method: 'POST' }, {
      firstName: 'Alice',
      lastName: 'Smith',
      email: testEmail,
      password: 'TestPassword@123'
    });
    assert('POST /api/auth/register creates user & email verification', regRes.status === 201 && regRes.data.verificationToken);

    // 12. Test Email Verification
    const verifyRes = await request(`/auth/verify-email?token=${regRes.data.verificationToken}`);
    assert('GET /api/auth/verify-email verifies account', verifyRes.status === 200 && verifyRes.data.success);

    console.log(`\n--- Test Results: ${passed}/${total} Passed ---`);
    if (passed === total) {
      console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

// Check if server is running, then run tests
const testReq = http.get(`${BASE_URL}/metadata`, (res) => {
  runTests();
});
testReq.on('error', () => {
  console.log('Server is not running yet. Please start server first.');
  process.exit(1);
});
