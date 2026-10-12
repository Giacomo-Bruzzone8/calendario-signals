import { Component, computed, input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TimelineEvent } from '../../models/calendar-event.model';
import { CYCLES, CycleType } from '../../models/cycle.model';
import { EVENT_COLORS } from '../../models/event-presentation';
import { dayEventPortions, EventPortion } from '../../functions/timeline-portions';

@Component({
  selector: 'app-circular-timeline',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './circular-timeline.html',
  styleUrls: ['./circular-timeline.scss'],
})
export class CircularTimeline {
  // DATI DELLA GIORNATA
  events = input<readonly TimelineEvent[]>([]);
  date = input<Date>(new Date());

  // SIGNAL
  visibleCycle = signal<CycleType>('day');

  // COMPUTED SIGNAL
  activityArcs = computed(() => dayEventPortions(this.events(), this.date())
    .filter(portion => portion.cycle === this.visibleCycle()));
  ticks = computed(() => {
    const config = CYCLES[this.visibleCycle()];
    const duration = this.cycleHours(this.visibleCycle());
    return Array.from({ length: duration }, (_, index) => ({
      angle: index * 360 / duration,
      hour: (config.startHour + index) % 24,
    }));
  });

  setCycle(cycle: CycleType): void {
    this.visibleCycle.set(cycle);
  }

  getColorForEvent(event: TimelineEvent): string {
    return EVENT_COLORS[event.type];
  }

  polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  }

  buildTickPath(angle: number): string {
    const start = this.polarToCartesian(100, 100, 85, angle);
    const end = this.polarToCartesian(100, 100, 90, angle);
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  drawPortionArc(portion: EventPortion): string {
    const config = CYCLES[portion.cycle];
    const cycleMinutes = this.cycleHours(portion.cycle) * 60;
    const clockMinutes = portion.start.hour() * 60 + portion.start.minute();
    const offset = (clockMinutes - config.startHour * 60 + 1440) % 1440;
    const startAngle = offset * 360 / cycleMinutes;
    const sweep = portion.end.diff(portion.start, 'minute') * 360 / cycleMinutes;
    const start = this.polarToCartesian(100, 100, 98, startAngle);
    const end = this.polarToCartesian(100, 100, 98, startAngle + sweep);

    // Un ciclo intero richiede due archi SVG, perché inizio e fine coincidono.
    if (sweep >= 360) {
      const middle = this.polarToCartesian(100, 100, 98, startAngle + 180);
      return `M ${start.x} ${start.y} A 98 98 0 0 1 ${middle.x} ${middle.y} A 98 98 0 0 1 ${end.x} ${end.y}`;
    }
    return `M ${start.x} ${start.y} A 98 98 0 ${sweep > 180 ? 1 : 0} 1 ${end.x} ${end.y}`;
  }

  private cycleHours(cycle: CycleType): number {
    const config = CYCLES[cycle];
    return (config.endHour - config.startHour + 24) % 24;
  }
}
