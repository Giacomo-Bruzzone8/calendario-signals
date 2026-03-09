// BASE TEMPORALE
export interface Tempo {
  start: string; // ISO: "2026-03-06T14:00"
  end: string;   // ISO: "2026-03-06T16:00"
  note?: string;
}

// ===============================
//  EVENTI TEMPORALI (TIMELINE)
// ===============================

export type TimelineEvent =
  | Sonno
  | Lavoro
  | Studio
  | Lettura
  | Sport
  | TempoLibero
  | AttivitaCustom;

// SONNO
export interface Sonno extends Tempo {
  tipo: 'Sonno';
  sogni?: string;
}

// LAVORO
export interface Lavoro extends Tempo {
  tipo: 'Lavoro';
}

// STUDIO
export interface Studio extends Tempo {
  tipo: 'Studio';
  materia: string;
  scopo?: string;
}

// LETTURA
export interface Lettura extends Tempo {
  tipo: 'Lettura';
  libro: string;
  autore: string;
}

// SPORT
export interface Sport extends Tempo {
  tipo: 'Sport';
  sport: string;
  Allenamento?: string;
}

// TEMPO LIBERO
export interface TempoLibero extends Tempo {
  tipo: 'TempoLibero';
  hobby?: string;
}

// ATTIVITÀ CUSTOM
export interface AttivitaCustom extends Tempo {
  tipo: 'AttivitaCustom';
  attivita: string;
  categoria?: string;
}

// ===============================
//  EVENTI NON TEMPORALI
// ===============================

export type NonTimelineEvent =
  | BloccoNote
  | Spese
  | Ricavi
  | SpeseRicorsive
  | EventoProgrammato;

// BLOCCO NOTE
export interface BloccoNote {
  tipo: 'Note';
  note: string;
}

// SPESE
export interface Spese {
  tipo: 'Spese';
  importoSpeso: number;
  categoria: string;
}

export interface Ricavi {
  tipo: 'Ricavi';
  importoRicavato: number;
  categoria: string;
}

// SPESE RICORSIVE
export interface SpeseRicorsive {
  tipo: 'SpeseRicorsive';
  importoSpeso: number;
  categoria?: string;
}

// EVENTO PROGRAMMATO (non temporale)
export interface EventoProgrammato {
  tipo: 'EventoProgrammato';
  data: string; // "2026-03-06"
  evento: string;
  ora?: string;
  note?: string;
}

// ===============================
//  EVENTO GENERALE DEL CALENDARIO
// ===============================

export interface CalendarEvent {
  id: string;
  date: string; // "2026-03-06"
  timeline: TimelineEvent[];       // SOLO eventi temporali
  extra: NonTimelineEvent[];       // TUTTO il resto
}
