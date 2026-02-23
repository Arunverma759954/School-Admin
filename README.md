# School Admin Details – Teacher Insights Dashboard

A **Teacher Insights Dashboard** for school administrators (principals) to get an overview of teacher performance. Built with **Next.js 14**, TypeScript, Tailwind CSS, and Recharts.

## Features

- **Insights Dashboard**: Total lessons, quizzes, and assessments created per teacher; weekly activity trends (charts); time filters (This week / This month / This year); **AI Pulse Summary** (data-driven insight lines, bonus).
- **Per Teacher Analysis**: Teacher selector (All teachers dropdown), performance overview (Created, Conducted, Assigned, Live Engagement Score), subject and classes taught, class-wise breakdown (Avg Score & Completion) chart, recent activity, and Export Overview (JSON download).
- **Authentication** (bonus): Login at `/login` (e.g. admin@savra.com / admin123). Protected routes, Settings, Logout, user name in sidebar.
- **Duplicate handling**: The system deduplicates activity records by `(teacher_id, activity_type, created_at, subject, class)` so duplicate entries are counted once (assignment “hidden twist”).
- **Data model**: Each record has `teacher_id`, `teacher_name`, `activity_type` (lesson / quiz / assessment), `created_at`, `subject`, `class` as required.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (line/area and bar charts)
- **date-fns** (date filtering)
- **lucide-react** (icons)

## Backend (Assignment ke hisaab se)

Assignment mein **data modeling, API design, aur Node.js / SQL–NoSQL** ki baat thi. Is project mein backend yeh hai:

### Server (Node.js)
- **Next.js API routes** – sab logic **server-side** chalti hai (Node.js). Frontend sirf API ko call karta hai.
- Routes: `app/api/insights/route.ts`, `app/api/teachers/route.ts`, `app/api/teachers/selector/route.ts`, `app/api/teachers/[id]/route.ts`.

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|--------|
| GET | `/api/insights?range=week\|month\|year` | Dashboard cards (active teachers, lessons, quizzes, assessments, retention) + weekly activity data |
| GET | `/api/teachers?range=...` | Teachers list with lesson/quiz/assessment counts per teacher |
| GET | `/api/teachers/selector` | All teachers for dropdown (per teacher analysis) |
| GET | `/api/teachers/[id]?range=...` | Single teacher: summary, class-wise breakdown (assigned/completed/avgScore), recent activity |

### Data layer (Data modeling)
- **`lib/types.ts`** – types: `ActivityRecord`, `TeacherSummary`, `TimeRange`, `ClassWiseBreakdown`, etc.
- **`lib/data.ts`** – dummy dataset (assignment wale fields: `teacher_id`, `teacher_name`, `activity_type`, `created_at`, `subject`, `class`).
- **`lib/insights.ts`** – business logic:
  - **Deduplication** (assignment “hidden twist”) – same record ek hi baar count
  - `getTeacherSummaries`, `getInsightsCards`, `getWeeklyActivity`, `getTeacherById`, `getClassWiseBreakdown`, `getRecentActivity`, `getAllTeachersForSelector`

### Assignment se match
- **Data modeling** → `lib/types.ts` + `lib/data.ts` + `lib/insights.ts`.
- **API design** → REST-style GET APIs, query params (`range`), 404 for missing teacher.
- **Node.js** → Next.js API routes = Node.js server.
- **SQL/NoSQL** → Ab in-memory data; README “Future scalability” mein DB add karne ka option likha hai.

---

## HR Excel Data (Savra_Teacher Data Set.xlsx)

Dashboard **HR ke bheje hue Excel** se data le sakta hai:

1. Excel file ko project ke andar **`data/`** folder mein copy karo:  
   `f:\School-admin-details\data\Savra_Teacher Data Set.xlsx`
2. Server **restart** karo (`npm run dev` band karke dubara chalao).  
3. Ab dashboard par Excel wala data dikhega. File nahi hogi to dummy data chalega.

Expected columns: `teacher_id`, `teacher_name`, `activity_type`, `created_at`, `subject`, `class` (names thode alag ho to bhi map ho jate hain). Zyada detail ke liye `data/README.md` dekho.

---

## Getting Started

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in the browser (if port 3000 is busy, Next.js may use 3001 — check the terminal). Use the sidebar: **Dashboard**, **Teachers**, **Per teacher analysis**, **Students**, **Classrooms**, **Assessments**, **Reports**.

### If you see 404 for JS/CSS (layout.css, main-app.js, page.js, etc.)

