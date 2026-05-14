/**
 * Compound Interest Calculator — Premium UI
 * Clean, modern, beginner-friendly JavaScript
 */

/* ── DOM REFERENCES ── */
const principalInput = document.getElementById('principal');
const monthlyInput   = document.getElementById('monthly');
const rateInput      = document.getElementById('rate');
const yearsInput     = document.getElementById('years');
const calcBtn        = document.getElementById('calc-btn');
const resultsSection = document.getElementById('results');
const resInvested    = document.getElementById('res-invested');
const resInterest    = document.getElementById('res-interest');
const resBalance     = document.getElementById('res-balance');
const resMultiplier  = document.getElementById('res-multiplier');
const insightBanner  = document.getElementById('insight-banner');
const insightText    = document.getElementById('insight-text');
const bbInvested     = document.getElementById('bb-invested');
const bbInterest     = document.getElementById('bb-interest');
const bbInvestedPct  = document.getElementById('bb-invested-pct');
const bbInterestPct  = document.getElementById('bb-interest-pct');
const pills          = document.querySelectorAll('.pill');

/* ── STATE ── */
let compoundFreq = 12; // default monthly

/* ── PILL SELECTION ── */
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.setAttribute('aria-pressed', 'false'));
    pill.setAttribute('aria-pressed', 'true');
    compoundFreq = parseInt(pill.dataset.freq, 10);
  });
});

/* ── INSIGHTS LIBRARY ── */
const insights = {
  low: [
    "Every journey starts with a single step. Your money is already working harder than it's sitting idle.",
    "Consistency is the secret weapon of the wealthy. Even small amounts compound into something remarkable.",
    "Starting early is the single greatest financial advantage you can give yourself."
  ],
  mid: [
    "You're on track to build real, lasting wealth. The compounding curve is beginning to accelerate.",
    "Discipline today becomes financial freedom tomorrow. You're already ahead of most people.",
    "Your patience is your portfolio's best friend. Time is literally making you richer."
  ],
  high: [
    "You could reach six figures faster than you might expect — compounding doesn't slow down, it accelerates.",
    "The wealthy don't just earn more — they let time and compounding do the heavy lifting. That's exactly what you're doing.",
    "Your money is working harder than most people ever will. This is the compound effect in full force."
  ],
  exceptional: [
    "Generational wealth territory. What starts as discipline becomes a legacy.",
    "This is what financial freedom looks like — your future self will thank you for every contribution you make today.",
    "You're not just growing money — you're buying back your future time and freedom. Remarkable."
  ]
};

