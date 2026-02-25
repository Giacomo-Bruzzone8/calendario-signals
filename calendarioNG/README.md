# OGGETTO DATE IN TYPESCRIPT / JAVASCRIPT
1. QUALI SONO I PARAMETRI DI INGRESSO?
Le forme principali sono:


A- Senza Argomenti ->
 esempio => const d = new Date();

B- Con Timestamp (millisecondi dal 1/1/1970 UTC)
 esempio => const d = new Date(1700000000000);

C- Con Stringa ->
 esempio => const d = new Date('2024-02-25T10:30:00'); !PRESTARE ATTENZIONE AL FORMATO!

D- Con parametri numerici separati
 esempio => const d = new Date(year, monthIndex, day?, hours?, minutes?, seconds?, ms?);

SPIEGAZIONE DEI PARAMETRI =>
year → anno (es. 2024)
monthIndex → 0–11 (0 = gennaio, 11 = dicembre)
day → 1–31 (default: 1)
hours → 0–23 (default: 0)
minutes, seconds, ms → opzionali, default 0

caso specifico -> new Date(year, month, 1);
year = anno
month = indice del mese (0 - 11)
1 = primo giorno del mese

2. Come si fa ad “ereditarlo”?
Date è una classe nativa di JavaScript, disponibile globalmente. NON SI EREDITA.
Quindi quando si scrive => private today = new Date();
stiamo istanziando un oggetto della classe nativa Date.

3. Metodi nativi di Date
Getters:

- getFullYear() → anno (es. 2024)
- getMonth() → mese 0–11
- getDate() → giorno del mese 1–31
- getDay() → giorno della settimana 0–6 (0 = domenica)
- getHours(), getMinutes(), getSeconds()

Setters:

- setFullYear(anno)
- setMonth(meseIndex)
- setDate(giorno)
- setHours(), setMinutes(), ecc.

Altri metodi utili:

- getTime() → timestamp in millisecondi
- toISOString() → stringa ISO
- toLocaleString(locale, options) → formattazione localizzata (come nel tuo monthName)

# COME SI RECUPERANO I NOMI DEI MESI

monthName = computed(() =>
  new Date(this.year(), this.month(), 1).toLocaleString('it-IT', { month: 'long' })
);

Ecco quello che accade => new Date(this.year(), this.month(), 1) 
- this.year() → legge il valore del signal year.
- this.month() → legge il valore del signal month.
- 1 → primo giorno del mese

Mentre quello che accade => .toLocaleString('it-IT', { month: 'long' }):
- it-IT → locale italiana
- { month: 'long' } → nome completo del mese (es. "febbraio")

Perché si aggiorna da solo?
Perché è un computed:
- Dipende da this.year() e this.month().

Quando uno dei due signal cambia (year.set(...) o month.set(...)), Angular ricalcola automaticamente il valore del computed.

Il template che lo usa (es. {{ monthName() }}) si aggiorna di conseguenza.

# GENERICS E INTERFACCIA

days = signal<CalendarDay[]>([]);

Perché si usano < > e cosa significano:
- si tratta delle generics di typescript
- questo signal conterrà un valore di TIPO → CalendarDay[] (array di CalendarDay).
- il valore iniziale è [] (array vuoto).

! Questo ci permette di definire la struttura dei giorni !

Quindi quando si dichiara =>
const d = this.days();
- d sarà di tipo CalendarDay[].
- signal<CalendarDay[]>(...) dice a TypeScript → Questo signal conterrà sempre un array di CalendarDay.

Vantaggi:
- Autocompletamento: this.days().map(day => day.isToday) è tipizzato.
- Sicurezza: non puoi fare this.days.set([ { foo: 123 } ]) perché non rispetta CalendarDay.

# COME SI USA THIS

Esempio di codice →
prevMonth() {
  const m = this.month();
  const y = this.year();
  if (m === 0) {
    this.month.set(11);
    this.year.set(y - 1);
  } else {
    this.month.set(m - 1);
  }
  this.generateDays();
}


A cosa si riferisce this??
- In una classe TypeScript/JavaScript, this si riferisce all’istanza della classe

export class CalendarComponent {
  year = signal(this.today.getFullYear());
  month = signal(this.today.getMonth());

  prevMonth() {
    const m = this.month();
    ...
  }
}

- this è l’istanza di CalendarComponent.
- this.year → campo della classe che contiene il signal dell’anno.
- this.month → campo della classe che contiene il signal del mese.
- this.generateDays() chiama il metodo generateDays della stessa istanza.

! QUINDI this È IL COMPONENTE ANGULAR CalendarComponent !
