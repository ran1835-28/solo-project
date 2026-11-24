// UI Controller, State Persistence, and Summary Export for RIT Co-op Comparator

const STORAGE_KEY = "rit_coop_comparator_offers_v1";

const DEFAULT_OFFERS = [
  {
    title: "Offer A: Rochester Local",
    city: "rochester",
    hourly: 25,
    hours: 40,
    weeks: 15,
    stipend: 0,
    stateTax: 5.2,
    rent: 850,
    commute: 80
  },
  {
    title: "Offer B: Boston Tech",
    city: "boston",
    hourly: 35,
    hours: 40,
    weeks: 15,
    stipend: 2000,
    stateTax: 5.0,
    rent: 2150,
    commute: 90
  },
  {
    title: "Offer C: NYC Finance",
    city: "nyc",
    hourly: 38,
    hours: 40,
    weeks: 15,
    stipend: 2500,
    stateTax: 9.2,
    rent: 2450,
    commute: 132
  }
];

let offersState = loadOffers();

function loadOffers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 3) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read saved state from localStorage:", err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_OFFERS));
}

function saveOffers() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offersState));
  } catch (err) {
    console.warn("Could not save state to localStorage:", err);
  }
}

function formatMoney(val) {
  const sign = val < 0 ? "-" : "";
  return `${sign}$${Math.abs(val).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

function formatMoneyExact(val) {
  const sign = val < 0 ? "-" : "";
  return `${sign}$${Math.abs(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function buildCityOptions(selectedKey) {
  return Object.entries(CITY_PRESETS)
    .map(([key, preset]) => {
      const selected = key === selectedKey ? "selected" : "";
      return `<option value="${key}" ${selected}>${preset.label}</option>`;
    })
    .join("");
}

function renderApp() {
  const grid = document.getElementById("offersGrid");
  grid.innerHTML = offersState
    .map((offer, i) => {
      const presetNote = CITY_PRESETS[offer.city]?.notes || "";
      return `
        <div class="card" id="card-${i}">
          <div class="card-header">
            <input
              type="text"
              class="title-input"
              data-index="${i}"
              data-field="title"
              value="${offer.title.replace(/"/g, "&quot;")}"
              aria-label="Offer ${i + 1} Name"
            />
            <span class="badge">Best Net</span>
          </div>

          <div class="preset-group">
            <label for="city-${i}">Location Benchmark Preset</label>
            <select id="city-${i}" data-index="${i}" class="city-select">
              ${buildCityOptions(offer.city)}
            </select>
            <div class="preset-note" id="note-${i}">${presetNote}</div>
          </div>

          <div class="field-row">
            <div>
              <label for="hourly-${i}">Hourly Pay ($/hr)</label>
              <input type="number" id="hourly-${i}" data-index="${i}" data-field="hourly" value="${offer.hourly}" min="0" step="0.5" />
            </div>
            <div>
              <label for="hours-${i}">Hours / Week</label>
              <input type="number" id="hours-${i}" data-index="${i}" data-field="hours" value="${offer.hours}" min="1" max="80" />
            </div>
          </div>

          <div class="field-row">
            <div>
              <label for="weeks-${i}">Duration (Weeks)</label>
              <input type="number" id="weeks-${i}" data-index="${i}" data-field="weeks" value="${offer.weeks}" min="1" max="52" />
            </div>
            <div>
              <label for="stipend-${i}">Relocation Stipend ($)</label>
              <input type="number" id="stipend-${i}" data-index="${i}" data-field="stipend" value="${offer.stipend}" min="0" step="100" />
            </div>
          </div>

          <div class="field-row">
            <div>
              <label for="stateTax-${i}">State + Local Tax (%)</label>
              <input type="number" id="stateTax-${i}" data-index="${i}" data-field="stateTax" value="${offer.stateTax}" min="0" max="20" step="0.1" />
            </div>
            <div>
              <label for="rent-${i}">Monthly Rent + Utils ($)</label>
              <input type="number" id="rent-${i}" data-index="${i}" data-field="rent" value="${offer.rent}" min="0" step="25" />
            </div>
          </div>

          <div class="field-row">
            <div>
              <label for="commute-${i}">Monthly Commute ($)</label>
              <input type="number" id="commute-${i}" data-index="${i}" data-field="commute" value="${offer.commute}" min="0" step="10" />
            </div>
          </div>

          <div class="results" id="results-${i}"></div>
        </div>
      `;
    })
    .join("");

  attachEventListeners();
  updateCalculations();
}

function attachEventListeners() {
  document.querySelectorAll(".city-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.index);
      const cityKey = e.target.value;
      const preset = CITY_PRESETS[cityKey];

      offersState[idx].city = cityKey;
      if (preset && cityKey !== "custom") {
        offersState[idx].stateTax = preset.stateTax;
        offersState[idx].rent = preset.rent;
        offersState[idx].commute = preset.commute;

        document.getElementById(`stateTax-${idx}`).value = preset.stateTax;
        document.getElementById(`rent-${idx}`).value = preset.rent;
        document.getElementById(`commute-${idx}`).value = preset.commute;
      }

      document.getElementById(`note-${idx}`).textContent = preset ? preset.notes : "";
      saveOffers();
      updateCalculations();
    });
  });

  document.querySelectorAll("input[data-field]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.index);
      const field = e.target.dataset.field;

      if (field === "title") {
        offersState[idx].title = e.target.value;
      } else {
        const val = Math.max(0, parseFloat(e.target.value) || 0);
        offersState[idx][field] = val;

        // If user overrides preset tax/rent/commute numbers, switch dropdown to custom
        if (["stateTax", "rent", "commute"].includes(field) && offersState[idx].city !== "custom") {
          offersState[idx].city = "custom";
          document.getElementById(`city-${idx}`).value = "custom";
          document.getElementById(`note-${idx}`).textContent = CITY_PRESETS.custom.notes;
        }
      }

      saveOffers();
      updateCalculations();
    });
  });
}

