import { Injectable, signal } from '@angular/core';
import dayjs from 'dayjs';
import { DayDetail } from '../models/calendar-event.model';
import { parseDate } from '../functions/date-utils';

// Dati dimostrativi centralizzati: le date seguono il giorno corrente,
// così gli esempi sono visibili nel calendario al primo accesso.
function createDemoDays(): Record<string, DayDetail> {
  const today = dayjs().startOf('day');
  const yesterday = today.subtract(1, 'day').format('YYYY-MM-DD');
  const current = today.format('YYYY-MM-DD');
  const tomorrow = today.add(1, 'day').format('YYYY-MM-DD');

  const days: DayDetail[] = [
    {
      id: `demo-${yesterday}`,
      date: yesterday,
      timeline: [
        { type: 'Work', start: `${yesterday}T09:00`, end: `${yesterday}T13:00`, note: 'Organizzazione del progetto' },
        { type: 'Reading', start: `${yesterday}T17:00`, end: `${yesterday}T18:00`, book: 'Il nome della rosa', author: 'Umberto Eco' },
      ],
      extra: [
        { type: 'Memo', note: 'Una giornata dedicata al lavoro e alla lettura.' },
        { type: 'Expense', amountSpent: 12.5, category: 'Pranzo' },
      ],
    },
    {
      id: `demo-${current}`,
      date: current,
      timeline: [
        { type: 'Sleep', start: `${current}T00:00`, end: `${current}T07:30` },
        { type: 'Work', start: `${current}T09:00`, end: `${current}T12:30`, note: 'Sviluppo del calendario' },
        { type: 'Study', start: `${current}T14:00`, end: `${current}T16:00`, subject: 'Angular Signals', goal: 'Gestire lo stato condiviso' },
        { type: 'Sport', start: `${current}T19:00`, end: `${current}T20:30`, sport: 'Corsa', workout: 'Allenamento al parco' },
        { type: 'FreeTime', start: `${current}T21:00`, end: `${current}T22:00`, hobby: 'Musica' },
      ],
      extra: [
        { type: 'Memo', note: 'Ricordarsi di fare una pausa tra lavoro e studio.' },
        { type: 'Reminder', date: current, time: '18:00', message: 'Preparare le scarpe da corsa' },
        { type: 'Expense', amountSpent: 4.5, category: 'Colazione' },
      ],
    },
    {
      id: `demo-${tomorrow}`,
      date: tomorrow,
      timeline: [
        { type: 'Study', start: `${tomorrow}T10:00`, end: `${tomorrow}T11:30`, subject: 'TypeScript' },
        { type: 'CustomActivity', start: `${tomorrow}T17:00`, end: `${tomorrow}T18:00`, activity: 'Chitarra', category: 'Musica', note: 'Esercizi di arpeggio' },
      ],
      extra: [
        { type: 'Reminder', date: tomorrow, time: '09:00', message: 'Organizzare la giornata' },
        { type: 'Income', amountReceived: 50, category: 'Rimborso' },
      ],
    },
  ];

  return Object.fromEntries(days.map(day => [day.date, day]));
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  // Stato in memoria condiviso per tutta l'applicazione.
  private readonly daysState = signal<Record<string, DayDetail>>(createDemoDays());
  readonly days = this.daysState.asReadonly();

  getDay(date: string): DayDetail | null {
    return this.daysState()[date] ?? null;
  }

  saveDay(day: DayDetail): void {
    if (!parseDate(day.date)) throw new Error('La data della giornata deve essere YYYY-MM-DD.');
    const savedDay = structuredClone(day);
    this.daysState.update(days => ({ ...days, [savedDay.date]: savedDay }));
  }

  removeDay(date: string): void {
    this.daysState.update(days => {
      const updatedDays = { ...days };
      delete updatedDays[date];
      return updatedDays;
    });
  }
}
