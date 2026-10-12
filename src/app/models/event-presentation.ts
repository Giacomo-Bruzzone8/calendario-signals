import { TimelineEvent } from './calendar-event.model';

export const EVENT_COLORS: Record<TimelineEvent['type'], string> = {
  Sleep: 'var(--event-sleep)',
  Work: 'var(--event-work)',
  Study: 'var(--event-study)',
  Reading: 'var(--event-reading)',
  Sport: 'var(--event-sport)',
  FreeTime: 'var(--event-free-time)',
  CustomActivity: 'var(--event-custom-activity)',
};

export function eventTitle(event: TimelineEvent): string {
  switch (event.type) {
    case 'Study': return event.subject;
    case 'Reading': return event.book;
    case 'Sport': return event.sport;
    case 'FreeTime': return event.hobby ?? '';
    case 'CustomActivity': return event.activity;
    default: return '';
  }
}
