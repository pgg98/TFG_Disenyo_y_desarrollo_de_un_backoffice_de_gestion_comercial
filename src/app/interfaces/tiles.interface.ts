export interface Tile {
  id: number;
  date_start: string;
  date_end: string;
  historic: boolean;
  processed_pctg: number;
  processed: boolean;
  generate_curves: boolean;
  generate_points: boolean;
  priority: number;
  area_nombre: string;
}
