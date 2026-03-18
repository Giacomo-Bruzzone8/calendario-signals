# Timeline Circolare — Introduzione

Il **Timeline Circolare** è un componente progettato per rappresentare il ciclo completo delle 24 ore attraverso una visualizzazione radiale, intuitiva e semanticamente coerente. A differenza delle timeline lineari, questo modello abbraccia la natura ciclica del tempo.

L’obiettivo del componente è fornire una base solida per rappresentare eventi, attività e stati all’interno di un contesto temporale.  
Per chiarire la visione concettuale, vengono utilizzati due schizzi preliminari — semplici ma estremamente efficaci — che illustrano la divisione tra ciclo diurno e ciclo notturno.

---

## Rappresentazione concettuale

| Ciclo diurno (08 → 19) | Ciclo notturno (20 → 07) |
|------------------------|---------------------------|
| <img src="./public/img/timeline-circolare-luna.png" width="220"> | <img src="./public/img/timeline-circolare-luna.png" width="220"> |

---

Questi schizzi non rappresentano lo stile finale del componente, ma svolgono un ruolo fondamentale:  
**stabiliscono il modello mentale** su cui si basa l’intera architettura del Timeline Circolare.

Essi mostrano:

- la divisione naturale tra giorno e notte  
- la continuità del ciclo temporale  
- la disposizione radiale delle ore  
- la possibilità di segmentare il cerchio in archi significativi  
- la direzione di lettura e la logica di orientamento  
- gli archi delle attività verranno rappresentati sulla circonferenza esterna della timeline, seguendo la logica radiale del componente.

# Fondamenti del componente

Il Timeline Circolare si basa su alcuni principi fondamentali che guidano sia la sua struttura interna sia la sua rappresentazione visiva.

### Principi chiave

- **Ciclicità del tempo**  
  Le 24 ore NON sono rappresentate come una linea continua, ma tramite **due circonferenze complete e distinte**, ognuna delle quali copre un intervallo continuo di 12 ore:
  - **Ciclo diurno** → dalle 08:00 alle 19:59  
  - **Ciclo notturno** → dalle 20:00 alle 07:59  
  I due intervalli sono contigui e coprono l’intero ciclo delle 24 ore senza sovrapposizioni né vuoti.  
  I punti di transizione sono:
  - **19:59 → 20:00** (passaggio giorno → notte)  
  - **07:59 → 08:00** (passaggio notte → giorno)

- **Coerenza radiale**  
  Ogni elemento — ore, archi, etichette — segue una logica polare, mantenendo coerenza tra posizione, angolo e significato.

- **Semplicità semantica**  
  Ogni informazione deve essere interpretabile in modo chiaro: gli archi rappresentano intervalli definiti da un’ora di inizio e un’ora di fine, e utilizzano colori semantici per distinguere le categorie delle attività.

- **Gestione degli eventi che attraversano i cicli**  
  Se un evento rimane all’interno dello stesso ciclo (diurno o notturno), viene rappresentato come **un arco unico**.  
  Se invece attraversa uno dei due punti di transizione (19:59 → 20:00 o 07:59 → 08:00), viene rappresentato come **due archi distinti**, uno per ciascuna circonferenza.

- **Separazione delle responsabilità**  
  Il componente non gestisce logiche di scheduling complesse: si limita a rappresentare visivamente ciò che gli viene fornito.

- **Archi esterni**  
  Le attività vengono rappresentate sulla circonferenza esterna, così da mantenere leggibilità e coerenza con il modello mentale.

# Modello dei dati

Il modello dei dati del Timeline Circolare è progettato per rappresentare in modo chiaro e coerente tutte le informazioni necessarie alla costruzione degli archi temporali e degli elementi accessori del calendario.  
La struttura è pensata per essere semplice da interpretare, ma sufficientemente espressiva da coprire un’ampia varietà di attività e contenuti.

## Eventi temporali

Gli eventi temporali rappresentano intervalli di tempo definiti da:

- **start** → data e ora di inizio  
- **end** → data e ora di fine  
- **tipo** → categoria dell’attività (es. Lavoro, Sport, Sonno, Studio, ecc.)  
- **proprietà opzionali** → informazioni aggiuntive specifiche della categoria  

Questi eventi sono gli unici che generano archi sulle circonferenze del Timeline Circolare.

