interface Tempo {
  start: string; // "2026-03-06T14:00"
  end: string;   // "2026-03-06T16:00"
  note?: string;
}


export interface CalendarEvent {
  id: string;
  date: string; // formato ISO: "2026-03-06"
  title: string;
  blocks: EventBlock[];
}
// ELENCO DI EVENTI
export type EventBlock =
  | bloccoNote
  | Spese
  | SpeseRicorsive
  | Lavoro
  | Sonno
  | EventoProgrammato
  | Attivita;

// BLOCCO NOTE
export interface bloccoNote {
  tipo: 'Note';
  note: string;
}

// SPESE
export interface Spese {
  tipo: 'Spese';
  importoSpeso: number;
  categoria?: string;
}

// SPESE RICORSIVE
export interface SpeseRicorsive
 {
  tipo: 'SpeseRicorsive';
  importoSpeso: number;
  categoria?: string;
}

// SONNO
export interface Sonno extends Tempo {
  tipo: 'Sonno';
}

export interface EventoProgrammato {
  tipo: 'EventoProgrammato';
  data: string; // Data evento formato ISO: "2026-03-06"
  evento: string;
  ora?: string; 
  note?: string;
}

// LAVORO
export interface Lavoro extends Tempo {
  tipo: 'Lavoro';
  retribuzioneMensile: number;
}

// ATTIVITA
export interface Attivita {
  tipo: 'Attivita';
  tipoDiAttività: elencoAttivita[];
}
export type elencoAttivita =
  | Studio
  | Lettura
  | Sport
  | TempoLibero    
  | AttivitaCustom;

export interface Studio extends Tempo {
  tipo: 'Studio';
  materia: string;
  scopo?: string;
}
export interface Lettura extends Tempo {
  tipo: 'Lettura';
  libro: string;
  autore: string;
}
export interface Sport extends Tempo {
  tipo: 'Sport';
  sport: string;
  percorsoDiAllenamento?: string;
}
export interface TempoLibero extends Tempo {
  tipo: 'TempoLibero';
  hobby?: string;
}
export interface AttivitaCustom extends Tempo {
  tipo: 'AttivitaCustom';
  attivita: string;
  categoria?: string;
}