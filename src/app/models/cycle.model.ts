export type CycleType = 'day' | 'night';

export interface CycleConfig
{
  startHour: number;
  endHour: number;
}

export const CYCLES: Record<CycleType, CycleConfig> = {
  day:   { startHour: 8,  endHour: 20 }, // 08:00 → 19:59
  night: { startHour: 20, endHour: 8 }   // 20:00 → 07:59
};