### Regole di appartenenza ai cicli

Ogni evento temporale viene interpretato in base alla sua posizione rispetto ai due cicli temporali:

- **Ciclo diurno** → 08:00 → 19:59  
- **Ciclo notturno** → 20:00 → 07:59  

Questi intervalli sono continui e coprono l’intero arco delle 24 ore.  
I due punti di transizione sono:

- **19:59 → 20:00** (giorno → notte)  
- **07:59 → 08:00** (notte → giorno)

### Regole di rappresentazione degli archi

Un evento temporale può generare **uno o due archi**, a seconda della sua estensione rispetto ai cicli.

#### 1. Eventi interni a un singolo ciclo  
Se l’intervallo `start → end` rimane interamente all’interno del ciclo diurno **oppure** interamente all’interno del ciclo notturno, l’evento viene rappresentato come **un arco unico** sulla circonferenza corrispondente.

Esempi:

- *Lavoro 09:00 → 13:00* → arco unico (diurno)  
- *Sonno 22:00 → 23:30* → arco unico (notturno)

#### 2. Eventi che attraversano un punto di transizione  
Se l’intervallo `start → end` attraversa uno dei due confini (19:59 → 20:00 o 07:59 → 08:00), l’evento viene rappresentato come **due archi distinti**:

- un arco sulla circonferenza in cui l’evento inizia  
- un arco sulla circonferenza in cui l’evento termina  

Esempi:

- *Attività 18:00 → 20:00*  
  - arco 1 → 18:00 → 19:59 (diurno)  
  - arco 2 → 20:00 → 20:00+ (notturno)

- *Attività 06:00 → 09:00*  
  - arco 1 → 06:00 → 07:59 (notturno)  
  - arco 2 → 08:00 → 09:00 (diurno)

Questa logica garantisce continuità visiva e coerenza semantica.

## Eventi non temporali

Gli eventi non temporali rappresentano informazioni aggiuntive che non generano archi sulla timeline.  
Possono includere:

- note  
- spese  
- ricavi  
- attività ricorsive  
- eventi programmati  

Questi elementi non influenzano la rappresentazione radiale, ma possono essere mostrati in pannelli laterali o sezioni dedicate.

## Semantica dei colori

Ogni categoria di evento temporale utilizza un colore semantico coerente, che permette di:

- distinguere rapidamente le attività  
- mantenere leggibilità  
- creare un linguaggio visivo uniforme  

## Integrità dei dati

Il componente assume che:

- gli intervalli temporali siano validi (`start < end`)  
- eventuali sovrapposizioni siano intenzionali  
- le categorie siano coerenti con la semantica dei colori  
- gli eventi siano già normalizzati rispetto al fuso orario e al formato data/ora  

# Flusso di elaborazione

Il Timeline Circolare segue un flusso di elaborazione chiaro e deterministico, che trasforma gli eventi temporali in archi posizionati correttamente sulle due circonferenze (diurna e notturna).  
Ogni fase del processo ha una responsabilità precisa e contribuisce alla costruzione della rappresentazione finale.

## 1. Ricezione degli eventi

Il componente riceve una lista di eventi temporali già validi e coerenti.  
Ogni evento contiene almeno:

- un orario di inizio (`start`)
- un orario di fine (`end`)
- una categoria (`tipo`)

Gli eventi non temporali vengono ignorati in questa fase, poiché non generano archi.

## 2. Normalizzazione temporale

Per ogni evento temporale vengono estratti:

- l’ora di inizio (HH:mm)
- l’ora di fine (HH:mm)
- la durata effettiva
- il giorno di appartenenza (se rilevante)

In questa fase vengono applicate le regole dei due cicli:

- **Ciclo diurno** → 08:00 → 19:59  
- **Ciclo notturno** → 20:00 → 07:59  

## 3. Determinazione della circonferenza di appartenenza

Per ogni evento viene determinato se:

- rimane interamente all’interno del ciclo diurno  
- rimane interamente all’interno del ciclo notturno  
- attraversa uno dei due punti di transizione:
  - 19:59 → 20:00  
  - 07:59 → 08:00  

Questa analisi stabilisce se l’evento genererà **uno o due archi**.

## 4. Suddivisione degli eventi (solo se necessario)

Se un evento attraversa un punto di transizione, viene suddiviso in due porzioni:

