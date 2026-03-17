import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from '../../models/calendar-event.model';
import { CycleType } from '../../models/cycle.model';
import { TranslateModule } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';

interface EventPortion {
  cycle: CycleType; // cycle type (day/night)
  start: Dayjs; // start time of this portion
  end: Dayjs; // end time of this portion
  type: TimelineEvent['type']; // event type (Work, Sport, Sleep...)
  originalEvent: TimelineEvent; // full original event
}

@Component({
  selector: 'app-circular-timeline',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './circular-timeline.html',
  styleUrls: ['./circular-timeline.scss'],
})
export class CircularTimeline {
  //! DECLARATIONS

  visibleCycle: CycleType = 'day';
  activityArcs: ReturnType<typeof this.portionToAngles>[] = [];

  private colorsByType: Record<TimelineEvent['type'], string> = {
    Sleep: 'magenta',
    Work: 'red',
    Study: '#2196F3',
    Reading: '#3F51B5',
    Sport: 'cyan',
    FreeTime: '#009688',
    CustomActivity: '#795548',
  };

  events: TimelineEvent[] = [
    {
      type: 'Work',
      start: '2026-03-13T09:00',
      end: '2026-03-13T13:00'
    },
    {
      type: 'Sport',
      start: '2026-03-13T18:00',
      end: '2026-03-13T21:00',
      sport: 'Corsa'
    },
    {
      type: 'Sleep',
      start: '2026-03-13T23:30',
      end: '2026-03-14T07:00',
      dream: 'Sogno lucido'
    }
  ];

  
  // ! LIFECYCLE HOOK
  ngOnInit()
  {
    this.activityArcs = this.portions.map((p) => this.portionToAngles(p));
  }

  // ! SVG GEOMETRY LOGIC
  // Converts an angle into cartesian coordinates on the circle
  polarToCartesian(cx: number, cy: number, r: number, angle: number) 
  {
    const rad = ((angle - 90) * Math.PI) / 180; // -90° to start from top
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Generates an SVG arc path between two angles
  private drawArcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string 
  {
    const start = this.polarToCartesian(cx, cy, r, startAngle);
    const end = this.polarToCartesian(cx, cy, r, endAngle);

    const delta = (endAngle - startAngle + 360) % 360;
    const largeArcFlag = delta > 180 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  }

  private normalizeAngle(angle: number): number
  {
    return ((angle % 360) + 360) % 360;
  }

  //! TICKS AND COLORS

  // Returns the color associated with an event type
  getColorForEvent(event: TimelineEvent)
  {
    return this.colorsByType[event.type] ?? '#888';
  }

  // Generates the SVG path for a single tick mark
  buildTickPath(angle: number): string
  {
    const innerRadius = 85;
    const outerRadius = 90;
    const rad = ((angle - 90) * Math.PI) / 180;

    const x1 = 100 + innerRadius * Math.cos(rad);
    const y1 = 100 + innerRadius * Math.sin(rad);
    const x2 = 100 + outerRadius * Math.cos(rad);
    const y2 = 100 + outerRadius * Math.sin(rad);

    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  // Generates the tick marks for the day cycle
  getTicks()
  {
    const ticks = [];
    const startHour = this.cycleStartHour();
    const count = 12;
    const step = 360 / count;

    for (let i = 0; i < count; i++) {
      const angle = this.normalizeAngle(i * step);
      const hour = startHour + i;

      ticks.push({
        angle,
        hour: hour % 24
      });
    }

    return ticks;
  }

  //! METODI PIPELINE

  private cycleStartHour(): number
  {
    return this.visibleCycle === 'day' ? 8 : 20;
  }

  private toAbsoluteMinutes(date: Dayjs): number
  {
    return date.hour() * 60 + date.minute();
  }

  private getMinutesRelativeToCycle(date: Dayjs): number
  {
    const abs = this.toAbsoluteMinutes(date); // absolute minutes from 00:00 (0–1439)
    const start = this.cycleStartHour() * 60; // 480 for day, 1200 for night

    let rel = abs - start;

    // If we're in the night cycle and the time is after midnight (e.g. 02:00)
    // we need to add 1440 minutes
    if (rel < 0) { rel += 1440; }

    return rel; // always 0–720
  }

  private timeToAngle(date: Dayjs): number
  {
    const rel = this.getMinutesRelativeToCycle(date); // 0–720
    return rel * 0.5; // 1 minute = 0.5°
  }

  private portionToAngles(p: EventPortion)
  {
    const startAngle = this.timeToAngle(p.start);
    const endAngle = this.timeToAngle(p.end);

    return {
      ...p,
      startAngle,
      endAngle,
    };
  }


  drawPortionArc(p: ReturnType<typeof this.portionToAngles>): string
  {
    return this.drawArcPath(100, 100, 98, p.startAngle, p.endAngle);
  }

  private getCycleForTime(date: Dayjs): CycleType 
  {
    const hour = date.hour();
    const minute = date.minute();

    // Convert time to "absolute minutes"
    const total = hour * 60 + minute;

    // day cycle: 08:00 → 19:59
    const startLuce = 8 * 60;
    const endLuce = 20 * 60; // 20:00 escluded

    // If total is between 08:00 and 19:59 → day
    if (total >= startLuce && total < endLuce) {
      return 'day';
    }

    // Otherwise → night
    return 'night';
  }

  // Recognize if it's night or day cycle
  private splitEventIntoPortions(event: TimelineEvent): EventPortion[]
  {
    const start = dayjs(event.start);
    const end = dayjs(event.end);

    // Convert to absolute minutes
    let startMin = start.hour() * 60 + start.minute();
    let endMin = end.hour() * 60 + end.minute();

    // If the event goes to the next day
    if (endMin < startMin) { endMin += 1440; }

    const LUCE_START = 8 * 60; // 08:00
    const BUIO_START = 20 * 60; // 20:00

    const portions: EventPortion[] = [];

    // Helper to create a portion with correct date objects
    const makePortion = (cycle: CycleType, sMin: number, eMin: number) => {
      const s = dayjs(start).hour(Math.floor(sMin / 60) % 24).minute(sMin % 60);
      let e = dayjs(start).hour(Math.floor(eMin / 60) % 24).minute(eMin % 60);

      // If eMin exceeds 1440, we add a day
      if (eMin >= 1440) { e = e.add(1, 'day'); }

      portions.push({
        cycle,
        start: s,
        end: e,
        type: event.type,
        originalEvent: event,
      });
    };

    // First case — all in day
    if (startMin >= LUCE_START && endMin <= BUIO_START) {
      makePortion('day', startMin, endMin);
      return portions;
    }

    // Second case — all in night
    if (startMin >= BUIO_START || endMin <= LUCE_START) {
      makePortion('night', startMin, endMin);
      return portions;
    }

    // Third case — crosses day → night
    if (startMin < BUIO_START && endMin > BUIO_START) {
      makePortion('day', startMin, BUIO_START);
      makePortion('night', BUIO_START, endMin);
      return portions;
    }

    // forth case — crosses night → day
    if (startMin < LUCE_START && endMin > LUCE_START) {
      makePortion('night', startMin, LUCE_START);
      makePortion('day', LUCE_START, endMin);
      return portions;
    }

    // Fallback
    makePortion(this.getCycleForTime(start), startMin, endMin);
    return portions;
  }
  
  get portions(): EventPortion[]
  {
    return this.events.flatMap((e) => this.splitEventIntoPortions(e));
  }
}