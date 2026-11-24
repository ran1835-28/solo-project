// Curated benchmark presets for common RIT co-op destinations
// Includes effective state/local income tax rates, average short-term furnished sublet rent, and monthly transit costs
const CITY_PRESETS = {
  rochester: {
    label: "Rochester, NY (Local / RIT)",
    stateTax: 5.2,
    rent: 850,
    commute: 80,
    notes: "Assumes shared off-campus housing near Henrietta/Park Ave & gas/RTS."
  },
  boston: {
    label: "Boston / Cambridge, MA",
    stateTax: 5.0,
    rent: 2150,
    commute: 90,
    notes: "Assumes summer/fall sublet room + MBTA monthly LinkPass ($90)."
  },
  nyc: {
    label: "New York City, NY",
    stateTax: 9.2,
    rent: 2450,
    commute: 132,
    notes: "Includes NY State + NYC local resident tax + OMNY/MetroCard cap."
  },
  seattle: {
    label: "Seattle / Bellevue, WA",
    stateTax: 0.6,
    rent: 1950,
    commute: 100,
    notes: "No WA state income tax (~0.6% WA Cares/PFML payroll) + Orca transit."
  },
  bayarea: {
    label: "SF Bay Area / South Bay, CA",
    stateTax: 6.8,
    rent: 2550,
    commute: 140,
    notes: "CA progressive state tax + Caltrain/BART monthly pass."
  },
  dc: {
    label: "Washington, DC / NoVA",
    stateTax: 6.2,
    rent: 1900,
    commute: 115,
    notes: "DC/VA effective tax rate + WMATA Metro pass."
  },
  austin: {
    label: "Austin / Dallas, TX",
    stateTax: 0.0,
    rent: 1450,
    commute: 130,
    notes: "0% TX state income tax + car/gas/rideshare estimate."
  },
  custom: {
    label: "Custom Location",
    stateTax: 5.0,
    rent: 1200,
    commute: 100,
    notes: "Enter custom tax, rent, and transit figures."
  }
};