- **porzione 1** → dal `start` fino al limite del ciclo corrente  
- **porzione 2** → dal limite del ciclo successivo fino all’`end`

Esempi:

- *18:00 → 20:00*  
  - porzione 1 → 18:00 → 19:59 (diurna)  
  - porzione 2 → 20:00 → 20:00+ (notturna)

- *06:00 → 09:00*  
  - porzione 1 → 06:00 → 07:59 (notturna)  
  - porzione 2 → 08:00 → 09:00 (diurna)

Gli eventi che non attraversano transizioni non vengono modificati.

## 5. Conversione ora → angolo

Ogni porzione di evento viene convertita in un arco tramite una trasformazione polare:

- ogni circonferenza rappresenta **12 ore = 360°**
- ogni ora corrisponde a **30°**
- ogni minuto corrisponde a **0.5°**

Formula generale → angolo = (ore * 30°) + (minuti * 0.5°)


L’angolo viene calcolato rispetto all’orientamento della circonferenza di riferimento.

## 6. Costruzione degli archi

Per ogni porzione di evento vengono calcolati:

- angolo di inizio  
- angolo di fine  
- raggio della circonferenza (diurna o notturna)  
- colore semantico  
- spessore e stile dell’arco  

Il risultato è un set di archi pronti per il rendering.

## 7. Rendering SVG

Gli archi vengono trasformati in elementi SVG:

- `<path>` per gli archi  
- `<circle>` per le circonferenze  
- `<text>` per le etichette delle ore  

Ogni arco viene posizionato sulla circonferenza corretta, rispettando:

- ordine di layering  
- colori semantici  
- continuità visiva  

## 8. Output finale

Il componente restituisce una rappresentazione radiale completa della giornata, composta da:

- due circonferenze (diurna e notturna)  
- archi delle attività  
- etichette delle ore  
- eventuali elementi decorativi o informativi  

Il risultato è una visualizzazione coerente, leggibile e semanticamente ricca.

# Matematica degli angoli

Il Timeline Circolare utilizza una trasformazione polare semplice e deterministica per convertire gli orari in posizioni angolari sulle due circonferenze (diurna e notturna).  
Questa conversione è necessaria per costruire gli archi delle attività in modo proporzionale e coerente.

## 1. Proporzione angolare

Ogni circonferenza rappresenta **12 ore**, distribuite uniformemente lungo **360°**:

- 1 ora = 30°  
- 1 minuto = 0.5°  

Questa proporzione è identica per entrambi i cicli.

## 2. Ore relative

L’angolo non viene calcolato sull’orario assoluto, ma sull’orario relativo all’inizio del ciclo:

- ciclo diurno → ore relative calcolate a partire dalle **08:00**  
- ciclo notturno → ore relative calcolate a partire dalle **20:00**

## 3. Conversione ora → angolo

Per ogni orario (start o end) si applica → angolo = (oreRelative × 30°) + (minuti × 0.5°)


Il risultato è un angolo compreso tra **0° e 360°**, dove:

- 0° corrisponde alla parte superiore della circonferenza  
- gli angoli aumentano in senso orario  

## 4. Continuità tra i cicli

Gli angoli vengono sempre calcolati all’interno della circonferenza di appartenenza.  
Gli eventi che attraversano i punti di transizione (19:59 → 20:00 o 07:59 → 08:00) vengono suddivisi in due porzioni, ognuna con la propria conversione angolare.

## 5. Risultato

La trasformazione angolare garantisce che:

- la durata dell’evento sia proporzionale all’ampiezza dell’arco  
- gli archi siano coerenti tra i due cicli  
- la rappresentazione sia continua e leggibile  

# Rendering SVG

Il rendering del Timeline Circolare si basa su una struttura SVG composta da elementi semplici ma altamente espressivi.  
L’obiettivo non è creare un disegno complesso, ma rappresentare in modo chiaro e leggibile la distribuzione temporale degli eventi sui due cicli (diurno e notturno).

Il componente utilizza tre elementi fondamentali:

- **circonferenze** → definiscono i due cicli  
- **archi** → rappresentano gli eventi temporali  
- **etichette** → indicano le ore di riferimento  

## 1. Struttura generale dello SVG

La struttura dello SVG è organizzata in livelli (layer) logici:

