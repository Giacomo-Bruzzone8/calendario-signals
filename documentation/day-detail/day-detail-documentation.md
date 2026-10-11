# Day Detail Component

## Integrazione attuale nel progetto

La rotta `/day/:date` valida la data e apre direttamente `DayDetailComponent`.
Il componente legge la data dall'URL e recupera la giornata da `StorageService`.
Il calendario costruisce l'URL quando l'utente sceglie un giorno; la voce
"Dettaglio del giorno" nella navbar usa `/day`, che reindirizza alla data odierna.
Il componente usa i modelli già presenti in `calendar-event.model.ts`, senza categorie o
intervalli in ore decimali definiti localmente. Un record con una data diversa
da quella selezionata non viene mostrato.

`detail.timeline` alimenta il componente `CircularTimeline` esistente;
`detail.extra` alimenta la sezione delle informazioni non temporali. I dati
dimostrativi sono definiti esclusivamente in `services/storage.service.ts`
per ieri, oggi e domani. Il servizio è un singleton con stato in memoria
basato su Signals: `getDay(date)` legge una giornata, `saveDay(detail)` la
inserisce o aggiorna, `removeDay(date)` la elimina. Le date usano `YYYY-MM-DD`.
Al ricaricamento dell'applicazione i dati vengono reinizializzati: non è
ancora prevista la persistenza su browser o backend.

Il calendario usa lo stesso servizio per indicare le date con contenuti;
la timeline della Home riceve gli eventi di oggi. Gli aggiornamenti del
servizio si propagano alle viste attraverso i computed Signals. Per le
giornate senza un record le sezioni mostrano uno stato vuoto.
L'aggiunta e la modifica dei contenuti descritte più avanti sono
funzionalità previste, senza pulsanti attualmente privi di gestione.

Le date usano Day.js e la lingua di `TranslateService`, come il calendario.
Le porzioni temporali sono condivise tramite `functions/timeline-portions.ts`
e rispettano `CYCLES`: gli eventi vengono divisi ai confini dei cicli e
limitati al giorno selezionato, da mezzanotte a mezzanotte.

La palette, i font e gli stili di pannelli e superfici sono definiti in
`src/styles/_theme.scss`, utilizzati anche dal calendario e dalla navbar.
I colori degli eventi sono associati ai tipi in `models/event-presentation.ts`
e utilizzati sia nella lista sia nella timeline. La geometria SVG rimane
nel componente `CircularTimeline`.

## Scopo

Il **Day Detail Component** è la pagina Angular dedicata alla
visualizzazione e alla gestione delle informazioni associate a una
singola giornata.

La pagina viene raggiunta dopo la selezione di una data dal **Calendar
Component** e rappresenta il punto di accesso ai contenuti registrati
per quel giorno.

Le sue responsabilità principali sono:

-   riconoscere la data richiesta dalla route
-   recuperare i dati associati alla giornata
-   mostrare le attività temporali attraverso il **Timeline Circolare**
-   mostrare separatamente le informazioni non temporali
-   fornire i punti di accesso per aggiungere o modificare i contenuti
    della giornata

Il componente svolge quindi una funzione di **orchestrazione**: coordina
i dati della giornata senza assumersi le responsabilità interne dei
componenti che utilizza.

------------------------------------------------------------------------

## Relazione con il routing

La pagina è associata a una route contenente la data della giornata.

Formato previsto:

`/day/:date`

Esempio:

`/day/2026-09-28`

Il parametro `date` rappresenta il giorno da visualizzare e utilizza il
formato:

`YYYY-MM-DD`

Quando il componente viene inizializzato:

1.  legge la data dalla route
2.  verifica che il valore possa essere interpretato correttamente
3.  utilizza la data come riferimento per recuperare il relativo
    `DayDetail`
4.  aggiorna la vista con i dati disponibili

La pagina non dipende direttamente dal Calendar Component: il calendario
ha il solo compito di determinare la data e avviare la navigazione.

------------------------------------------------------------------------

## Modello dati

Il contenuto della giornata è rappresentato dal modello `DayDetail`.

``` ts
export interface DayDetail {
  id: string;
  date: string;
  timeline: TimelineEvent[];
  extra: NonTimelineEvent[];
}
```

### `date`

