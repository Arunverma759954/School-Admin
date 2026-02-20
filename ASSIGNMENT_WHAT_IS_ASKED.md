# Assignment – Tumse Exactly Kya Kya Poocha Hai (Clear List)

Ye document assignment ke screenshots ke hisaab se **ekdum clear** list hai: kya mandatory hai, kya optional hai, aur dashboard UI **exact copy** hai ya sirf **reference**.

---

## 1. Dashboard UI – "Aisa To Nahi Create Krna H" (Exact Copy Nahi Chahiye)

Assignment document **explicitly** likhta hai:

> *"We are also attaching a dashboard UI reference Image from the Savra platform to give you a **directional understanding** of how analytics dashboards typically appear. You **are not required to replicate the exact design**, but you **may use it as a reference for layout**."*

**Matlab:**
- **Exact same design copy karna zaroori NAHI hai.**
- Screenshot **reference** hai – layout / type of elements samajhne ke liye (sidebar, cards, charts, filters).
- Tumhe **functional requirements** poore karne hain (niche list), design apna bana sakte ho.

---

## 2. Backend – Add Krne Ko Bola Hai (Kya Kya Counts As Backend)

Assignment mein backend is tarah aata hai:

| Source | Kya bola |
|--------|----------|
| Role | **"Founding Full-Stack Engineer Intern"** → frontend + **backend** dono implied |
| Objective | **"Insights Engine that converts activity data into meaningful analytics"** → data process karna = backend logic |
| Evaluation | **"Data modeling and API design thinking"** → backend |
| Tech (optional) | **Node.js / Python, SQL / NoSQL** → backend tech |

**Backend add krne ka matlab yeh hai:**
1. **Data modeling** – dataset structure (teacher_id, teacher_name, activity_type, created_at, subject, class) + types/models.
2. **API design** – endpoints jo data serve karein (e.g. insights, teachers list, per-teacher detail).
3. **Server-side logic** – data process karna, filter karna, duplicate handle karna, analytics compute karna (backend pe, na ki sirf frontend pe).

**Is project mein backend kahan hai:**  
Next.js API routes (`app/api/*`) + `lib/data.ts` + `lib/insights.ts` = yehi backend (Node.js server + data layer). README mein "Backend" section mein detail hai.

---

## 3. Sab Clear – Kya Kya Poocha Hai Tumse (Checklist)

### A. Mandatory (Zaroor Karna Hai)

| # | Kya poocha hai | Short proof in this project |
|---|----------------|-----------------------------|
| 1 | **Teacher Insights Dashboard** (admin login type) | Login page + Dashboard + sidebar |
| 2 | **View total lessons, quizzes, assessments created per teacher** | Teachers list page + API `/api/teachers` |
| 3 | **Weekly activity trends using charts** | Dashboard par "Weekly activity (Past 7 days)" chart |
| 4 | **Filter results + per teacher analysis using a selector** | Time filters (This week/month/year) + Per teacher page + "All teachers" dropdown |
| 5 | **Dataset** – har record mein: teacher_id, teacher_name, activity_type, created_at, subject, class | `lib/data.ts` + `lib/types.ts` |
| 6 | **Backend** – data modeling + API design | `lib/insights.ts`, `app/api/insights`, `app/api/teachers`, etc. |
| 7 | **Duplicate entries handle gracefully** (hidden twist) | `lib/insights.ts` – deduplicate() |
| 8 | **Working deployed demo** (Vercel / Render / equivalent) | Deploy karke live link dena |
| 9 | **README** with Architecture decisions + Future scalability | README mein dono sections hain |
| 10 | **Code quality, clean code, no no-code platforms** | Full codebase – hand-written |

### B. Bonus (Optional – Karo To Achha)

| # | Kya poocha hai | In this project |
|---|----------------|------------------|
| 1 | **Authentication layer** | ✅ Login, logout, protected routes, Settings |
| 2 | **AI-generated insight summaries** | ✅ Done – “AI Pulse Summary” on Dashboard (data-driven, no external API) |

### C. UI Reference (Copy Nahi, Reference)

| Kya hai | Kya karna hai |
|---------|----------------|
| Attached dashboard / per teacher UI image | **Exact replicate nahi.** Use as **reference for layout** (sidebar, cards, charts, filters, export button). Apna design bana sakte ho, bas **features** poore hone chahiye. |

---

## 4. Submission Mein Kya Dena Hai

- **GitHub repository** link  
- **Live deployment** link  
- **README** – architecture decisions + future scalability (optional improvements)

---

## 5. Short One-Liner Summary

**"Sab clear ab kya kya poocha h mujhse"** ka answer:

- **Dashboard UI:** Reference diya hai, **exact aisa banana zaroori nahi**; layout type same rakho, features poore karo.  
- **Backend:** **Add karna hai** – data modeling + API + server-side logic (is project mein Next.js API + `lib/` se ho raha hai).  
- **Mandatory:** Dashboard (insights + per teacher), charts, filters, selector, dataset structure, duplicate handling, deployed demo, README.  
- **Bonus:** Auth (done), AI insights (done – AI Pulse Summary on Dashboard).

Is hisaab se tumhara project **sab pooche gaye points** cover karta hai; kuch rehta nahi.