1. **Livello base**  
   Contiene le due circonferenze principali:
   - circonferenza diurna  
   - circonferenza notturna  

2. **Livello degli archi**  
   Ogni evento temporale genera uno o due `<path>` che rappresentano le sue porzioni temporali.

3. **Livello delle etichette**  
   Le ore vengono posizionate lungo le circonferenze tramite elementi `<text>` orientati radialmente.

Questa stratificazione garantisce ordine visivo e facilita eventuali estensioni future.

## 2. Circonferenze dei cicli

Le due circonferenze rappresentano i due intervalli temporali:

- **Ciclo diurno** → 08:00 → 19:59  
- **Ciclo notturno** → 20:00 → 07:59  

Ogni circonferenza ha:

- un raggio dedicato  
- un colore o stile distintivo  
- un orientamento coerente (0° in alto, angoli in senso orario)

Le circonferenze non rappresentano eventi: fungono da guida visiva e da riferimento per il posizionamento degli archi.

## 3. Archi delle attività

Gli archi sono il cuore della visualizzazione.  
Ogni arco è un elemento `<path>` generato a partire da:

- angolo di inizio  
- angolo di fine  
- raggio della circonferenza  
- colore semantico dell’attività  
- spessore e stile  

Gli archi vengono costruiti utilizzando comandi SVG di tipo **arc**, che permettono di disegnare segmenti curvi proporzionali alla durata dell’evento.

### Eventi che attraversano i cicli

Se un evento attraversa un punto di transizione (19:59 → 20:00 o 07:59 → 08:00), vengono generati **due archi distinti**, uno per ciascun ciclo.  
Ogni arco mantiene:

- continuità visiva  
- proporzionalità temporale  
- coerenza cromatica  

## 4. Etichette delle ore

Le etichette delle ore sono elementi `<text>` posizionati lungo le due circonferenze.  
Ogni etichetta:

- è orientata radialmente  
- mantiene leggibilità indipendentemente dalla rotazione  
- segue la stessa logica angolare degli archi  

Le ore fungono da riferimento visivo per interpretare la timeline.

## 5. Layering e ordine di rendering

Per garantire una visualizzazione chiara:

- le circonferenze vengono disegnate per prime  
- gli archi vengono disegnati sopra le circonferenze  
- le etichette vengono disegnate per ultime  

Questo ordine assicura che:

- gli archi non vengano coperti  
- le etichette rimangano sempre leggibili  
- la struttura complessiva sia pulita e gerarchica  

## 6. Risultato visivo

Il risultato del rendering SVG è una rappresentazione radiale composta da:

- due cerchi distinti ma contigui  
- archi proporzionali alla durata degli eventi  
- etichette delle ore posizionate con precisione  
- una chiara distinzione tra ciclo diurno e ciclo notturno  

La visualizzazione finale è leggibile, coerente e immediatamente interpretabile.

# Architettura del componente Angular

L’architettura del Timeline Circolare è progettata per essere modulare, leggibile e facilmente estendibile.  
Ogni parte del componente ha una responsabilità chiara e contribuisce a trasformare i dati in una rappresentazione radiale coerente.

Il componente è organizzato in quattro livelli principali:

1. **Input e configurazione**
2. **Parsing e normalizzazione**
3. **Calcolo e costruzione degli archi**
4. **Rendering SVG**

Questa suddivisione garantisce separazione delle responsabilità e facilita la manutenzione.

---

## 1. Input del componente

Il componente riceve dall’esterno:

- una lista di **eventi temporali**  
- una lista di **eventi non temporali** (opzionale)  
- eventuali **configurazioni visive** (colori, spessori, dimensioni)  
- eventuali **parametri di layout** (raggio, margini, scala)

Gli input sono considerati **immutabili**: il componente non li modifica, ma li interpreta.

---

## 2. Parsing e normalizzazione

Questa fase ha il compito di:

- estrarre gli orari di inizio e fine  
- determinare il ciclo di appartenenza (diurno o notturno)  
- identificare eventuali attraversamenti dei punti di transizione  
- suddividere gli eventi quando necessario  
- preparare una struttura dati uniforme per la fase successiva

Il risultato è una lista di **porzioni di evento**, ognuna già assegnata alla circonferenza corretta.

Questa fase è completamente indipendente dal rendering.

---

## 3. Calcolo e costruzione degli archi

