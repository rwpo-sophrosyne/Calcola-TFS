const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("it-IT", {style:"currency", currency:"EUR"});

function n(id){ const v = parseFloat($(id).value); return Number.isFinite(v) ? v : 0; }

function usefulYears(){
  if ($("certifiedToggle").checked) {
    const v = Math.floor(n("certifiedYears"));
    return v > 0 ? v : 0;
  }
  const y = Math.max(0, Math.floor(n("years")));
  const m = Math.max(0, Math.min(11, Math.floor(n("months"))));
  return y + (m > 6 ? 1 : 0);
}

function calculate(){
  const years = usefulYears();
  const monthly = ["salary","ria","iis","temporary","functional","otherMonthly"].reduce((s,id)=>s+n(id),0);
  const annual = monthly * 12 + n("thirteenth") + n("sixSteps");
  const base80 = annual * 0.80;
  const gross = years > 0 ? base80 / 12 * years : 0;

  $("usefulYears").textContent = years;
  $("annualUseful").textContent = money.format(annual);
  $("base80").textContent = money.format(base80);
  $("grossTfs").textContent = money.format(gross);
  return {years, annual, base80, gross};
}

function calculateTax(){
  const c = calculate();
  const rate = n("taxRate") / 100;
  const law244 = n("law244");
  const rr = n("referenceIncome");

  if (!c.gross || !rate) {
    $("taxResult").classList.remove("hidden");
    $("taxResult").innerHTML = "<strong>Inserisci il TFS lordo e l'aliquota ufficiale applicata al TFS.</strong>";
    return;
  }

  const nonTaxable = c.gross * 0.2604;
  const annualReduction = 309.87 * c.years;
  const taxable = Math.max(0, c.gross - nonTaxable - annualReduction);
  const taxBeforeReduction = taxable * rate;
  const tax = Math.max(0, taxBeforeReduction - law244);
  const net = Math.max(0, c.gross - tax);

  $("taxResult").classList.remove("hidden");
  $("taxResult").innerHTML = `
    <div><span>TFS lordo</span><strong>${money.format(c.gross)}</strong></div>
    <div><span>Abbattimento 26,04%</span><strong>− ${money.format(nonTaxable)}</strong></div>
    <div><span>Riduzione €309,87 × ${c.years} anni</span><strong>− ${money.format(annualReduction)}</strong></div>
    <div><span>Base imponibile fiscale</span><strong>${money.format(taxable)}</strong></div>
    ${rr ? `<div><span>Reddito di riferimento inserito</span><strong>${money.format(rr)}</strong></div>` : ""}
    <div><span>Imposta prima della riduzione L.244/2007</span><strong>${money.format(taxBeforeReduction)}</strong></div>
    <div><span>Riduzione L.244/2007</span><strong>− ${money.format(law244)}</strong></div>
    <div><span>Imposta indicativa</span><strong>${money.format(tax)}</strong></div>
    <div class="net">TFS NETTO INDICATIVO: ${money.format(net)}</div>
    <p class="hint">Il netto è indicativo: l'aliquota inserita deve essere quella ufficiale applicata alla prestazione. Il calcolatore non ricostruisce lo storico fiscale quinquennale.</p>`;
}

["years","months","certifiedYears","salary","ria","iis","temporary","functional","otherMonthly","thirteenth","sixSteps"].forEach(id => $(id).addEventListener("input", calculate));
$("certifiedToggle").addEventListener("change", ()=>{
  $("certifiedBox").classList.toggle("hidden", !$("certifiedToggle").checked);
  calculate();
});
$("calculateTax").addEventListener("click", calculateTax);
calculate();
