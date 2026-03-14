export type Cycle = 'luce' | 'buio';

export interface CycleConfig {
  startHour: number;
  endHour: number;
}

export const CYCLES: Record<Cycle, CycleConfig> = {
  luce:   { startHour: 8,  endHour: 20 }, // 08:00 → 19:59
  buio: { startHour: 20, endHour: 8 }   // 20:00 → 07:59
};
