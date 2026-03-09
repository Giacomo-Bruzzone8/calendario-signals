import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tempo, TimelineEvent } from '../models/calendar-event.model';


@Component({
  selector: 'app-timeline-circolare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-circolare.html',
  styleUrl: './timeline-circolare.css',
})
export class TimelineCircolare {

//! PROPRIETA'
modalita: 'giorno' | 'notte' = 'giorno';

taccheGiorno = this.generaTacche(7, 12, 'giorno');
taccheNotte  = this.generaTacche(19, 12, 'notte');
rangeGiorno = { start: 7 * 60, end: 19 * 60 };
rangeNotte  = { start: 19 * 60, end: 7 * 60 };


private colori: Record<TimelineEvent['tipo'], string> = {
  Sonno: '#673AB7',
  Lavoro: '#FF9800',
  Studio: '#2196F3',
  Lettura: '#3F51B5',
  Sport: '#4CAF50',
  TempoLibero: '#009688',
  AttivitaCustom: '#795548'
};

eventi: TimelineEvent[] = [
  {
    tipo: 'Lavoro',
    start: '2026-03-06T09:00',
    end: '2026-03-06T13:00',
  },
  {
    tipo: 'Sport',
    start: '2026-03-06T18:00',
    end: '2026-03-06T19:00',
    sport: 'Corsa'
  },
  {
    tipo: 'Sonno',
    start: '2026-03-06T23:30',
    end: '2026-03-07T07:00',
    sogni: 'Sogno lucido'
  }
];



//! METODI

private angoliDaTempo(t: Tempo) {
  const startMin = this.minutiDelGiorno(t.start);
  const endMin   = this.minutiDelGiorno(t.end);

  let startAngle = this.angoloAssoluto(startMin);
  let endAngle   = this.angoloAssoluto(endMin);

  return this.normalizzaArco(startAngle, endAngle);
}

private generaTacche(startHour: number, count: number, ciclo: 'giorno' | 'notte') {
  
  // Colori locali (non globali)
  const coloriGiorno = ['#FFC107', '#FF9800']; // caldo chiaro / caldo scuro
  const coloriNotte  = ['#3F51B5', '#2196F3']; // freddo scuro / freddo chiaro

  const colori = ciclo === 'giorno' ? coloriGiorno : coloriNotte;

  const tacche = [];

  for (let i = 0; i < count; i++) {

    // Calcolo dell’ora, con gestione della mezzanotte
    const ora = (startHour + i) % 24;

    // Alternanza colori
    const colore = colori[i % 2];

    // Conversione in angolo
    const minuti = ora * 60;
    const angolo = this.angoloAssoluto(minuti);

    tacche.push({
      angolo,
      ora,
      colore
    });
  }

  return tacche;
}


private minutiDelGiorno(dateString: string): number 
{
  const g = new Date(dateString);
  const ore = g.getHours();
  const minuti = g.getMinutes();

  return ore * 60 + minuti;// minuti totali dall'inizio del giorno
}

private angoloAssoluto(minutes: number): number 
{
  return (minutes / 1440) * 360; // non dipende dalla modalità (giorno/notte).
}

private normalizzaArco(startAngle: number, endAngle: number) 
{
  // Se l'angolo di fine è minore di quello di inizio,
  // significa che l'attività attraversa la mezzanotte.
  if (endAngle < startAngle) {
    endAngle += 360;
  }
  return { startAngle, endAngle };
}

private ottieniRangeModalita() {
  const r = this.modalita === 'giorno' ? this.rangeGiorno : this.rangeNotte;
  let start = this.angoloAssoluto(r.start);
  let end   = this.angoloAssoluto(r.end);

  if (end < start) end += 360;

  return { start, end };
}

private calcolaIntersezione(start: number, end: number, rangeStart: number, rangeEnd: number) 
{
  // Calcoliamo la parte dell'attività che cade dentro il range
  const interStart = Math.max(start, rangeStart);
  const interEnd   = Math.min(end, rangeEnd);

  // Se non c'è sovrapposizione, non disegniamo nulla
  if (interStart >= interEnd) {
    return null;
  }
  // Restituiamo l'arco tagliato
  return { start: interStart, end: interEnd };
}


getColore(a: TimelineEvent) {
  return this.colori[a.tipo] ?? '#888';
}


generaTacca(angolo: number): string 
{
  const rInterno = 85;
  const rEsterno = 90;

  const rad = (angolo - 90) * Math.PI / 180;

  const x1 = 100 + rInterno * Math.cos(rad);
  const y1 = 100 + rInterno * Math.sin(rad);

  const x2 = 100 + rEsterno * Math.cos(rad);
  const y2 = 100 + rEsterno * Math.sin(rad);

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}



 //? Funzione finale che produce l’arco da disegnare
calcolaArcoAttivita(a: TimelineEvent) {
  const { startAngle, endAngle } = this.angoliDaTempo(a);
  const { start: rStart, end: rEnd } = this.ottieniRangeModalita();

  const inter = this.calcolaIntersezione(startAngle, endAngle, rStart, rEnd);
  if (!inter) return '';

  return this.disegnaArco(100, 100, 90, inter.start, inter.end);
}



// Converte un angolo in coordinate cartesiane sul cerchio
private polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180; // -90° per far partire il cerchio dall'alto
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

// Disegna un arco SVG tra due angoli
private disegnaArco(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {

  const start = this.polarToCartesian(cx, cy, r, endAngle);
  const end   = this.polarToCartesian(cx, cy, r, startAngle);

  // Determina se l'arco è maggiore di 180°
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}
}

