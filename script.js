function calculate() {
  let amount = document.getElementById("amount").value;

  let fee = amount * 0.2;
  let payout = amount - fee;

  document.getElementById("result").innerText =
    "You will receive: $" + payout + " (after fees)";
}