Identifica la giornata rappresentata.

Formato:

`YYYY-MM-DD`

### `timeline`

Contiene esclusivamente eventi dotati di un intervallo temporale
definito da `start` ed `end`.

Esempi:

-   Sleep
-   Work
-   Study
-   Reading
-   Sport
-   FreeTime
-   CustomActivity

Questi dati possono essere passati al Timeline Circolare per la
rappresentazione radiale.

### `extra`

Contiene informazioni associate alla giornata che non costituiscono
intervalli temporali.

Esempi:

-   Reminder
-   Memo
-   Expense
-   Income
-   RecurringExpense

Questi elementi non devono generare archi sulla timeline.

------------------------------------------------------------------------

## Flusso di elaborazione

Il comportamento generale della pagina segue questa pipeline:

1.  accesso alla route `/day/:date`
2.  lettura del parametro `date`
3.  recupero del `DayDetail` corrispondente
4.  separazione naturale tra `timeline` ed `extra`
5.  passaggio degli eventi temporali al Timeline Circolare
6.  rendering delle informazioni aggiuntive
7.  esposizione delle azioni disponibili per la giornata

Il flusso deve rimanere deterministico: la data presente nella route
costituisce la fonte principale per stabilire quale giornata mostrare.

------------------------------------------------------------------------

## Struttura della pagina

### Header della giornata

La pagina mostra chiaramente la data attualmente visualizzata.

Può includere:

-   giorno della settimana
-   numero del giorno
-   mese
-   anno
-   comando per tornare al calendario

Esempio:

**Lunedì 28 settembre 2026**

------------------------------------------------------------------------

## Timeline Circolare

Il Timeline Circolare rappresenta graficamente gli eventi contenuti in:

`DayDetail.timeline`

Il Day Detail Component:

-   recupera gli eventi
-   li fornisce alla timeline
-   non calcola direttamente archi o geometria SVG

Il Timeline Circolare mantiene la responsabilità esclusiva di:

-   suddividere gli eventi nei cicli temporali previsti
-   convertire gli intervalli in angoli
-   costruire gli archi
-   renderizzare la rappresentazione radiale

In questo modo la logica geometrica rimane isolata dal resto della
pagina.

------------------------------------------------------------------------

## Elenco delle attività

Oltre alla rappresentazione radiale, la pagina può mostrare una
rappresentazione testuale delle attività della giornata.

Ogni attività può indicare:

-   tipo
-   ora di inizio
-   ora di fine
-   proprietà specifiche della categoria
-   eventuali note

La rappresentazione testuale completa la timeline senza sostituirne la
funzione.

------------------------------------------------------------------------

## Informazioni extra

Gli elementi presenti in:

`DayDetail.extra`

vengono mostrati in una sezione distinta dalle attività temporali.

Possono comprendere:

-   promemoria
-   memo
-   spese
-   entrate
-   spese ricorrenti

La separazione deve essere evidente anche nell'interfaccia, perché
questi elementi appartengono alla giornata ma non rappresentano una
porzione della sua timeline.

------------------------------------------------------------------------

## Stato senza dati

L'esistenza di una data non implica necessariamente l'esistenza di dati
salvati.

Se non esiste ancora un `DayDetail` per la giornata richiesta, la pagina
deve comunque essere raggiungibile.

In questo caso deve mostrare uno stato vuoto coerente, permettendo
successivamente all'utente di creare il primo contenuto della giornata.

Esempio:

**Nessuna attività registrata per questa giornata.**

Lo stato vuoto non deve essere considerato un errore.

------------------------------------------------------------------------

## Aggiunta e modifica dei contenuti

La pagina costituisce il punto naturale da cui avviare operazioni come:

-   aggiungere un'attività temporale
-   aggiungere un Reminder
-   aggiungere un Memo
-   registrare Expense o Income
-   modificare un elemento esistente
-   eliminare un elemento

I relativi form possono essere implementati tramite componenti dedicati.

Il Day Detail Component non dovrebbe contenere direttamente tutta la
logica dei diversi form: deve principalmente coordinare apertura,
chiusura e aggiornamento dei dati.

------------------------------------------------------------------------

## Persistenza

Il componente non dovrebbe conoscere i dettagli tecnici del sistema
utilizzato per conservare i dati.

