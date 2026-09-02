const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("it-IT", {style:"currency", currency:"EUR"});

function parseLocaleNumber(value){
  if (typeof value !== "string") return Number(value) || 0;
  let s = value.trim().replace(/\s/g, "").replace(/'/g, "");
  if (!s) return 0;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if (hasComma && hasDot) {
    // Italian format: 1.327,91
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    s = s.replace(",", ".");
  } else if (hasDot) {
    const parts = s.split(".");
    // A single dot followed by exactly 3 digits is treated as a thousands separator.
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) {
      s = parts.join("");
    } else if (parts.length > 2) {
      // Multiple dots: treat the last one as the decimal separator.
      s = parts.slice(0, -1).join("") + "." + parts[parts.length - 1];
    }
  }

  const v = Number(s);
  return Number.isFinite(v) ? v : 0;
}

function n(id){ return parseLocaleNumber($(id).value); }

const moneyInputIds = [
  "salary","ria","iis","temporary","functional","otherMonthly",
  "thirteenth","sixSteps","umSalary","umBenefits","umFunctional","umOther","umSixSteps","referenceIncome","law244"
];

moneyInputIds.forEach(id => {
  $(id).addEventListener("blur", () => {
    const value = parseLocaleNumber($(id).value);
    if ($(id).value.trim() !== "" && Number.isFinite(value)) {
      $(id).value = value.toLocaleString("it-IT", {minimumFractionDigits:2, maximumFractionDigits:2});
    }
  });
});

$("taxRate").addEventListener("blur", () => {
  const value = parseLocaleNumber($("taxRate").value);
  if ($("taxRate").value.trim() !== "" && Number.isFinite(value)) {
    $("taxRate").value = value.toLocaleString("it-IT", {minimumFractionDigits:2, maximumFractionDigits:2});
  }
});

function usefulYears(){
  if ($("certifiedToggle").checked) {
    const v = Math.floor(n("certifiedYears"));
    return v > 0 ? v : 0;
  }
  const y = Math.max(0, Math.floor(n("years")));
  const m = Math.max(0, Math.min(11, Math.floor(n("months"))));
  return y + (m > 6 ? 1 : 0);
}

let calculationMode = "cedolino";

function calculate(){
  const years = usefulYears();
  let annual = 0;
  let detail = {};

  if (calculationMode === "ultimoMiglio") {
    const treatment = n("umSalary");
    const benefits = n("umBenefits");
    const functional = n("umFunctional");
    const other = n("umOther");
    const sixSteps = n("umSixSteps");
    // Per gli iscritti ex ENPAS la 13ª è esclusa dagli importi annualizzati
    // comunicati nell'Ultimo Miglio e viene calcolata dal gestionale TFS.
    // Il sito la stima, a fini informativi, come 1/12 del totale annualizzato
    // delle voci utili inserite. Il prospetto ufficiale INPS resta prevalente.
    const annualWithoutThirteenth = treatment + benefits + functional + other + sixSteps;
    const thirteenth = annualWithoutThirteenth / 12;
    annual = annualWithoutThirteenth + thirteenth;
    detail = {treatment, benefits, functional, other, sixSteps, thirteenth};
  } else {
    const monthly = ["salary","ria","iis","temporary","functional","otherMonthly"].reduce((s,id)=>s+n(id),0);
    annual = monthly * 12 + n("thirteenth") + n("sixSteps");
    detail = {monthly, thirteenth:n("thirteenth"), sixSteps:n("sixSteps")};
  }

  const base80 = annual * 0.80;
  const gross = years > 0 ? base80 / 12 * years : 0;

  $("usefulYears").textContent = years;
  $("annualUseful").textContent = money.format(annual);
  $("base80").textContent = money.format(base80);
  $("grossTfs").textContent = money.format(gross);
  return {years, annual, base80, gross, mode:calculationMode, detail};
}


function calculateTiming(){
  const reason = $("cessationReason").value;
  const pensionYear = parseInt($("pensionYear").value, 10);
  let title = "";
  let detail = "";

  if (!reason) {
    $("timingResult").classList.remove("hidden");
    $("timingResult").innerHTML = "<strong>Seleziona la causa di cessazione.</strong>";
    return;
  }

  if (reason === "inability_death") {
    title = "Entro 105 giorni dalla cessazione";
    detail = "Per cessazione dal servizio per inabilità o decesso.";
  } else if (reason === "age_service") {
    if (Number.isFinite(pensionYear) && pensionYear >= 2027) {
      title = "Dopo 9 mesi, ed entro i 3 mesi successivi";
      detail = "Regola applicabile ai soggetti che maturano il requisito pensionistico dal 1° gennaio 2027, nei casi previsti dalla circolare INPS n. 30/2026.";
    } else if (Number.isFinite(pensionYear) && pensionYear <= 2026) {
      title = "Dopo 12 mesi, ed entro i 3 mesi successivi";
      detail = "Regola applicabile ai soggetti che maturano il requisito pensionistico entro il 31 dicembre 2026.";
    } else {
      title = "12 mesi oppure 9 mesi";
      detail = "Inserisci l'anno di maturazione del requisito pensionistico per distinguere la disciplina precedente da quella applicabile dal 2027.";
    }
  } else if (reason === "fixed_term") {
    title = "12 mesi";
    detail = "Per la scadenza del contratto a tempo determinato, secondo la disciplina richiamata dall'INPS.";
  } else if (reason === "other") {
    title = "Dopo 24 mesi, ed entro i 3 mesi successivi";
    detail = "Per gli altri casi di cessazione indicati dall'INPS, tra cui dimissioni volontarie e licenziamento/destituzione.";
  }

  $("timingResult").classList.remove("hidden");
  $("timingResult").innerHTML = `<strong>${title}</strong><p>${detail}</p><p class="hint">Disclaimer: termine normativo indicativo; la data effettiva dipende dalla lavorazione della pratica e dalla posizione individuale.</p>`;
}

function calculateTax(){
  const c = calculate();
  const rate = parseLocaleNumber($("taxRate").value) / 100;
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

["years","months","certifiedYears","salary","ria","iis","temporary","functional","otherMonthly","thirteenth","sixSteps","umSalary","umBenefits","umFunctional","umOther","umSixSteps"].forEach(id => $(id).addEventListener("input", calculate));
$("certifiedToggle").addEventListener("change", ()=>{
  $("certifiedBox").classList.toggle("hidden", !$("certifiedToggle").checked);
  calculate();
});

function setCalculationMode(mode){
  calculationMode = mode;
  const ultimo = mode === "ultimoMiglio";
  $("modeA").classList.toggle("hidden", ultimo);
  $("modeB").classList.toggle("hidden", !ultimo);
  $("modeCedolino").classList.toggle("active", !ultimo);
  $("modeUltimoMiglio").classList.toggle("active", ultimo);
  calculate();
}

$("modeCedolino").addEventListener("click", ()=>setCalculationMode("cedolino"));
$("modeUltimoMiglio").addEventListener("click", ()=>setCalculationMode("ultimoMiglio"));
$("calculateTax").addEventListener("click", calculateTax);
$("calculateTiming").addEventListener("click", calculateTiming);
calculate();