function getInsight(finalBalance, multiplier) {
  if (finalBalance < 50000)       return pick(insights.low);
  if (finalBalance < 250000)      return pick(insights.mid);
  if (finalBalance < 1000000)     return pick(insights.high);
  return pick(insights.exceptional);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── NUMBER FORMAT ── */
function formatCurrency(value) {
  if (value >= 1_000_000) {
    return '$' + (value / 1_000_000).toFixed(2) + 'M';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

/* ── ANIMATED COUNTER ── */
function animateCount(element, targetValue, duration = 1200) {
  const startTime = performance.now();
  const startValue = 0;

  // Format helper that matches final output
  const fmt = (v) => {
    if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(2) + 'M';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(v);
  };

  element.classList.remove('counting');

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out quart
    const eased    = 1 - Math.pow(1 - progress, 4);
    const current  = startValue + (targetValue - startValue) * eased;

    element.textContent = fmt(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = fmt(targetValue);
      element.classList.add('counting');
    }
  }

  requestAnimationFrame(step);
}

/* ── CORE CALCULATION ── */
function calculate() {
  const P = parseFloat(principalInput.value)  || 0;  // initial investment
  const M = parseFloat(monthlyInput.value)    || 0;  // monthly contribution
  const r = parseFloat(rateInput.value)       || 0;  // annual rate %
  const t = parseFloat(yearsInput.value)      || 0;  // years
  const n = compoundFreq;                            // compounds per year

  if (r <= 0 || t <= 0) {
    showError('Please enter a valid interest rate and time period.');
    return null;
  }

  const ratePerPeriod    = r / 100 / n;
  const totalPeriods     = n * t;

  // Future value of lump sum
  const FV_principal     = P * Math.pow(1 + ratePerPeriod, totalPeriods);

  // Future value of recurring contributions (annuity due adjustment)
  // Uses standard annuity formula: M * [((1+r)^n - 1) / r]
  let FV_contributions = 0;
  if (ratePerPeriod > 0) {
    // Convert monthly contribution to per-period contribution
    const periodsPerMonth  = n / 12;
    const contributionPerPeriod = M / periodsPerMonth;
    FV_contributions = contributionPerPeriod *
      ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
  } else {
    FV_contributions = M * t * 12;
  }

  const finalBalance   = FV_principal + FV_contributions;
  const totalInvested  = P + (M * t * 12);
  const interestEarned = finalBalance - totalInvested;
  const multiplier     = totalInvested > 0 ? finalBalance / totalInvested : 1;

  return { finalBalance, totalInvested, interestEarned, multiplier };
}

/* ── SHOW ERROR (lightweight) ── */
function showError(msg) {
  calcBtn.classList.remove('loading');
  calcBtn.querySelector('.btn-text').textContent = 'Calculate Growth';
  alert(msg); // simple, accessible
}

/* ── BUTTON CLICK ── */
calcBtn.addEventListener('click', () => {
  // Loading state
  calcBtn.classList.add('loading');

  // Simulate brief async (feels intentional, not instant)
  setTimeout(() => {
    const result = calculate();
    calcBtn.classList.remove('loading');

    if (!result) return;

    const { finalBalance, totalInvested, interestEarned, multiplier } = result;

    // Reveal results section
    resultsSection.classList.add('visible');

    // Animated counters
    animateCount(resInvested, totalInvested, 1000);
    animateCount(resInterest, interestEarned, 1200);
    animateCount(resBalance,  finalBalance,   1400);

    // Multiplier label
    resMultiplier.textContent = `${multiplier.toFixed(1)}× your money`;

    // Breakdown bar
    const investedPct = Math.round((totalInvested / finalBalance) * 100);
    const interestPct = 100 - investedPct;
    bbInvested.style.width = investedPct + '%';
    bbInterest.style.width = interestPct + '%';
    bbInvestedPct.textContent = investedPct + '%';
    bbInterestPct.textContent = interestPct + '%';

    // Insight
    insightText.textContent = getInsight(finalBalance, multiplier);

    // Smooth scroll to results on mobile
    if (window.innerWidth < 700) {
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }

  }, 680);
});

/* ── RECALCULATE ON ENTER ── */
[principalInput, monthlyInput, rateInput, yearsInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calcBtn.click();
  });
});

/* ── AUTO-CALCULATE IF RESULTS ARE ALREADY VISIBLE ── */
[principalInput, monthlyInput, rateInput, yearsInput].forEach(input => {
  input.addEventListener('input', () => {
    if (resultsSection.classList.contains('visible')) {
      // Debounce light recalc
      clearTimeout(input._debounce);
      input._debounce = setTimeout(() => {
        const result = calculate();
        if (!result) return;
        const { finalBalance, totalInvested, interestEarned, multiplier } = result;
        animateCount(resInvested, totalInvested, 600);
        animateCount(resInterest, interestEarned, 700);
        animateCount(resBalance,  finalBalance,   800);
        resMultiplier.textContent = `${multiplier.toFixed(1)}× your money`;
        const investedPct = Math.round((totalInvested / finalBalance) * 100);
        const interestPct = 100 - investedPct;
        bbInvested.style.width = investedPct + '%';
        bbInterest.style.width = interestPct + '%';
        bbInvestedPct.textContent = investedPct + '%';
        bbInterestPct.textContent = interestPct + '%';
        insightText.textContent = getInsight(finalBalance, multiplier);
      }, 400);
    }
  });
});