La lettura e la scrittura dei `DayDetail` dovranno essere delegate a un
livello dedicato, ad esempio un service o repository.

Questo permette di utilizzare inizialmente una persistenza locale e, in
futuro, sostituirla con un backend senza modificare profondamente la
pagina.

Il flusso ideale è:

`Route → DayDetail Component → Service/Repository → dati`

e successivamente:

`dati → DayDetail Component → componenti di presentazione`

------------------------------------------------------------------------

## Separazione delle responsabilità

Il Day Detail Component deve rispettare alcuni confini architetturali.

### Calendar Component

Responsabilità:

-   rappresentare il mese
-   permettere la selezione di una data
-   avviare la navigazione verso il dettaglio

Non deve recuperare o interpretare i contenuti della giornata.

### Day Detail Component

Responsabilità:

-   riconoscere la giornata richiesta
-   recuperare i relativi dati
-   coordinare le sezioni della pagina
-   fornire i dati ai componenti figli
-   gestire le azioni generali della giornata

### Timeline Circolare

Responsabilità:

-   ricevere eventi temporali
-   trasformarli nella rappresentazione radiale
-   renderizzare gli archi

Non deve recuperare autonomamente il `DayDetail` né conoscere il
Calendar Component.

### Service / Repository

Responsabilità:

-   leggere i dati
-   salvare i dati
-   aggiornare i dati
-   eliminare i dati
-   nascondere ai componenti il sistema concreto di persistenza

------------------------------------------------------------------------

## Stato e reattività

Lo stato interno della pagina dovrebbe rimanere ridotto.

Indicativamente può comprendere:

-   data richiesta dalla route
-   `DayDetail` corrente
-   eventuale stato di caricamento
-   eventuale stato di modifica dell'interfaccia

I dati derivati dovrebbero essere calcolati a partire da queste
informazioni senza duplicare inutilmente lo stato.

L'uso di **Signals** è coerente con l'architettura generale
dell'applicazione.

------------------------------------------------------------------------

## Gestione degli errori

La pagina deve distinguere almeno due situazioni:

### Giornata valida senza dati

La data è corretta ma non esistono ancora informazioni salvate.

Risultato:

-   mostrare un empty state
-   permettere l'aggiunta di nuovi contenuti

### Data non valida

Il parametro della route non rappresenta una data accettabile.

Risultato:

-   evitare di elaborare dati incoerenti
-   gestire la situazione tramite redirect o stato di errore appropriato

La strategia concreta potrà essere definita durante l'implementazione
del routing.

------------------------------------------------------------------------

## Limiti del componente

Il Day Detail Component non deve:

-   costruire direttamente la geometria della timeline
-   generare la griglia mensile del calendario
-   contenere la logica completa di persistenza
-   implementare internamente tutti i form delle diverse categorie
-   duplicare parsing e trasformazioni temporali già affidate a utility
    o componenti dedicati
-   creare dipendenze dirette tra Calendar Component e Timeline
    Circolare

------------------------------------------------------------------------

## Estensioni future

L'architettura permette di aggiungere successivamente:

-   form dinamici per tipo di attività
-   modifica ed eliminazione degli eventi
-   statistiche giornaliere
-   riepilogo del tempo per categoria
-   obiettivi della giornata
-   indicatori di completamento
-   navigazione al giorno precedente e successivo
-   sincronizzazione con un backend
-   gestione offline
-   esportazione dei dati

Queste funzionalità devono essere introdotte senza alterare la
responsabilità fondamentale della pagina.

------------------------------------------------------------------------

## Sintesi finale

Il **Day Detail Component** rappresenta il punto centrale per
l'esplorazione di una singola giornata.

La sua logica può essere sintetizzata come:

`data dalla route → recupero DayDetail → distribuzione dei dati → rendering`

La pagina coordina i contenuti, ma delega le responsabilità
specialistiche:

-   il **Calendar Component** sceglie la giornata
-   il **Day Detail Component** la orchestra
-   il **Timeline Circolare** rappresenta il tempo
-   i componenti dedicati rappresentano o modificano gli elementi extra
-   il **Service/Repository** gestisce la persistenza

Questa separazione mantiene l'applicazione modulare, leggibile,
testabile ed estendibile.
