export interface CalendarDay {
  anno: number;
  mese: number;
  numero_del_giorno_del_calendario: number;
  meseCorrente?: boolean;
  mesePrecedente?: boolean;
  meseSuccessivo?: boolean;
  giornoAttuale: boolean;
 // id?: string;
}
