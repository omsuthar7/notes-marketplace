# NotesMarketplace - Academic Notes & Books Platform

A complete, production-ready, full-stack implementation of the **NotesMarketplace** platform 

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested & fully supported)
- **npm**: v9.0.0 or higher

### 2. Installation & Setup
Open your terminal in the project directory:
```bash
# Install dependencies
npm install

# Seed the SQLite database with sample data matching all manual pages & screenshots
npm run seed

# Start the application server
npm start
```

### 3. Open the App in Your Browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Demo Accounts & Pre-Configured Credentials

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@notesmarketplace.com` | `Admin@123` | Full admin privileges: review notes (approve/reject), manage members, view analytics |
| **Member (Richard)** | `richardbrown77@gmail.com` | `Password@123` | Active publisher matching Manual Page 50 (earnings, sold notes, downloads) |
| **Member (John)** | `notesmarketplace77@gmail.com` | `Password@123` | Pre-filled login from Screenshot 1 |

*(You can also register a new account on the Sign Up page and immediately activate it via the Simulated Mailbox!)*

---


---

## 📁 Project Architecture

```
NotesMarketplace/
├── package.json              # Project dependencies and startup scripts
├── server.js                 # Express server & REST API routes
├── test-api.js               # Automated 13-point API test suite
├── create-assets.js          # SVG asset generator (covers, avatars, logos)
├── database/
│   ├── db.js                 # SQLite database connection & schema
│   ├── seed.js               # Seed script with realistic academic data
│   └── notesmarketplace.db   # Persistent SQLite database file
├── uploads/                  # Upload directory for notes & cover images
├── public/
│   ├── index.html            # Main SPA container shell
│   ├── css/
│   │   ├── variables.css     # CSS variables (Light/Dark themes, purple #6255a5)
│   │   ├── style.css         # Typography, header, footer, tables, buttons
│   │   ├── auth.css          # Login & Register card layouts
│   │   ├── notes.css         # Hero banner, search filters, card grid, note details
│   │   ├── dashboard.css     # Stats cards, data tables, Add Note forms
│   │   └── widgets.css       # Payment modal, Mailbox drawer, theme toggle
│   ├── js/
│   │   ├── state.js          # Global client state (user, token, theme)
│   │   ├── api.js            # REST API client
│   │   ├── mailbox.js        # Simulated mailbox drawer component
│   │   ├── payment.js        # Simulated payment modal component
│   │   ├── auth.js           # Login, Register, Forgot Password handlers
│   │   ├── notes.js          # Search, filter, note details, Add Note handlers
│   │   ├── admin.js          # Admin dashboard, review actions, member details
│   │   ├── router.js         # Client-side hash routing
│   │   └── app.js            # Application bootstrap & event coordinator
│   └── assets/
│       ├── images/           # SVG book covers, logos, user avatars
│       └── sample-notes/     # Sample PDF/text note documents for preview
```

---

## 🧪 Testing

Run the automated test suite:
```bash
node test-api.js
```
All 13 integration tests will verify the database, authentication, note filtering, admin workflow, payment simulation, and email triggers.
