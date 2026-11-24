# RIT Co-op Offer & Relocation True-Net Comparator
**Course:** MGIS 130 – Build Project (Web-App Track)  
**Author:** Rowan Nichols 
**Live App:** [Insert GitHub Pages URL once enabled]

## 1. Problem Framing & Business Case
* **The Problem:** RIT students evaluating multiple co-op offers across different cities routinely anchor on gross hourly pay (e.g., choosing $35/hr in Boston over $25/hr in Rochester) without accounting for state/local income taxes, short-term furnished sublet premiums, and commuting expenses.
* **Human Behavior & Cost:** Because researching tax brackets and short-term housing across three cities takes 20–30 minutes of manual spreadsheet work, students rely on mental shortcuts—often accepting offers that leave them with **$2,000 to $4,500 less net savings** over a 15-week semester.
* **The Solution:** A zero-backend, client-side web application hosted on GitHub Pages that calculates true net take-home cash after estimated federal/state/FICA taxes, housing, and commute costs side-by-side for up to three offers, with preset city benchmarks and an exportable decision summary.

## 2. Scope & Safe-Hosting Boundaries
* **In Scope:** Side-by-side comparison (up to 3 offers), preset city tax/rent defaults (Rochester, NYC, Boston, Seattle, Bay Area, Custom), progressive tax estimation, relocation stipend/bonus integration, visual breakdown bars, and copyable summary export.
* **Out of Scope (Deliberate Cuts):** User accounts/databases, live third-party rental scraping APIs (to guarantee zero billing/API key exposure and 100% offline/demo reliability).

## 3. Project Milestones & Sprint Schedule
* **Milestone 1 (Project Plan & Repo Setup):** Define problem framing, lock scope boundaries, initialize GitHub repo (`docs: add one-page project plan`).
* **Milestone 2 (Core Calculation Engine - v0.1):** Build HTML input structure and JavaScript progressive federal/state/FICA tax + net savings engine (`feat: build core tax and net-pay calculation engine`).
* **Milestone 3 (Multi-Offer UI & City Presets - v0.2):** Add side-by-side 3-column comparison, RIT/major-city housing presets, and visual cost breakdown bars (`feat: add multi-offer comparison cards and city benchmarks`).
* **Milestone 4 (Validation, Polish & Export - v1.0):** Add edge-case input validation, one-click text summary export, deploy to GitHub Pages (`feat: add input validation, export summary, and GitHub Pages polish`).
* **Milestone 5 (Benchmarking & Handoff Docs):** Run timed before/after benchmark test, finalize user guide and reflection + AI critique (`docs: add usage guide, benchmark results, and reflection`).

## 4. Status Updates
* **Status Update 1 (Plan Lock):** Project scope finalized around a single-file client-side web architecture to eliminate backend latency and paid API risks during the live demo. Core tax/rent calculation variables defined.
* **Status Update 2 (Build & Verification):** [To be updated upon v1.0 completion with before/after benchmark results.]

## 5. Decision Log
| Date | Decision | Rationale |
| :--- | :--- | :--- |
| Nov 23 | Chose client-side Vanilla JS + GitHub Pages over React/Node backend | Eliminates hosting costs/billing risk (safe-hosting rule) and guarantees zero network failure during live demo. |
| Nov 23 | Replaced live Zillow/tax APIs with curated city preset benchmarks + custom override | External free-tier APIs frequently rate-limit or fail; presets + manual override give instant speed and full user control. |
| Nov 23 | Limited comparison to 3 concurrent offers | Keeps UI readable on a classroom projector without horizontal scrolling while covering 95% of real student scenarios. |
