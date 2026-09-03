# AEN Certificate Generator

A premium, professional web-based certificate generation system for **African Entrepreneurs Network (AEN)**.

## Features

- 🔐 Admin-only authentication (JWT)
- 📋 Live certificate preview
- 🎨 Premium AEN-branded certificate design
- 📄 PDF generation (A4 landscape, print-ready)
- 🔲 QR code verification
- ✍️ Signatory management with signature uploads
- 🏷️ Brand/logo management
- 📊 Certificate history with search
- 🚫 Certificate revocation
- 📦 Bulk CSV generation
- 📱 Responsive admin dashboard

## Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Framer Motion  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose  
**PDF:** Puppeteer (Chromium)  
**Auth:** JWT + bcrypt

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or a connection string

### Setup

```bash
# Backend
cd backend
cp .env.example .env    # Edit with your MongoDB URI and secrets
npm install
npm run seed            # Creates demo admin + sample data
npm run dev             # Starts on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev             # Starts on port 5173
```

### Default Admin Login

- **Email:** admin@aen.org
- **Password:** Admin@AEN2026!

## Environment Variables

See `backend/.env.example`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `PORT` | Backend port (default: 5000) |
| `FRONTEND_URL` | Frontend URL for CORS |

## PDF Generation

Requires Puppeteer (Chromium). Puppeteer downloads Chromium automatically on first run.

## Project Structure

```
backend/
  src/
    models/        # Mongoose models
    routes/        # Express routes
    middleware/     # Auth, error handling
    utils/         # PDF generation, QR codes
    seeds/         # Demo data seeding
frontend/
  src/
    components/    # React components
    pages/         # Login, Dashboard
    hooks/         # Auth context
    services/      # API client
```

## License

Internal use — African Entrepreneurs Network



ODOs
✓  Install backend dependencies (npm install)
✓  Install frontend dependencies
✓  Check MongoDB connection status
✓  Create uploads directories (signatures, logos)
✓  Fix Signatory model - signatureUrl should be optional
☐  Install puppeteer for PDF generation
☐  Run seed script to populate database
☐  Verify backend starts successfully
☐  Verify frontend starts successfully
$ cd backend && npm install puppeteer 2>&1 | tail -10 (2m timeout)
Command timed out after 120 seconds
$ cd backend && ls node_modules/puppeteer 2>/dev/null && echo "puppeteer found" || echo "puppeteer not found" (10s timeout)
install.mjs
lib
package.json
README.md
src
$ cd backend && node -e "const p = require('puppeteer'); p.launch({headless: true, args: ['--no-sandbox']}).then(b => { console.log('Puppeteer OK'); b.close(); process.exit(0); }).catch(e => { console.error('Puppeteer error:', e.message); process.exit(1); })" 2>&1
Puppeteer error: Could not find Chrome (ver. 152.0.7977.54). This can occur if either
 1. you did not perform an installation before running the script (e.g. `npx puppeteer browsers install chrome`) or
 2. your cache path is incorrectly configured (which is: C:\Users\CeeDev\.cache\puppeteer).
For (2), check out our guide on configuring puppeteer at https://pptr.dev/guides/configuration.
Error
Agent run error: The connection kept dropping mid-response after several retries. Please check your network connection and try again.

Error: The connection kept dropping mid-response after several retries. Please check your network connection and try again.
    at suH (..\packages\agent-runtime\src\tools\stream-parser.ts:522:23)
    at async <anonymous> (..\packages\agent-runtime\src\run-agent-step.ts:543:13)
    at async tk (..\packages\agent-runtime\src\run-agent-step.ts:1206:17)
    at async EiA (unknown)
    at async KbH (unknown)
    at processTicksAndRejections (native:7:39)