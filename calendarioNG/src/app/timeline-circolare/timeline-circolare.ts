import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tempo, TimelineEvent } from '../models/calendar-event.model';
import { Cycle, CycleConfig } from '../models/cycle.model';

type CycleType = 'day' | 'night';

interface EventPortion {
  cycle: CycleType;                // 'day' | 'night'
  start: Date;                     // start time of this portion
  end: Date;                       // end time of this portion
  type: TimelineEvent['tipo'];     // event type (Lavoro, Sport, Sonno...)
  originalEvent: TimelineEvent;    // full original event
}



@Component({
  selector: 'app-timeline-circolare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-circolare.html',
  styleUrls: ['./timeline-circolare.css'],

})
export class TimelineCircolare {

//! DECLARATIONS

  visibleCycle: CycleType = 'day';

  private colorsByType: Record<TimelineEvent['tipo'], string> = {
    Sonno: 'magenta',
    Lavoro: 'red',
    Studio: '#2196F3',
    Lettura: '#3F51B5',
    Sport: 'cyan',
    TempoLibero: '#009688',
    AttivitaCustom: '#795548'
  };

  events: TimelineEvent[] = [
    {
      tipo: 'Lavoro',
      start: '2026-03-13T09:00',
      end: '2026-03-13T13:00',
    },
    {
      tipo: 'Sport',
      start: '2026-03-13T18:00',
      end: '2026-03-13T21:00',
      sport: 'Corsa'
    },
    {
      tipo: 'Sonno',
      start: '2026-03-13T23:30',
      end: '2026-03-14T07:00',
      sogni: 'Sogno lucido'
    }
  ];

// ! SVG GEOMETRY LOGIC

  // Converts an angle into cartesian coordinates on the circle
  polarToCartesian(cx: number, cy: number, r: number, angle: number) 
  {
    const rad = (angle - 90) * Math.PI / 180; // -90° to start from top
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
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
    return (angle % 360 + 360) % 360;
  }

//! TICKS AND COLORS

  // Returns the color associated with an event type
  getColorForEvent(event: TimelineEvent) 
  {
    return this.colorsByType[event.tipo] ?? '#888';
  }

