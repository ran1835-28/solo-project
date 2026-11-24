# Project Reflection & AI Critical Evaluation
**Project:** RIT Co-op Offer & Relocation True-Net Comparator  
**Course:** MGIS 130 – Information Systems & Technology  
**Author:** Rowan Nichols  

---

## 1. MIS Concepts Applied in the Build
Building the **RIT Co-op Offer & Relocation True-Net Comparator** translated core Management Information Systems (MIS) concepts from theory into working software:

* **Information Asymmetry & Bounded Rationality in Decision Support Systems (DSS):** In organizational and personal decision-making, users rarely make optimal choices when raw data is scattered across disconnected sources (IRS tax tables, state revenue sites, and sublet listings). By transforming raw inputs (hourly rate, weeks, city) into standardized decision metrics (**True Net Take-Home** and **Real Hourly Net**), this tool functions as a lightweight Decision Support System that overcomes cognitive anchoring on gross pay.
* **Separation of Concerns (Three-Layer Architecture):** Expanding on D2's layered architecture principles, I refactored the early single-file `v0.1` prototype into distinct modules: a data/reference layer (`presets.js`), a business-logic calculation layer (`calculator.js`), and a presentation/state controller (`app.js` + `styles.css` + `index.html`). Keeping tax formulas pure and decoupled from DOM updates made debugging dramatically faster and ensured calculations remained deterministic.
* **Scope Management & Risk Mitigation:** A major MIS project failure mode is over-engineering integrations that introduce cost or single points of failure. Deliberately cutting live rental-scraping APIs and backend databases in favor of curated benchmarks, custom overrides, and browser `localStorage` satisfied the safe-hosting constraint (zero billing risk) while guaranteeing instant response times during live use.

---

## 2. AI Tool Critical Evaluation (Where AI Helped, Failed, and What I Changed)
Throughout this sprint, I used an AI coding assistant as a thought partner and pair programmer—for scoping the problem, structuring the modular file architecture, and generating initial HTML/CSS/JS boilerplate. However, treating AI output as a first draft rather than finished truth was essential, as several concrete flaws surfaced during testing:

1. **Tax Proration Logic Flaw (Annual vs. Co-op Term Mismatch):**  
   * *What AI Produced:* In an early draft of the tax calculation logic, applying progressive tax brackets directly to a 15-week co-op gross income (~$16,800) treated the student's 4-month co-op earnings as if that were their entire annual income—resulting in almost $0 estimated federal tax after applying the $15,000 standard deduction.  
   * *Why It Was Wrong:* While a student with zero other income that year might get a refund next spring, payroll withholding and realistic tax-burden comparisons annualize periodic paychecks (or account for students working two co-op blocks/internships in a calendar year). Underestimating taxes made high-tax cities like NYC look artificially attractive.  
   * *What I Changed & Why:* I revised `estimateFederalTax()` in `calculator.js` to annualize the term gross (`(termGross / weeks) * 52`), apply the standard deduction and marginal brackets on the annualized figure, and prorate back to the co-op duration (`(annualTax / 52) * weeks`). This produced realistic effective withholding comparisons across states.

2. **Stale UI State on Preset Overrides:**  
   * *What AI Produced:* The initial preset dropdown populated the tax, rent, and commute fields cleanly, but if a user selected "Boston" and then manually typed `$900` into the rent box, the dropdown still displayed `"Boston / Cambridge, MA"`.  
   * *Why It Was Wrong:* This created misleading UI feedback—a screenshot or exported summary would claim the numbers represented Boston benchmarks even after the user altered them.  
   * *What I Changed & Why:* I added event-listener logic in `app.js` that monitors manual edits to `stateTax`, `rent`, or `commute` and automatically switches the dropdown state and helper note to `Custom Location`.

3. **Unrealistic "Textbook" Tax Rates vs. Effective Co-op Rates:**  
   * *What AI Produced:* Initial city presets used top marginal state tax rates (e.g., 10.9% for NY State + 3.876% for NYC = ~14.8%) rather than effective rates for a single filer earning ~$20k–$45k.  
   * *What I Changed & Why:* I calibrated `presets.js` to reflect realistic *effective* combined state/local rates (e.g., 9.2% for NYC, 5.2% for Rochester, 0.6% for Washington's payroll taxes) and added explanatory notes beneath each dropdown so users understand the assumptions.

---

## 3. What I Would Do Differently Next Time
* **Start with Modular Files from Commit #1:** Starting with a single-file `index.html` prototype in `v0.1` required extra effort to split CSS and JS cleanly later. In future projects, I would scaffold `index.html`, `styles.css`, and separate JS modules from the initial commit.
* **Add Housing-Stipend Taxability Toggle:** Currently, relocation stipends are added to gross taxable income (which matches IRS rules for lump-sum cash stipends), whereas direct corporate-paid housing is sometimes tax-free. Adding a "Tax-Free Corporate Housing" checkbox would make the model even more accurate for large tech co-ops.
* **User Testing Earlier:** Testing the preset numbers with two classmates who recently completed Boston and NYC co-ops immediately highlighted realistic sublet price ranges; gathering that user feedback before writing code would have saved calibration iterations.
