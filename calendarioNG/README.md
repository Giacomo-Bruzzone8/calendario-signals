# 📘 OGGETTO **Date** IN TYPESCRIPT / JAVASCRIPT

## 1. **QUALI SONO I PARAMETRI DI INGRESSO?**

Le forme principali sono:

### **A — Senza argomenti**
```ts
const d = new Date();
```

### **B — Con timestamp (millisecondi dal 1/1/1970 UTC)**
```ts
const d = new Date(1700000000000);
```

### **C — Con stringa**
```ts
const d = new Date('2024-02-25T10:30:00');
```
**NOTA BENE!!** Prestare attenzione al formato della stringa.

### **D — Con parametri numerici separati**
```ts
const d = new Date(year, monthIndex, day?, hours?, minutes?, seconds?, ms?);
```

### **SPIEGAZIONE DEI PARAMETRI**
- `year` → anno (es. 2024)
- `monthIndex` → **0–11** (0 = gennaio, 11 = dicembre)
- `day` → 1–31 (default: 1)
- `hours` → 0–23 (default: 0)
- `minutes`, `seconds`, `ms` → opzionali, default 0

### **Caso specifico usato nel calendario**
```ts
new Date(year, month, 1);
```
- `year` = anno  
- `month` = indice del mese (0–11)  
- `1` = primo giorno del mese  

---

## 2. **Come si fa ad “ereditarlo”?**

**NON SI EREDITA.**

`Date` è una **classe nativa** di JavaScript, disponibile globalmente.

Quando scrivi:
```ts
private today = new Date();
```
stai semplicemente **istanziando** un oggetto della classe `Date`.

---

## 3. **Metodi nativi di Date**

### **Getters**
- `getFullYear()` → anno (es. 2024)
- `getMonth()` → mese 0–11
- `getDate()` → giorno del mese 1–31
- `getDay()` → giorno della settimana 0–6 (0 = domenica)
- `getHours()`, `getMinutes()`, `getSeconds()`

### **Setters**
- `setFullYear(anno)`
- `setMonth(meseIndex)`
- `setDate(giorno)`
- `setHours()`, `setMinutes()`, ecc.

### **Altri metodi utili**
- `getTime()` → timestamp in millisecondi
- `toISOString()` → stringa ISO
- `toLocaleString(locale, options)` → formattazione localizzata

---

# 📅 COME SI RECUPERANO I NOMI DEI MESI

```ts
monthName = computed(() =>
  new Date(this.year(), this.month(), 1).toLocaleString('it-IT', { month: 'long' })
);
```

### **Cosa accade qui**

#### Parte 1 — Creazione della data
```ts
new Date(this.year(), this.month(), 1)
```
- `this.year()` → legge il valore del signal `year`
- `this.month()` → legge il valore del signal `month`
- `1` → primo giorno del mese

#### Parte 2 — Formattazione
```ts
.toLocaleString('it-IT', { month: 'long' })
```
- `'it-IT'` → locale italiana  
- `{ month: 'long' }` → nome completo del mese (es. `"febbraio"`)

### **Perché si aggiorna da solo?**

Perché è un **computed**:

- dipende da `this.year()` e `this.month()`
- quando uno dei due cambia → Angular ricalcola automaticamente il valore
- il template che usa `{{ monthName() }}` si aggiorna in automatico

---

# 🧩 GENERICS E INTERFACCIA

```ts
days = signal<CalendarDay[]>([]);
```

### **Perché si usano `< >`?**
Sono **generics TypeScript**.

Significa:

- questo signal conterrà un valore di tipo **`CalendarDay[]`**
- il valore iniziale è `[]` (array vuoto)

**NOTA BENE!!**  
Questo permette di definire la struttura dei giorni del calendario.

### **Quando fai:**
```ts
const d = this.days();
```
- `d` è di tipo **`CalendarDay[]`**

### **Vantaggi**
- Autocompletamento:
  ```ts
  this.days().map(day => day.isToday)
  ```
- Sicurezza:
  ```ts
  this.days.set([{ foo: 123 }]) // ❌ ERRORE
  ```
  perché non rispetta l’interfaccia `CalendarDay`.

---

# 🧠 COME SI USA `this`

### Esempio
```ts
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
```

### **A cosa si riferisce `this`?**

In una classe TypeScript/JavaScript:

👉 **`this` è l’istanza della classe.**

Nel tuo caso:

```ts
export class CalendarComponent {
  year = signal(this.today.getFullYear());
  month = signal(this.today.getMonth());
}
```

- `this` → istanza di `CalendarComponent`
- `this.year` → campo della classe (signal dell’anno)
- `this.month` → campo della classe (signal del mese)
- `this.generateDays()` → metodo della stessa istanza

**NOTA BENE!!**  
👉 `this` **NON** è un oggetto `Date`.  
👉 `this` è il **componente Angular**.

