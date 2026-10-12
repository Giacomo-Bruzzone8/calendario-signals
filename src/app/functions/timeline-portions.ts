import dayjs, { Dayjs } from 'dayjs';
import { TimelineEvent } from '../models/calendar-event.model';
import { CYCLES, CycleType } from '../models/cycle.model';

export interface EventPortion {
  event: TimelineEvent;
  cycle: CycleType;
  start: Dayjs;
  end: Dayjs;
}

// Il giorno del calendario va da mezzanotte a mezzanotte: le ore
// notturne prima delle 08:00 appartengono alla data selezionata.
export function dayEventPortions(events: readonly TimelineEvent[], date: Date): EventPortion[] {
  const dayStart = dayjs(date).startOf('day');
  const dayEnd = dayStart.add(1, 'day');
  const dayCycleStart = dayStart.hour(CYCLES.day.startHour);
  const nightCycleStart = dayStart.hour(CYCLES.night.startHour);
  const windows: { cycle: CycleType; start: Dayjs; end: Dayjs }[] = [
    { cycle: 'night', start: dayStart, end: dayCycleStart },
    { cycle: 'day', start: dayCycleStart, end: nightCycleStart },
    { cycle: 'night', start: nightCycleStart, end: dayEnd },
  ];

  return events.flatMap(event => {
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return [];

    return windows.flatMap(window => {
      const portionStart = start.isAfter(window.start) ? start : window.start;
      const portionEnd = end.isBefore(window.end) ? end : window.end;
      return portionEnd.isAfter(portionStart)
        ? [{ event, cycle: window.cycle, start: portionStart, end: portionEnd }]
        : [];
    });
  }).sort((a, b) => a.start.valueOf() - b.start.valueOf());
}
