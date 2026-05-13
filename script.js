function calculate() {
  let amount = parseFloat(document.getElementById("amount").value);
  let platform = document.getElementById("platform").value;
  let country = document.getElementById("country").value;

  if (!amount || amount <= 0) {
    document.getElementById("result").innerHTML = "⚠ Enter valid amount";
    return;
  }

  // STEP 1: REAL LOGIC
  let feeRates = {
    upwork: 0.10,
    fiverr: 0.20,
    freelancer: 0.15,
    direct: 0.00
  };

  let fee = amount * feeRates[platform];
  let payout = amount - fee;

  // STEP 2: INTELLIGENCE LAYER
  let advice = "";
  let risk = "";

  if (platform === "fiverr") {
    advice = "⚡ Fiverr has high fees. Try direct clients for higher profit.";
  } 
  else if (platform === "upwork") {
    advice = "📊 Upwork is stable but long-term clients give higher income.";
  } 
  else {
    advice = "🚀 Direct clients = maximum profit potential.";
  }

  // COUNTRY INSIGHT
  if (country === "pk") {
    risk = "⚠ Currency conversion losses may reduce final payout in PKR.";
  } 
  else {
    risk = "✔ Stable international payout environment.";
  }

  // STEP 3: EMOTION HOOKS
  let hook = "";

  let lossPercent = (fee / amount) * 100;

  if (lossPercent > 15) {
    hook = "💀 You are losing a large portion of your income to platform fees.";
  } 
  else if (lossPercent > 5) {
    hook = "⚠ Moderate fee impact detected on your earnings.";
  } 
  else {
    hook = "✅ You are keeping most of your earnings.";
  }

  // FINAL OUTPUT
  document.getElementById("result").innerHTML = `
    <h3>💰 Income Breakdown</h3>
    <p>Project Amount: $${amount}</p>
    <p>Platform Fee: $${fee.toFixed(2)}</p>
    <p><b>You Receive: $${payout.toFixed(2)}</b></p>

    <hr>

    <p>${advice}</p>
    <p>${risk}</p>

    <hr>

    <h3>📊 Insight</h3>
    <p>${hook}</p>
  `;
}
