const bcrypt = require('bcryptjs');
const { dbAsync, initDb } = require('./db');

async function seed() {
  await initDb();

  const userCount = await dbAsync.get('SELECT COUNT(*) as cnt FROM users');
  if (userCount && userCount.cnt > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  console.log('Seeding initial NotesMarketplace data...');

  // Hash passwords
  const defaultPassword = await bcrypt.hash('Password@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  // 1. Seed Categories
  const categories = [
    ['Science', 'Scientific research and study materials'],
    ['IT', 'Information Technology, programming and systems'],
    ['Commerce', 'Accounting, finance and business administration'],
    ['Social', 'Social studies, humanities and psychology'],
    ['Computer', 'Computer Science and engineering notes'],
    ['History', 'World history, civilizations and politics'],
    ['Medical', 'Anatomy, pharmacology and medicine'],
    ['Engineering', 'Mechanical, Electrical and Civil engineering']
  ];
  for (const [name, desc] of categories) {
    await dbAsync.run('INSERT INTO categories (name, description) VALUES (?, ?)', [name, desc]);
  }

  // 2. Seed Note Types
  const noteTypes = ['Handwritten Notes', 'Lecture Notes', 'Book', 'Tutorial', 'Question Bank'];
  for (const type of noteTypes) {
    await dbAsync.run('INSERT INTO note_types (name) VALUES (?)', [type]);
  }

  // 3. Seed Countries
  const countries = ['United States', 'India', 'United Kingdom', 'Australia', 'Canada', 'Germany'];
  for (const c of countries) {
    await dbAsync.run('INSERT INTO countries (name) VALUES (?)', [c]);
  }

  // 4. Seed Users
  // Admin
  await dbAsync.run(`
    INSERT INTO users (first_name, last_name, email, password, role, is_verified, phone, college, profile_picture)
    VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
  `, ['Admin', 'Manager', 'admin@notesmarketplace.com', adminPassword, 'admin', '9876543210', 'Oxford University', '/assets/images/avatar-admin.svg']);

  // Richard Brown (from Member Details manual page 50)
  const richard = await dbAsync.run(`
    INSERT INTO users (first_name, last_name, email, password, role, is_verified, dob, phone, college, address_line_1, address_line_2, city, state, country, zip_code, profile_picture)
    VALUES (?, ?, ?, ?, 'member', 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, ['Richard', 'Brown', 'richardbrown77@gmail.com', defaultPassword, '1990-08-13', '9986731221', 'University of California', '144-Diamond Height', 'Star Colony', 'New York', 'New York State', 'United States', '11004-05', '/assets/images/avatar-richard.svg']);
  const richardId = richard.lastID;

  // John Doe (from Login Screenshot: notesmarketplace77@gmail.com)
  const john = await dbAsync.run(`
    INSERT INTO users (first_name, last_name, email, password, role, is_verified, phone, college, profile_picture)
    VALUES (?, ?, ?, ?, 'member', 1, ?, ?, ?)
  `, ['John', 'Doe', 'notesmarketplace77@gmail.com', defaultPassword, '9123456780', 'MIT', '/assets/images/avatar-walter.svg']);
  const johnId = john.lastID;

  // Other sellers from manual
  const sellers = [
    ['Pritesh', 'Panchal', 'priteshpanchal@gmail.com', '/assets/images/avatar-jonnie.svg'],
    ['Rahil', 'Shah', 'rahilshah@gmail.com', '/assets/images/avatar-amilia.svg'],
    ['Anish', 'Patel', 'anishpatel@gmail.com', '/assets/images/avatar-daniel.svg'],
    ['Vijay', 'Vaishnav', 'vijayvaishnav@gmail.com', '/assets/images/avatar-richard.svg'],
    ['Mehul', 'Patel', 'mehulpatel@gmail.com', '/assets/images/avatar-jonnie.svg'],
    ['Khyati', 'Patel', 'khyatipatel@gmail.com', '/assets/images/avatar-amilia.svg']
  ];

  const sellerIds = {};
  for (const [fn, ln, email, pic] of sellers) {
    const res = await dbAsync.run(`
      INSERT INTO users (first_name, last_name, email, password, role, is_verified, phone, college, profile_picture)
      VALUES (?, ?, ?, ?, 'member', 1, '9876543200', 'GTU Engineering', ?)
    `, [fn, ln, email, defaultPassword, pic]);
    sellerIds[email] = res.lastID;
  }

  // 5. Seed Notes (exact notes from screenshots 3, 4 and manual pages 48, 49, 50)
  const notesData = [
    {
      seller_id: richardId,
      title: 'Computer Science',
      category_id: 5, // Computer
      type_id: 2, // Lecture Notes
      pages: 277,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
      institution: 'University of California',
      country_id: 1, // US
      course_name: 'Computer Engineering',
      course_code: '248706',
      professor: 'Mr. Richard Brown',
      sell_type: 'Paid',
      price: 15,
      display_picture: '/assets/images/cover-cs.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '15 MB',
      status: 'Published',
      inappropriate_reports: 5,
      published_at: '2020-11-25 10:10:00'
    },
    {
      seller_id: sellerIds['priteshpanchal@gmail.com'],
      title: 'Computer Operating System - Final Exam Book With Paper Solution',
      category_id: 2, // IT
      type_id: 3, // Book
      pages: 204,
      description: 'Complete operating systems exam preparation guide containing CPU scheduling, memory management, page replacement algorithms and previous year university paper solutions.',
      institution: 'University of California, US',
      country_id: 1,
      course_name: 'Operating Systems',
      course_code: 'OS-302',
      professor: 'Dr. Andrew S.',
      sell_type: 'Free',
      price: 0,
      display_picture: '/assets/images/cover-os.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '10 KB',
      status: 'Published',
      inappropriate_reports: 5,
      published_at: '2020-11-26 11:20:00'
    },
    {
      seller_id: sellerIds['rahilshah@gmail.com'],
      title: 'Basic Computer Engineering Tech India Publication series',
      category_id: 8, // Engineering
      type_id: 3,
      pages: 204,
      description: 'Foundations of computer systems, digital electronics, logic gates, Boolean algebra, computer networks and basic programming logic for first year engineering.',
      institution: 'University of California, US',
      country_id: 1,
      course_name: 'Computer Engineering Basics',
      course_code: 'CE-101',
      professor: 'Prof. K. Sharma',
      sell_type: 'Free',
      price: 0,
      display_picture: '/assets/images/cover-eng.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '18 MB',
      status: 'Published',
      inappropriate_reports: 5,
      published_at: '2020-11-26 12:00:00'
    },
    {
      seller_id: richardId,
      title: 'Computer Science Illuminated - Seventh Edition',
      category_id: 5,
      type_id: 3,
      pages: 354,
      description: 'Comprehensive overview of computer systems, programming layers, applications, artificial intelligence and limitations of computing by Nell Dale and John Lewis.',
      institution: 'University of California, US',
      country_id: 1,
      course_name: 'Computer Science Fundamentals',
      course_code: 'CS-100',
      professor: 'Prof. Richard Brown',
      sell_type: 'Free',
      price: 0,
      display_picture: '/assets/images/cover-cs-ill.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '22 MB',
      status: 'Published',
      inappropriate_reports: 5,
      published_at: '2020-11-26 14:15:00'
    },
    {
      seller_id: sellerIds['anishpatel@gmail.com'],
      title: 'The Principles of Computer Hardware',
      category_id: 5,
      type_id: 3,
      pages: 412,
      description: 'In-depth coverage of computer architectures, registers, assembly instruction set, logic gates, memory buses and microcontrollers from Oxford University curriculum.',
      institution: 'Oxford University',
      country_id: 3, // UK
      course_name: 'Computer Hardware Engineering',
      course_code: 'HW-401',
      professor: 'Dr. Alan Clements',
      sell_type: 'Paid',
      price: 22,
      display_picture: '/assets/images/cover-hardware.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '23 MB',
      status: 'Published',
      inappropriate_reports: 5,
      published_at: '2020-11-26 15:45:00'
    },
    {
      seller_id: sellerIds['vijayvaishnav@gmail.com'],
      title: 'The Computer Book',
      category_id: 5,
      type_id: 3,
      pages: 320,
      description: 'Illustrated chronology of 250 milestones in the history of computer science, algorithms, software development and Internet protocols.',
      institution: 'MIT',
      country_id: 1,
      course_name: 'Computing History and Modern Systems',
      course_code: 'HIS-210',
      professor: 'Simson L. Garfinkel',
      sell_type: 'Paid',
      price: 56,
      display_picture: '/assets/images/cover-book.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '30 MB',
      status: 'Published',
      inappropriate_reports: 5,
      published_at: '2020-11-26 16:30:00'
    },
    {
      seller_id: sellerIds['priteshpanchal@gmail.com'],
      title: 'Data Science',
      category_id: 1, // Science
      type_id: 1,
      pages: 180,
      description: 'Python for data analysis, pandas, numpy, scikit-learn, statistical methods, regression models, classification and clustering.',
      institution: 'Stanford University',
      country_id: 1,
      course_name: 'Data Science Principles',
      course_code: 'DS-201',
      professor: 'Dr. Emily Vance',
      sell_type: 'Free',
      price: 0,
      display_picture: '/assets/images/cover-ds.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '10 KB',
      status: 'Published',
      inappropriate_reports: 2,
      published_at: '2020-10-09 10:10:00'
    },
    {
      seller_id: sellerIds['rahilshah@gmail.com'],
      title: 'Accounts',
      category_id: 3, // Commerce
      type_id: 2,
      pages: 240,
      description: 'Double entry bookkeeping, trial balance, ledger accounts, cash flow statements and corporate balance sheet auditing.',
      institution: 'Cambridge University',
      country_id: 3,
      course_name: 'Financial Accounting',
      course_code: 'ACC-101',
      professor: 'Prof. Mark Davis',
      sell_type: 'Paid',
      price: 22,
      display_picture: '/assets/images/cover-accounts.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '23 MB',
      status: 'Published',
      inappropriate_reports: 1,
      published_at: '2020-10-10 12:30:00'
    },
    {
      seller_id: sellerIds['anishpatel@gmail.com'],
      title: 'Social Studies',
      category_id: 4, // Social
      type_id: 2,
      pages: 150,
      description: 'Global politics, socio-economic developments, geography, cultural evolutions and modern civilization case studies.',
      institution: 'Columbia University',
      country_id: 1,
      course_name: 'Social Studies and Society',
      course_code: 'SOC-305',
      professor: 'Dr. Arthur Hall',
      sell_type: 'Paid',
      price: 56,
      display_picture: '/assets/images/cover-social.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '3 MB',
      status: 'Published',
      inappropriate_reports: 3,
      published_at: '2020-10-11 01:00:00'
    },
    {
      seller_id: sellerIds['khyatipatel@gmail.com'],
      title: 'Human Body',
      category_id: 1, // Science
      type_id: 2,
      pages: 195,
      description: 'Comprehensive human anatomy notes covering nervous system, circulatory pathways, endocrine regulation, musculoskeletal anatomy and immunology.',
      institution: 'Harvard Medical School',
      country_id: 1,
      course_name: 'Human Anatomy & Physiology',
      course_code: 'MED-110',
      professor: 'Dr. Rebecca Stone',
      sell_type: 'Paid',
      price: 78,
      display_picture: '/assets/images/cover-bio.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '12 MB',
      status: 'InReview',
      inappropriate_reports: 0,
      published_at: null
    },
    {
      seller_id: sellerIds['khyatipatel@gmail.com'],
      title: 'Software Engineering',
      category_id: 2, // IT
      type_id: 2,
      pages: 165,
      description: 'SDLC models, agile methodologies, SQA, COCOMO estimation, CPM project scheduling and SCM configuration management.',
      institution: 'GEC Modasa',
      country_id: 2, // India
      course_name: 'Software Project Management',
      course_code: '3171609',
      professor: 'Prof Nilesh D Goriya',
      sell_type: 'Free',
      price: 0,
      display_picture: '/assets/images/cover-cs.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '8 MB',
      status: 'InReview',
      inappropriate_reports: 0,
      published_at: null
    },
    {
      seller_id: sellerIds['khyatipatel@gmail.com'],
      title: 'Computer Basic',
      category_id: 5, // Computer
      type_id: 2,
      pages: 90,
      description: 'Fundamental computer awareness, binary arithmetic, office productivity software, and internet safety basics.',
      institution: 'Gujarat Technological University',
      country_id: 2,
      course_name: 'Computer Literacy',
      course_code: 'CL-101',
      professor: 'Prof S. A. Vahora',
      sell_type: 'Free',
      price: 0,
      display_picture: '/assets/images/cover-cs.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '4 MB',
      status: 'InReview',
      inappropriate_reports: 0,
      published_at: null
    },
    {
      seller_id: richardId,
      title: 'Software Development',
      category_id: 2,
      type_id: 2,
      pages: 220,
      description: 'Full stack development notes including frontend frameworks, RESTful API design, database normalization and CI/CD pipelines.',
      institution: 'University of California',
      country_id: 1,
      course_name: 'Software Engineering',
      course_code: 'CS-450',
      professor: 'Prof. Richard Brown',
      sell_type: 'Paid',
      price: 177,
      display_picture: '/assets/images/cover-cs.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '25 MB',
      status: 'Published',
      inappropriate_reports: 1,
      published_at: '2020-09-10 10:10:00'
    },
    {
      seller_id: richardId,
      title: 'World War 2',
      category_id: 6, // History
      type_id: 2,
      pages: 140,
      description: 'Timeline of events, political treaties, military campaigns in Europe and Pacific, and post-war reconstruction.',
      institution: 'University of California',
      country_id: 1,
      course_name: 'Modern World History',
      course_code: 'HIS-304',
      professor: 'Dr. Frank Miller',
      sell_type: 'Paid',
      price: 152,
      display_picture: '/assets/images/cover-social.svg',
      file_path: '/assets/sample-notes/sample-computer-science.txt',
      file_size: '14 MB',
      status: 'Published',
      inappropriate_reports: 0,
      published_at: '2020-12-10 10:10:00'
    }
  ];

  let csNoteId = 1;
  for (const n of notesData) {
    const res = await dbAsync.run(`
      INSERT INTO notes (
        seller_id, title, category_id, type_id, pages, description, institution, 
        country_id, course_name, course_code, professor, sell_type, price, 
        display_picture, file_path, file_size, preview_path, status, inappropriate_reports, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      n.seller_id, n.title, n.category_id, n.type_id, n.pages, n.description, n.institution,
      n.country_id, n.course_name, n.course_code, n.professor, n.sell_type, n.price,
      n.display_picture, n.file_path, n.file_size, n.file_path, n.status, n.inappropriate_reports, n.published_at
    ]);
    if (n.title === 'Computer Science') {
      csNoteId = res.lastID;
    }
  }

  // 6. Seed Customer Reviews (matching Note Details page 48)
  const sampleReviews = [
    {
      note_id: csNoteId,
      reviewer_id: richardId,
      rating: 5,
      comments: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry standard dummy text ever since the 1500s, an unknown.'
    },
    {
      note_id: csNoteId,
      reviewer_id: sellerIds['rahilshah@gmail.com'],
      rating: 4,
      comments: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry standard dummy text ever since the 1500s, an unknown.'
    },
    {
      note_id: csNoteId,
      reviewer_id: sellerIds['anishpatel@gmail.com'],
      rating: 4,
      comments: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    }
  ];
  for (const rev of sampleReviews) {
    await dbAsync.run(`
      INSERT INTO reviews (note_id, reviewer_id, rating, comments)
      VALUES (?, ?, ?, ?)
    `, [rev.note_id, rev.reviewer_id, rev.rating, rev.comments]);
  }

  // 7. Seed Sample Downloads / Purchase history
  await dbAsync.run(`
    INSERT INTO downloads (note_id, buyer_id, seller_id, sell_type, purchased_price, is_paid)
    VALUES (?, ?, ?, 'Paid', 15, 1)
  `, [csNoteId, johnId, richardId]);

  // 8. Seed Sample Simulated Emails (including Email Verification from manual page 51!)
  await dbAsync.run(`
    INSERT INTO simulated_emails (recipient_email, recipient_name, subject, body_html, email_type, action_link, is_read)
    VALUES (?, ?, ?, ?, 'verification', ?, 0)
  `, [
    'smith@gmail.com',
    'Smith',
    'Notes MarketPlace - Email Verification',
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <div style="margin-bottom: 25px;"><img src="/assets/images/logo.svg" alt="Notes MarketPlace" height="42" /></div>
      <h2 style="color: #6255a5; margin-bottom: 15px;">Email Verification</h2>
      <p style="font-size: 15px; color: #333333; margin-bottom: 8px;"><strong>Dear Smith,</strong></p>
      <p style="font-size: 14px; color: #555555; margin-bottom: 25px;">Thanks for Signing up!<br>Simply click below for email verification.</p>
      <div style="text-align: left; margin-bottom: 30px;">
        <a href="#/verify-email?token=smith_sample_token_123" style="background-color: #6255a5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 13px;">VERIFY EMAIL ADDRESS</a>
      </div>
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888888;">If you did not sign up for NotesMarketPlace, you can safely ignore this email.</p>
    </div>`,
    '#/verify-email?token=smith_sample_token_123'
  ]);

  await dbAsync.run(`
    INSERT INTO simulated_emails (recipient_email, recipient_name, subject, body_html, email_type, action_link, is_read)
    VALUES (?, ?, ?, ?, 'note_status', ?, 0)
  `, [
    'richardbrown77@gmail.com',
    'Richard Brown',
    'Your Note "Computer Science" is Published!',
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <div style="margin-bottom: 25px;"><img src="/assets/images/logo.svg" alt="Notes MarketPlace" height="42" /></div>
      <h2 style="color: #28a745; margin-bottom: 15px;">Note Approved & Published</h2>
      <p style="font-size: 15px; color: #333333;"><strong>Dear Richard Brown,</strong></p>
      <p style="font-size: 14px; color: #555555;">Congratulations! Your note <strong>"Computer Science"</strong> has been reviewed and approved by the administrator. It is now live on the marketplace.</p>
    </div>`,
    '#/notes/1'
  ]);

  console.log('Seeding completed successfully!');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}

module.exports = seed;
