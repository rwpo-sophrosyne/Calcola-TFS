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


## Tempi di pagamento aggiornati

La pagina contiene un riepilogo delle regole INPS aggiornate dalla circolare n. 30 del 27/03/2026:

- inabilità/decesso: entro 105 giorni;
- limite di età/anzianità massima/risoluzione unilaterale per pensione anticipata: 12 mesi + 3 mesi se il requisito pensionistico è maturato entro il 31/12/2026;
- gli stessi casi: 9 mesi + 3 mesi se il requisito pensionistico è maturato dal 01/01/2027;
- scadenza contratto a tempo determinato: 12 mesi;
- altri casi, inclusi dimissioni volontarie e licenziamento/destituzione: 24 mesi + 3 mesi.

La rateizzazione resta: fino a 50.000 € una soluzione; oltre 50.000 € e sotto 100.000 € due rate; da 100.000 € tre rate. Le rate successive alla prima sono dopo 12 mesi.

Fonte primaria: INPS, Circolare n. 30 del 27 marzo 2026.

## Formato degli importi
I campi economici accettano il formato italiano, ad esempio `1.500,00`, oltre a `1327,91` e `1.500,00`. Il calcolatore normalizza internamente gli importi per il calcolo.


## Modalità B — Ultimo Miglio TFS

Il calcolatore include una modalità dedicata a chi possiede il documento **Ultimo Miglio TFS**. Gli importi sono inseriti come valori annualizzati, senza ricostruirli dal cedolino. Per gli iscritti ex ENPAS, l'INPS indica che la tredicesima non viene inserita nell'Ultimo Miglio e viene calcolata automaticamente dal gestionale TFS. Il sito la stima, a fini informativi, come 1/12 del totale annualizzato delle voci utili inserite; il prospetto ufficiale INPS resta prevalente.

Campi: trattamento stipendiale art. 2, anticipazione benefici futuri art. 1, assegno funzionale DPR 52/2009 art. 8, altre voci utili TFS e 6 scatti se documentati.


## Quale modalità usare?

**Modalità A — Cedolino:** ricostruisce la base TFS dalle voci del cedolino. **Modalità B — Ultimo Miglio TFS:** usa gli importi annualizzati certificati nell’Ultimo Miglio TFS. Per gli iscritti alla Cassa ex ENPAS, i dati retributivi dell’Ultimo Miglio sono privi della tredicesima, che viene calcolata dal gestionale TFS INPS.