1. **Pehle dev server band karo** – jis terminal mein `npm run dev` chal raha hai, wahan **Ctrl+C** dabao.
2. **Clean karke dubara chalao** (PowerShell):
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   npm run dev
   ```
3. Browser mein **http://localhost:3000** open karo (file:// mat use karo). **Ctrl+Shift+R** se hard refresh karo.
4. **Production:** `npm run build` phir `npm start`; app hamesha Next.js server se serve karo.

## Architecture Decisions

1. **Data layer**: In-memory dummy dataset in `lib/data.ts` with a deduplication step in `lib/insights.ts`. All analytics (summaries, weekly trends, class-wise breakdown, recent activity) are computed from this single deduplicated source so duplicate entries are handled gracefully.

2. **API design**: REST-style routes under `app/api/`:
   - `GET /api/insights?range=week|month|year` – dashboard cards and weekly activity.
   - `GET /api/teachers?range=...` – list of teachers with lesson/quiz/assessment counts.
   - `GET /api/teachers/selector` – list of teachers for the dropdown.
   - `GET /api/teachers/[id]?range=...` – single teacher detail, class-wise breakdown, recent activity.

3. **Time range**: All insights and per-teacher data respect the selected range (week / month / year) for consistent filtering.

4. **UI**: Single layout with a fixed sidebar (SAVRA branding, Dashboard, Teachers, Per teacher analysis, Students, Classrooms, Assessments, Reports) and a main content area. Dashboard has Admin Companion header, time filters, five insight cards, weekly activity chart, and Attribute Summary (assignment wording). Per teacher analysis has Search here, Create, All teachers dropdown, This Week/Month/Year filters, teacher name and Performance Overview, Subject and Class Taught, Sessions Created / Sessions Conducted / Assessments Assigned, Class-wise Breakdown (Assigned vs Completion), Recent Activity, and Export History.

## Future Scalability Improvements

- **Database**: Replace in-memory data with a DB (e.g. PostgreSQL or MongoDB), store activities in a table/collection and run aggregations via queries or a small service layer.
- **Caching**: Add caching (e.g. Redis or Next.js cache) for heavy aggregation endpoints.
- **Pagination**: Paginate teacher list and recent activity when data grows.
- **Authentication**: Add an auth layer (e.g. NextAuth) for admin-only access.
- **Real-time**: Optionally use WebSockets or polling for live activity updates.
- **AI-generated summaries**: Optional bonus – generate short insight summaries (e.g. “Grade 7 teachers created 40% more quizzes this week”) using an LLM API.

## Deployment (Vercel)

### Deploy steps (DEPLOYMENT_NOT_FOUND avoid karne ke liye)

1. **Vercel pe jao:** [vercel.com](https://vercel.com) → Login (GitHub se).
2. **New Project:** "Add New" → "Project" → GitHub repo **Arunverma759954/School-Admin** select karo.
3. **Settings:**  
   - Framework: **Next.js** (auto-detect).  
   - Build Command: `npm run build`  
   - Output: default (leave blank).  
   - Root Directory: blank.  
4. **Deploy** dabao. Pehli baar build chalegi – 2–3 min wait karo.
5. **Live URL:** Build success ke baad "Visit" / production URL open karo. Ye hi tumhara **live link** hai (e.g. `https://school-admin-xxx.vercel.app`).

### Agar "DEPLOYMENT_NOT_FOUND" / 404 aaye

- **Sahi URL use karo:** Vercel Dashboard → Project → "Domains" ya "Deployments" se **production URL** copy karke open karo. Purana / galat link mat use karo.
- **Deployment create karo:** "Deployments" tab → "Redeploy" (latest commit pe) ya naya deploy trigger karo. Failed deploy pe 404 aata hai – build logs check karo.
- **Build fix karo:** Build fail ho to Vercel "Building" page pe error dikhayega. Wahi fix karo (e.g. `npm run build` local pe chalake dekho), commit + push, phir Vercel auto redeploy karega.

### Render / Other

- **Render:** Web Service; Build: `npm run build`, Start: `npm start`.
- **Other:** `npm run build` then `npm start`; `NODE_ENV=production`.

Deployed app HTTPS pe chalni chahiye; assignment ke liye **live deployment link** submit karo.

## Assignment Checklist

- [x] View total lessons, quizzes, assessments per teacher  
- [x] Weekly activity trends (charts)  
- [x] Filter by time (This week / month / year)  
- [x] Per teacher analysis with teacher selector  
- [x] Dataset with required fields and duplicate handling  
- [x] Next.js, clean structure, readable code  
- [x] README with architecture and scalability notes  
- [x] Authentication (login, logout, protected routes, Settings)  
- [x] Per teacher: Created, Conducted, Assigned, Live Engagement Score; Class-wise Avg Score & Completion; Export Overview; empty state text  
- [x] AI-generated insight summaries (bonus) – AI Pulse Summary on Dashboard  

---

## Assignment Requirements vs Implementation (HR / Screenshot-wise)

Below is how each assignment requirement (from the given screenshots and docs) maps to this project.

### 1. Round 2 – Problem Statement (Core Tasks)

| Requirement | Done | Where in project |
|-------------|------|------------------|
| Build Teacher Insights Dashboard (admin login style) | ✅ | Login at `/login`, then Dashboard (admin view) |
| Principal gets overview of teacher performance | ✅ | Dashboard + Teachers list + Per teacher analysis |
| View total lessons, quizzes, and assessments created **per teacher** | ✅ | `/teachers` list + API `GET /api/teachers?range=...` |
| See **weekly activity trends** using charts | ✅ | Dashboard – “Weekly activity (Past 7 days)” area chart |
| Filter results and view **per teacher analysis** using a **selector** | ✅ | `/per-teacher` – “All teachers” dropdown + time filters |