  // Generates the SVG path for a single tick mark
  buildTickPath(angle: number): string 
  {
    const innerRadius = 85;
    const outerRadius = 90;
    const rad = (angle - 90) * Math.PI / 180;

    const x1 = 100 + innerRadius * Math.cos(rad);
    const y1 = 100 + innerRadius * Math.sin(rad);
    const x2 = 100 + outerRadius * Math.cos(rad);
    const y2 = 100 + outerRadius * Math.sin(rad);

    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  // Generates the tick marks for the day cycle
  getDayTicks() 
  {
    const ticks = [];
    const count = 12;
    const step = 360 / count;

    for (let i = 0; i < count; i++) {
      const angle = this.normalizeAngle(i * step);
      const hour = 8 + i;

      ticks.push({
        angle,
        hour: hour % 24,
        color: '#FFC107'
      });
    }
    return ticks;
  }

  // Generates the tick marks for the night cycle
  getNightTicks() 
  {
    const ticks = [];
    const count = 12;
    const step = 360 / count;

    for (let i = 0; i < count; i++) {
      const angle = this.normalizeAngle(i * step);
      const hour = 20 + i;

      ticks.push({
        angle,
        hour: hour % 24,
        color: '#3F51B5'
      });
    }
    return ticks;
  }


//! METODI PIPELINE
  ngOnInit() 
  {
    this.archiLogici = this.porzioni.map(p => this.portionToAngles(p));
  }

  private cycleStartHour(cycle: CycleType): number 
  {
    return cycle === 'day' ? 8 : 20;
  }

  private toAbsoluteMinutes(date: Date): number 
  {
    return date.getHours() * 60 + date.getMinutes();
  }

  private getMinutesRelativeToCycle(date: Date, cycle: CycleType): number 
  {
    const abs = this.toAbsoluteMinutes(date);        // minuti assoluti 0–1439
    const start = this.cycleStartHour(cycle) * 60;   // 480 per luce, 1200 per buio

    let rel = abs - start;

    // Se siamo nel ciclo buio e l'orario è dopo mezzanotte (es. 02:00)
    // dobbiamo aggiungere 1440 minuti
    if (rel < 0) {
      rel += 1440;
    }
    return rel; // sempre 0–720
  }

  private timeToAngle(date: Date, cycle: CycleType): number 
  {
    const rel = this.getMinutesRelativeToCycle(date, cycle); // 0–720
    return rel * 0.5; // 1 minuto = 0.5°
  }

  private portionToAngles(p: EventPortion) 
  {
    const startAngle = this.timeToAngle(p.start, p.cycle);
    const endAngle   = this.timeToAngle(p.end, p.cycle);

    return {
      ...p,
      startAngle,
      endAngle
    };
  }
  private raggioPerCiclo(cycle: CycleType): number 
  {
    return 98;
  }

  disegnaArcoPortion(p: ReturnType<typeof this.portionToAngles>): string 
  {
    const r = this.raggioPerCiclo(p.cycle);
    return this.drawArcPath(100, 100, r, p.startAngle, p.endAngle);
  }


 public archiLogici: ReturnType<typeof this.portionToAngles>[] = [];


  private getCycleForTime(date: Date): CycleType 
  {
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Convertiamo l'orario in "minuti assoluti"
    const total = hour * 60 + minute;

    // Ciclo luce: 08:00 → 19:59
    const startLuce = 8 * 60;
    const endLuce   = 20 * 60; // 20:00 escluso

    // Se total è tra 08:00 e 19:59 → luce
    if (total >= startLuce && total < endLuce) {
      return 'day';
    }

    // Altrimenti → buio
    return 'night';
  }


    // Riconosco se si tratta di ciclo notturno o diurno
  private splitEventIntoPortions(event: TimelineEvent): EventPortion[] 
  {
    const start = new Date(event.start);
    const end   = new Date(event.end);

    // Convertiamo in minuti assoluti
    let startMin = start.getHours() * 60 + start.getMinutes();
    let endMin   = end.getHours() * 60 + end.getMinutes();

    // Se l'evento passa al giorno successivo
    if (endMin < startMin) {
      endMin += 1440;
    }

    const LUCE_START = 8 * 60;   // 08:00
    const BUIO_START = 20 * 60;  // 20:00

    const portions: EventPortion[] = [];

    // Helper per creare una porzione con Date corrette
    const makePortion = (cycle: CycleType, sMin: number, eMin: number) => {
      const s = new Date(start);
      const e = new Date(start);

      s.setHours(Math.floor(sMin / 60) % 24, sMin % 60, 0, 0);
      e.setHours(Math.floor(eMin / 60) % 24, eMin % 60, 0, 0);

      // Se eMin supera 1440, aggiungiamo un giorno
      if (eMin >= 1440) e.setDate(e.getDate() + 1);

      portions.push({
        cycle,
        start: s,
        end: e,
        type: event.tipo,
        originalEvent: event
      });
    };

    // Caso 1 — tutto in luce
    if (startMin >= LUCE_START && endMin <= BUIO_START) {
      makePortion('day', startMin, endMin);
      return portions;
    }

    // Caso 2 — tutto in buio
    if (startMin >= BUIO_START || endMin <= LUCE_START) {
      makePortion('night', startMin, endMin);
      return portions;
    }

    // Caso 3 — attraversa luce → buio
    if (startMin < BUIO_START && endMin > BUIO_START) {
      makePortion('day', startMin, BUIO_START);
      makePortion('night', BUIO_START, endMin);
      return portions;
    }

    // Caso 4 — attraversa buio → luce
    if (startMin < LUCE_START && endMin > LUCE_START) {
      makePortion('night', startMin, LUCE_START);
      makePortion('day', LUCE_START, endMin);
      return portions;
    }

    // Fallback
    makePortion(this.getCycleForTime(start), startMin, endMin);
    return portions;
  }

  get porzioni(): EventPortion[] {
    return this.events.flatMap(e => this.splitEventIntoPortions(e));
  }
    
}