In questa fase vengono applicate:

- la **matematica degli angoli**  
- la conversione ora → angolo  
- la determinazione del raggio corretto (diurno o notturno)  
- l’assegnazione del colore semantico  
- la costruzione dei parametri geometrici necessari allo SVG

Il risultato è una lista di **archi pronti per il rendering**, ognuno con:

- angolo di inizio  
- angolo di fine  
- raggio  
- colore  
- spessore  
- categoria  

Questa fase è puramente geometrica e non dipende dal template.

---

## 4. Rendering SVG

Il template del componente contiene:

- le due circonferenze principali  
- gli archi generati nella fase precedente  
- le etichette delle ore  
- eventuali elementi decorativi o informativi

Il rendering è completamente **dichiarativo**:  
il template si limita a iterare sugli archi e a disegnarli tramite elementi SVG (`<path>`, `<circle>`, `<text>`).

Il componente non contiene logiche di layout complesse:  
tutto ciò che riguarda la geometria è già stato calcolato nella fase precedente.

---

## 5. Stato interno e Signals

Il componente utilizza uno stato interno minimale, composto da:

- la lista normalizzata degli eventi  
- la lista degli archi calcolati  
- eventuali configurazioni derivate dagli input

Questi valori possono essere gestiti tramite **Signals**, garantendo:

- reattività immediata  
- aggiornamenti efficienti  
- assenza di side‑effects indesiderati

Il componente non mantiene stato persistente:  
ogni aggiornamento degli input rigenera l’intera pipeline in modo deterministico.

---

## 6. Separazione delle responsabilità

L’architettura del componente segue alcuni principi chiave:

- **il parsing interpreta i dati**  
- **il calcolo costruisce la geometria**  
- **il template disegna**  
- **nessuna fase conosce i dettagli delle altre**  
- **nessuna logica di scheduling o business viene gestita internamente**

Questa separazione rende il componente:

- prevedibile  
- facile da testare  
- facile da estendere  
- robusto nel tempo  

---

## 7. Integrazione nel resto dell’applicazione

Il Timeline Circolare è progettato per essere un componente **autonomo**:

- non richiede servizi esterni  
- non dipende da stato globale  
- non modifica dati esterni  
- può essere inserito in qualsiasi pagina o layout

L’unico requisito è fornire eventi validi e coerenti con il modello dati.

---

## 8. Estendibilità

L’architettura modulare permette di aggiungere facilmente:

- nuovi tipi di eventi  
- nuovi stili grafici  
- nuove circonferenze (es. cicli personalizzati)  
- interazioni (hover, click, tooltip)  
- animazioni  
- livelli informativi aggiuntivi

Senza modificare la struttura principale del componente.

# Considerazioni finali e limiti

Il Timeline Circolare è un componente progettato per rappresentare in modo chiaro e intuitivo la distribuzione temporale degli eventi nell’arco delle 24 ore.  
La sua architettura modulare, la separazione delle responsabilità e l’uso di una rappresentazione radiale lo rendono uno strumento flessibile e facilmente estendibile.

Tuttavia, il componente presenta alcuni limiti intenzionali:

- **Non gestisce logiche di scheduling complesse**  
  Il componente si limita a rappresentare visivamente gli eventi forniti.  
  La validazione, la risoluzione dei conflitti e la gestione delle ricorrenze sono responsabilità esterne.

- **Non interpreta la semantica degli eventi**  
  Le categorie e i colori sono forniti dall’esterno.  
  Il componente non assegna significati né applica regole di business.

- **Non gestisce interazioni avanzate**  
  Funzionalità come hover, click, tooltip o animazioni non sono incluse nella versione base, ma possono essere aggiunte senza modificare la struttura principale.

- **Non supporta cicli temporali personalizzati**  
  La rappresentazione è basata su due cicli fissi (08:00–19:59 e 20:00–07:59).  
  Estensioni future possono introdurre cicli configurabili.

Questi limiti non rappresentano mancanze, ma scelte progettuali che mantengono il componente semplice, prevedibile e focalizzato sulla sua responsabilità principale:  
**visualizzare il tempo in forma radiale in modo chiaro, coerente e leggibile.**

Il documento fornisce una base solida per l’implementazione e l’evoluzione del componente, lasciando spazio a estensioni future senza compromettere la struttura attuale.