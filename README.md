# Calcola il tuo TFS

Calcolatore statico per una stima del **TFS / Indennità di Buonuscita** del personale militare dell'Esercito.

## Obiettivo

Il progetto separa:

1. **calcolo del TFS lordo**, ottenuto dalle voci retributive utili e dagli anni utili;
2. **parte fiscale**, che non viene ricostruita da supposizioni: per il netto l'utente inserisce i dati fiscali ufficiali del prospetto.

### Formula del TFS lordo

`TFS lordo = (retribuzione annua utile × 80% ÷ 12) × anni utili`

La retribuzione annua utile comprende la tredicesima. Le voci retributive devono essere quelle effettivamente utili ai fini TFS.

## GitHub Pages

Il sito è una semplice applicazione HTML/CSS/JavaScript, quindi non richiede backend.

Per pubblicarlo:

1. Repository → **Settings**
2. **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main`
5. Folder: `/ (root)`
6. Save

L'URL sarà del tipo:

`https://rwpo-sophrosyne.github.io/Calcola-TFS/`

## Struttura

- `index.html` — calcolatore
- `guida.html` — guida alla compilazione e fonti
- `css/style.css` — UI responsive
- `js/app.js` — calculation engine lato client

## Regola del progetto

**NON INVENTARE DATI.**

Se una voce non è documentata come utile al TFS, non viene automaticamente inclusa.

I sei scatti non vengono attribuiti automaticamente: l'utente inserisce l'importo solo se risulta riconosciuto.

La parte fiscale non ricostruisce autonomamente il quinquennio fiscale. Per il netto vengono richiesti i dati ufficiali della prestazione.

## Fonti principali

- INPS — Indennità di Buonuscita (IBU)
- Esercito Italiano — Vademecum sul trattamento economico di quiescenza e fine servizio
- Esercito Italiano — Rivista Militare, approfondimento TFS
- DPR 1032/1973
- INPS — Circolare 30/2026 per termini e rateizzazione

Questo progetto è informativo e non sostituisce la liquidazione ufficiale dell'INPS/amministrazione.