function updateCalculations() {
  const computed = offersState.map((offer) => ({
    offer,
    metrics: calculateOfferMetrics(offer)
  }));

  // Rank offers by True Net Savings
  const ranked = [...computed].sort((a, b) => b.metrics.trueNet - a.metrics.trueNet);
  const best = ranked[0];
  const runnerUp = ranked[1];
  const bestIndex = computed.findIndex((item) => item === best);

  // Update top decision insight banner
  const diff = best.metrics.trueNet - runnerUp.metrics.trueNet;
  const banner = document.getElementById("summaryBanner");
  if (banner) {
    banner.innerHTML = `
      <strong>Decision Insight:</strong> <strong>${best.offer.title}</strong> leaves you with the highest estimated net savings at
      <strong>${formatMoneyExact(best.metrics.trueNet)}</strong> (${formatMoneyExact(best.metrics.realHourlyNet)}/hr net) —
      <strong>${formatMoney(diff)} more</strong> than ${runnerUp.offer.title} after taxes and living expenses.
    `;
  }

  // Render results inside each card
  computed.forEach(({ metrics }, i) => {
    const card = document.getElementById(`card-${i}`);
    if (i === bestIndex) {
      card.classList.add("winner");
    } else {
      card.classList.remove("winner");
    }

    const negClass = metrics.trueNet < 0 ? "negative" : "";

    document.getElementById(`results-${i}`).innerHTML = `
      <div class="res-line">
        <span>Gross Pay + Stipend:</span>
        <strong>${formatMoney(metrics.totalGross)}</strong>
      </div>
      <div class="res-line">
        <span>Est. Taxes (Fed/FICA/State):</span>
        <span>-${formatMoney(metrics.totalTaxes)}</span>
      </div>
      <div class="res-line">
        <span>Rent & Commute (${metrics.months.toFixed(1)} mos):</span>
        <span>-${formatMoney(metrics.totalLiving)}</span>
      </div>

      <div class="bar-container">
        <div class="bar-track" title="Taxes ${metrics.taxPct.toFixed(0)}% | Living ${metrics.livingPct.toFixed(0)}% | Net ${metrics.netPct.toFixed(0)}%">
          <div class="bar-tax" style="width: ${metrics.taxPct.toFixed(1)}%"></div>
          <div class="bar-living" style="width: ${metrics.livingPct.toFixed(1)}%"></div>
          <div class="bar-net" style="width: ${metrics.netPct.toFixed(1)}%"></div>
        </div>
        <div class="bar-legend">
          <span><span class="legend-dot" style="background:var(--tax-color)"></span>Tax ${metrics.taxPct.toFixed(0)}%</span>
          <span><span class="legend-dot" style="background:var(--living-color)"></span>Living ${metrics.livingPct.toFixed(0)}%</span>
          <span><span class="legend-dot" style="background:var(--net-color)"></span>Net ${metrics.netPct.toFixed(0)}%</span>
        </div>
      </div>

      <div class="net-box">
        <div>
          <div class="net-label">True Net Take-Home</div>
          <div class="net-amount ${negClass}">${formatMoneyExact(metrics.trueNet)}</div>
        </div>
        <div class="net-hourly">${formatMoneyExact(metrics.realHourlyNet)}/hr net</div>
      </div>
    `;
  });
}

function resetToDefaults() {
  offersState = JSON.parse(JSON.stringify(DEFAULT_OFFERS));
  saveOffers();
  renderApp();
}

function copyComparisonSummary() {
  const lines = [
    "RIT CO-OP OFFER TRUE-NET COMPARISON SUMMARY",
    "-------------------------------------------"
  ];

  offersState.forEach((offer) => {
    const m = calculateOfferMetrics(offer);
    lines.push(
      `${offer.title} (${CITY_PRESETS[offer.city]?.label || "Custom"}): ` +
        `$${offer.hourly}/hr (${offer.weeks} wks) | Gross: ${formatMoney(m.totalGross)} | ` +
        `Taxes: -${formatMoney(m.totalTaxes)} | Living: -${formatMoney(m.totalLiving)} | ` +
        `TRUE NET: ${formatMoneyExact(m.trueNet)} (${formatMoneyExact(m.realHourlyNet)}/hr net)`
    );
  });

  navigator.clipboard.writeText(lines.join("\n")).then(() => {
    const btn = document.getElementById("copyBtn");
    const original = btn.textContent;
    btn.textContent = "Copied to Clipboard!";
    setTimeout(() => {
      btn.textContent = original;
    }, 2000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resetBtn").addEventListener("click", resetToDefaults);
  document.getElementById("copyBtn").addEventListener("click", copyComparisonSummary);
  renderApp();
});
