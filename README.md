# RIT Co-op Offer & Relocation True-Net Comparator
**Course:** MGIS 130 – Build Project (Web-App Track)  
**Author:** Rowan Nichols  
**Live App:** https://ran1835-28.github.io/solo-project/  
**Repository:** 
---

## 1. Problem Framing & Business Case
* **The Problem:** RIT students evaluating multiple co-op offers across different cities routinely anchor on gross hourly pay (e.g., choosing $35/hr in Boston or $38/hr in NYC over $25/hr in Rochester) without accounting for state/local income taxes, short-term furnished sublet premiums, and monthly transit costs.
* **Human Behavior & Cost:** Because manually looking up progressive federal tax brackets, state/city tax rates, and short-term sublet averages across three cities takes 15–25 minutes of tedious spreadsheet work, students rely on mental shortcuts ("anchoring bias" on the headline hourly rate). In a 15-week co-op term, a seemingly higher $38/hr NYC offer ($25,300 gross with stipend) leaves a student with **$11,834 true net savings**—which is **$2,000+ less** than a $35/hr Boston offer ($13,897 net) and barely ahead of a $25/hr local Rochester offer ($9,927 net) despite working in a far higher-stress commute environment.
* **The Solution:** A zero-backend, modular client-side web application hosted on GitHub Pages that computes true net take-home savings and "real hourly net pay" side-by-side for up to three offers, complete with curated RIT/co-op city benchmarks, visual paycheck allocation bars, and one-click summary export.

---

## 2. User Guide (How to Use the Tool)
1. **Open the Live App:** Navigate to the GitHub Pages link above (runs 100% in your browser; no login or installation required).
2. **Name Your Offers:** Click the dashed title header on each of the three cards (e.g., *Offer A: Rochester Local*, *Offer B: Boston Tech*) to customize the labels.
3. **Select a Location Preset (or Customize):** Use the **Location Benchmark Preset** dropdown to auto-populate realistic effective state/local tax rates, short-term furnished rent, and transit costs for common RIT co-op hubs (Rochester, Boston, NYC, Seattle, SF Bay Area, Washington DC, Austin). Editing any tax, rent, or commute input automatically switches the preset to `Custom Location`.
4. **Enter Compensation Details:** Input each offer's **Hourly Pay**, **Hours/Week**, **Duration (Weeks)**, and any lump-sum **Relocation/Housing Stipend**.
5. **Review True-Net Results:**
   * The **Decision Insight Banner** at the top highlights which offer yields the highest net savings and the exact dollar margin over the runner-up.
   * Each card displays a **stacked visual breakdown bar** (Red = Taxes, Amber = Living Costs, Green = True Net Savings) alongside **True Net Take-Home ($)** and **Real Hourly Net ($/hr)**.
6. **Save or Export:** Your inputs auto-save locally in your browser (`localStorage`). Click **Copy Comparison Summary** to copy a formatted plain-text comparison to your clipboard for emails, notes, or discussions with your co-op advisor, or **Reset Defaults** to restore sample scenarios.

---

## 3. Solution Fit & Measurable Improvement (Before vs. After)
To measure the improvement over the manual status quo, a standardized 3-offer comparison task (Rochester $25/hr vs. Boston $35/hr vs. NYC $38/hr for a 15-week term) was timed under both methods:

| Metric | Manual Process (Status Quo) | RIT Co-op Comparator (v1.0) | Measurable Improvement |
| :--- | :--- | :--- | :--- |
| **Time to Complete 3-Offer Comparison** | ~18 min 30 sec (looking up tax brackets, sublet averages, building formulas) | **~45 seconds** (selecting city presets + entering hourly rates) | **96% reduction in time** (~17.75 min saved per comparison) |
| **Tax Calculation Accuracy** | Often uses flat 20%–25% guess, ignoring standard deduction & annualized proration | Automated progressive 2026 single-filer brackets + 7.65% FICA + state/local | Eliminates marginal bracket overestimation errors |
| **What-If Sensitivity Testing** | 3–5 minutes per scenario adjustment | **Instant (<0.1 sec)** real-time recalculation & ranking | Enables rapid negotiation & housing-stipend testing |

**How Improvement Would Be Measured in Production:** Track anonymous client-side session completion counts (number of users who run a 3-offer comparison and click *Copy Comparison Summary*) and survey RIT Career Services / co-op prep students on whether the tool changed their final offer ranking.

---

## 4. Project Management Execution (Plan, Milestones & Logs)
* **Architecture & Safe-Hosting Compliance:** Modular Vanilla JS (`presets.js`, `calculator.js`, `app.js`), `styles.css`, and `index.html` deployed on GitHub Pages free tier. Zero external API keys, secrets, databases, or billing surfaces.

### Milestones & Commit Trajectory
* **Milestone 1 (Project Plan & Scope):** Initialized repository, problem framing, and scope boundaries (`docs: add one-page project plan...`).
* **Milestone 2 (Core Math Engine v0.1):** Built initial single-offer progressive federal tax, FICA, and living cost calculator (`feat: add core tax and net-pay calculation engine`).
* **Milestone 3 (Modular Architecture & Benchmarks):** Extracted curated co-op city presets (`presets.js`) and standalone math engine (`calculator.js`) (`feat: add curated RIT...`, `feat: extract modular tax...`).
* **Milestone 4 (UI, Persistence & v1.0 Integration):** Built responsive 3-column CSS with stacked visual bars (`styles.css`), state persistence + clipboard export (`app.js`), and wired full v1.0 app (`index.html`).
* **Milestone 5 (Benchmarking & Reflection):** Completed timed before/after benchmark test, user handoff docs, and AI critical evaluation.

### Status Updates
* **Status Update 1 (Plan Lock):** Project scope finalized around a zero-backend client-side architecture to eliminate paid API risks and network latency during live demo. Core tax and housing variables defined.
* **Status Update 2 (Build & Verification Complete):** Refactored initial single-file prototype into modular JS/CSS files (`presets.js`, `calculator.js`, `app.js`, `styles.css`), deployed to GitHub Pages, and verified sub-minute 3-offer comparison accuracy against manual spreadsheet checks.

### Decision Log
| Stage | Decision | Rationale |
| :--- | :--- | :--- |
| Planning | Chose client-side Vanilla JS + GitHub Pages over React/Node backend | Eliminates hosting costs/billing risk (safe-hosting rule) and guarantees zero network failure during live demo. |
| Planning | Replaced live Zillow/tax APIs with curated city preset benchmarks + custom override | External free-tier APIs frequently rate-limit or fail; presets + manual override give instant speed and full user control. |
| Build (v0.2) | Refactored single-file prototype into modular `presets.js`, `calculator.js`, `app.js`, and `styles.css` | Separates financial calculation logic from DOM manipulation, making tax math easier to audit and explain in Q&A. |
| Build (v1.0) | Added automatic switch to `Custom Location` when user edits preset tax/rent values | Prevents misleading UI state where the dropdown still says "Boston" after a user manually changes rent to $900. |
