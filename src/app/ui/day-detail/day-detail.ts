import { Component, computed, inject, input, signal, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import 'dayjs/locale/en';
import { Subject, takeUntil } from 'rxjs';
import { TimelineEvent, NonTimelineEvent } from '../../models/calendar-event.model';
import { EVENT_COLORS, eventTitle } from '../../models/event-presentation';
import { dayEventPortions } from '../../functions/timeline-portions';
import { formatDate, parseDate } from '../../functions/date-utils';
import { StorageService } from '../../services/storage.service';
import { CircularTimeline } from '../circular-timeline/circular-timeline';

@Component({
  selector: 'app-day-detail',
  standalone: true,
  imports: [RouterLink, TranslateModule, CircularTimeline],
  templateUrl: './day-detail.html',
  styleUrl: './day-detail.scss',
})
export class DayDetailComponent implements OnDestroy {
  // DATI DELLA GIORNATA
  private readonly route = inject(ActivatedRoute);
  private readonly storage = inject(StorageService);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  date = computed(() => parseDate(this.params().get('date') ?? '') ?? new Date());
  detail = computed(() => this.storage.getDay(formatDate(this.date())));
  backLink = input<string>('/calendar');

  // SIGNAL
  currentLang = signal<string>('en');
  private destroy = new Subject<void>();

  // COMPUTED SIGNAL
  currentDate = computed(() => dayjs(this.date()).locale(this.currentLang()));
  weekday = computed(() => this.currentDate().format('dddd'));
  fullDate = computed(() => this.currentDate().format('D MMMM YYYY'));
  isToday = computed(() => this.currentDate().isSame(dayjs(), 'day'));

  // Evita di mostrare un record di un'altra data durante la navigazione.
  dayDetail = computed(() => {
    const detail = this.detail();
    return detail?.date === formatDate(this.date()) ? detail : null;
  });
  timeline = computed(() => this.dayDetail()?.timeline ?? []);
  extra = computed(() => this.dayDetail()?.extra ?? []);
  activityPortions = computed(() => dayEventPortions(this.timeline(), this.date()));
  activities = computed(() => [...new Set(this.activityPortions().map(portion => portion.event))]);
  totalMinutes = computed(() => this.activityPortions()
    .reduce((total, portion) => total + portion.end.diff(portion.start, 'minute'), 0));

  eventColors = EVENT_COLORS;
  activityTitle = eventTitle;

  // LINGUA, COME NEL CALENDARIO
  constructor(private translate: TranslateService) {
    this.currentLang.set(translate.getCurrentLang() || 'en');
    translate.onLangChange.pipe(takeUntil(this.destroy))
      .subscribe(event => this.currentLang.set(event.lang));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  activityTime(event: TimelineEvent): string {
    const dayStart = this.currentDate().startOf('day');
    const dayEnd = dayStart.add(1, 'day');
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    const visibleStart = start.isAfter(dayStart) ? start : dayStart;
    const visibleEnd = end.isBefore(dayEnd) ? end : dayEnd;
    const endLabel = visibleEnd.isSame(dayEnd) ? '24:00' : visibleEnd.format('HH:mm');
    return `${visibleStart.format('HH:mm')} – ${endLabel}`;
  }

  activityMinutes(event: TimelineEvent): number {
    return this.activityPortions().filter(portion => portion.event === event)
      .reduce((total, portion) => total + portion.end.diff(portion.start, 'minute'), 0);
  }

  activityDescription(event: TimelineEvent): string {
    const details: string[] = [];
    if (event.type === 'Sleep' && event.dream) details.push(event.dream);
    if (event.type === 'Study' && event.goal) details.push(event.goal);
    if (event.type === 'Reading') details.push(event.author);
    if (event.type === 'Sport' && event.workout) details.push(event.workout);
    if (event.type === 'CustomActivity' && event.category) details.push(event.category);
    if (event.note) details.push(event.note);
    return details.filter(Boolean).join(' · ');
  }

  extraDescription(event: NonTimelineEvent): string {
    switch (event.type) {
      case 'Memo': return event.note;
      case 'Reminder': return [event.time, event.message, event.note].filter(Boolean).join(' · ');
      case 'Expense':
      case 'RecurringExpense':
        return `${event.category} · ${this.formatAmount(event.amountSpent)}`;
      case 'Income': return `${event.category} · ${this.formatAmount(event.amountReceived)}`;
    }
  }

  private formatAmount(amount: number): string {
    return new Intl.NumberFormat(this.currentLang(), { maximumFractionDigits: 2 }).format(amount);
  }
}
