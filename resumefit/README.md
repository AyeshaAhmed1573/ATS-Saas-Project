# ResumeFit — AI-assisted ATS Resume Builder (MERN)

A full-stack SaaS: upload or write a resume, paste a job description, and get
a keyword match score plus exactly what's missing — the same signal a real
Applicant Tracking System uses to filter candidates. Multi-user workspaces
and Stripe billing are wired in and ready to activate.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer file
  uploads, pdf-parse / mammoth for text extraction, Stripe for billing.
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios.
- **Scoring engine:** a transparent, dependency-free keyword extractor/matcher
  (`backend/utils/atsScorer.js`) — no external AI API key required to run.

## Features
- Email/password auth, JWT sessions
- Every signup creates a **workspace (organization)** with an invite code;
  teammates join with that code
- Resume CRUD: write from scratch or upload a PDF/DOCX (text is extracted
  automatically)
- ATS scan: paste a job description, get a match %, matched keywords, and
  missing keywords
- Team page: see workspace members, remove members (owner/admin only)
- Billing page: Free vs Pro plans, Stripe Checkout session creation and
  webhook handler ready — just drop in real Stripe keys

## Project structure
```
resumefit/
  backend/     Express API (port 5000)
  frontend/    React + Vite app (port 5173, proxies /api to backend)
```

## Running it locally

### 1. Backend
```bash
cd backend
cp .env.example .env     # then edit MONGO_URI / JWT_SECRET
npm install
npm run dev               # nodemon, or `npm start`
```
Needs a running MongoDB — local (`mongodb://127.0.0.1:27017/resumefit`) or
a free Atlas cluster.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173. The dev server proxies `/api` calls to
`http://localhost:5000`.

## Turning on billing (optional)
1. Create a Stripe account, get a secret key and a Price ID for the Pro plan.
2. Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`, `STRIPE_WEBHOOK_SECRET` to
   `backend/.env`.
3. Point a Stripe webhook at `POST /api/billing/webhook`.
No code changes needed — the checkout/webhook logic already checks for the
key and activates itself.

## API overview
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create user + new workspace |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/join` | Join an existing workspace via invite code |
| GET | `/api/auth/me` | Current user + workspace |
| GET/POST | `/api/resumes` | List / create resumes |
| POST | `/api/resumes/upload` | Upload a PDF/DOCX resume |
| PUT/DELETE | `/api/resumes/:id` | Update / delete a resume |
| POST | `/api/ats/score` | Score a resume against a job description |
| GET | `/api/team` | List workspace members |
| DELETE | `/api/team/:userId` | Remove a member |
| GET | `/api/billing/status` | Current plan |
| POST | `/api/billing/checkout` | Create Stripe Checkout session |
| POST | `/api/billing/webhook` | Stripe webhook receiver |



## Design
Palette: ink `#12142B`, paper `#F6F5F0`, cobalt `#3D4EF2`, amber `#F2A93D`.
Source Serif 4 for headlines, Inter for UI — a document/paper feel that fits
a product about resumes, without leaning on generic SaaS-card styling.