### 2. First Screenshot – Admin Companion (Insights Dashboard)

| UI element | Done | Where |
|------------|------|--------|
| SAVRA logo in sidebar | ✅ | `components/Sidebar.tsx` |
| Nav: Dashboard, Teachers, Per teacher analysis, Students, Classrooms, Assessments, Reports | ✅ | Same sidebar |
| User profile at bottom (avatar, name, role) | ✅ | Sidebar – from logged-in user (e.g. Mohan Ray, Admin) |
| Header: “Admin Companion” + “Beta – See what’s happening across your school.” | ✅ | `app/page.tsx` |
| Search bar, Create button, All Subjects dropdown | ✅ | Dashboard header |
| Insights section + time filters (This week / This month / This year) | ✅ | Dashboard – Insights + pill buttons |
| 5 cards: Active teachers, Assessments created, Lessons created, Quizzes created, Retention rate | ✅ | Dashboard – metric cards |
| Weekly activity (Past 7 days) chart – Lessons, Quizzes, Assessments | ✅ | Recharts area chart (teal, blue, purple) |
| Attribute Summary – 3 bullet points (assignment wording) | ✅ | Dashboard – “teachers reached the maximum limit…”, “make sure the assessments…”, “Add more lessons…” |

### 3. Second Screenshot – Per Teacher Analysis

| UI element | Done | Where |
|------------|------|--------|
| Page title “Per teacher analysis” | ✅ | Top of `app/per-teacher/page.tsx` |
| Sidebar: Settings, Logout; user name at bottom | ✅ | `Sidebar.tsx` – Settings link, Logout button, user from auth |
| Teacher name + “Performance Overview” | ✅ | Per teacher page |
| Subject, Classes Taught | ✅ | Same section |
| Search (e.g. “Search Dipaali”), Create, All Sessions dropdown | ✅ | Header – search placeholder, Create, “All Sessions” select |
| All teachers dropdown + Time filters (This Week / Month / Year) | ✅ | Teacher select + time pills |
| 4 metric cards: Created, Conducted, Assigned, Live Engagement Score | ✅ | Four cards + description for Live Engagement Score |
| Class-wise Breakdown – Avg Score & Completion | ✅ | Bar chart – `avgScore` and `completed` |
| Recent Activity – “No Recent Activity” + “No data available on conducted session.” | ✅ | Empty state text when no activity |
| Export Overview (orange button) | ✅ | Floating orange “Export Overview” button |

### 4. Dataset (Assignment Spec)

| Field | Done | Where |
|-------|------|--------|
| `teacher_id` | ✅ | `lib/data.ts`, `lib/types.ts` |
| `teacher_name` | ✅ | Same |
| `activity_type` (lesson / quiz / assessment) | ✅ | Same |
| `created_at` | ✅ | Same |
| `subject` | ✅ | Same |
| `class` | ✅ | Same |
| Use dummy dataset or own structured dataset | ✅ | `lib/data.ts` – dummy data with sample teachers and dates |

### 5. Technical Expectations (Backend bhi assignment mein tha)

| Requirement | Done | Where |
|-------------|------|--------|
| Any tech stack OK; recommended Next.js / React, **Node**, SQL/NoSQL | ✅ | Next.js 14, React, **Node (API routes)** |
| **Data modeling** and **API design** thinking | ✅ | `lib/types.ts`, `lib/data.ts`, `lib/insights.ts`; `app/api/*` – REST APIs |
| **Backend** (server-side logic, APIs) | ✅ | Next.js API routes = Node server; 4 endpoints – insights, teachers list, selector, teacher by id |
| Focus on system thinking, working implementation, clean code | ✅ | Structure: `app/`, `lib/`, `components/`, `app/api/` |
| Working deployed demo (Vercel, Render, etc.) | ✅ | README – Deployment section; app is deployable as-is |

### 6. Important Guidelines

| Requirement | Done | Where |
|-------------|------|--------|
| No no-code platforms (Lovable, emergent, etc.) | ✅ | Full codebase – hand-written Next.js/React |
| AI tools OK; final system must reflect your implementation | ✅ | Code is editable, structured, and understandable |
| **Hidden twist: handle duplicate entries gracefully** | ✅ | `lib/insights.ts` – `deduplicate()` by teacher_id, activity_type, created_at, subject, class |
| README: Architecture decisions | ✅ | README – “Architecture Decisions” |
| README: Future scalability improvements | ✅ | README – “Future Scalability Improvements” |
| Submission: GitHub link, live deployment link, README | ✅ | Repo + deploy to Vercel/Render; README covers all |

### 7. Bonus (Optional)

| Bonus | Done | Where |
|-------|------|--------|
| Authentication layer | ✅ | Login at `/login`, AuthContext, protected routes, Settings, Logout |
| AI-generated insight summaries | ✅ | Data-driven “AI Pulse Summary” on Dashboard (no external API) |

---

**Summary:** All **mandatory** and **optional bonus** assignment requirements are implemented, including AI-style insight summaries (data-driven “AI Pulse Summary” on Dashboard).

## License

MIT.
