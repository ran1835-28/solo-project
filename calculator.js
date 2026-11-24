// Pure calculation engine for RIT Co-op Offer True-Net Comparator
// Separates tax/living financial logic from UI rendering

/**
 * Estimates prorated 2026 single-filer federal income tax based on annualized co-op earnings.
 * Uses $15,000 standard deduction and progressive marginal brackets.
 */
function estimateFederalTax(termGross, weeks) {
  if (termGross <= 0 || weeks <= 0) return 0;

  const annualizedGross = (termGross / weeks) * 52;
  const standardDeduction = 15000;
  const taxableIncome = Math.max(0, annualizedGross - standardDeduction);

  const brackets = [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: Infinity, rate: 0.32 }
  ];

  let annualTax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
      annualTax += taxableInBracket * bracket.rate;
      previousLimit = bracket.limit;
    }
  }

  return (annualTax / 52) * weeks;
}

/**
 * Computes full financial breakdown for a single co-op offer object.
 */
function calculateOfferMetrics(offer) {
  const hourly = Math.max(0, Number(offer.hourly) || 0);
  const hours = Math.max(0, Number(offer.hours) || 0);
  const weeks = Math.max(1, Number(offer.weeks) || 1);
  const stipend = Math.max(0, Number(offer.stipend) || 0);
  const stateRate = Math.max(0, Number(offer.stateTax) || 0) / 100;
  const monthlyRent = Math.max(0, Number(offer.rent) || 0);
  const monthlyCommute = Math.max(0, Number(offer.commute) || 0);

  const totalHours = hourly > 0 ? hours * weeks : 0;
  const wageGross = hourly * hours * weeks;
  const totalGross = wageGross + stipend;

  const fedTax = estimateFederalTax(totalGross, weeks);
  const ficaTax = totalGross * 0.0765; // 6.2% OASDI + 1.45% Medicare
  const stateTax = totalGross * stateRate;
  const totalTaxes = fedTax + ficaTax + stateTax;

  const months = weeks / 4.333;
  const totalRent = monthlyRent * months;
  const totalCommute = monthlyCommute * months;
  const totalLiving = totalRent + totalCommute;

  const trueNet = totalGross - totalTaxes - totalLiving;
  const realHourlyNet = totalHours > 0 ? trueNet / totalHours : 0;

  // Percentage allocations of gross pay for stacked visual breakdown bars
  const safeGross = totalGross > 0 ? totalGross : 1;
  const taxPct = Math.min(100, (totalTaxes / safeGross) * 100);
  const livingPct = Math.min(100 - taxPct, (totalLiving / safeGross) * 100);
  const netPct = Math.max(0, 100 - taxPct - livingPct);

  return {
    wageGross,
    totalGross,
    fedTax,
    ficaTax,
    stateTax,
    totalTaxes,
    months,
    totalRent,
    totalCommute,
    totalLiving,
    trueNet,
    realHourlyNet,
    taxPct,
    livingPct,
    netPct
  };
}
