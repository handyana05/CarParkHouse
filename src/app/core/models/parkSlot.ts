import { CarPark } from './carPark';

export class ParkSlot {
  Id: number;
  IsOccupy: boolean;
  OccupyBy: string;
  BelongTo: CarPark;

  constructor(id: number, carPark: CarPark) {
    this.Id = id;
    this.BelongTo = carPark;
    this.IsOccupy = false;
    this.OccupyBy = '';
  }
}
