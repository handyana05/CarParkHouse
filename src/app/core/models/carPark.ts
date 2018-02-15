import { ParkSlot } from './parkSlot';

export class CarPark {
  Floor: number;
  ParkSlots: ParkSlot[];

  constructor(floor: number, private parkSlotsLength: number = 36) {
    this.Floor = floor;
    this.ParkSlots = [];
  }

  InitParkSlots(startNumber: number) {
    for (let i = 0; i < this.parkSlotsLength; i++) {
      const parkSlotNr = startNumber + i;
      this.ParkSlots.push(new ParkSlot(parkSlotNr, this));
    }
  }

  CountFreeParkSlots(): number {
    return this.ParkSlots.filter(parkSlot => parkSlot.IsOccupy === false).length;
  }

  GetFreeParkSlots(): ParkSlot[] {
    return this.ParkSlots.filter(parkSlot => parkSlot.IsOccupy === false);
  }
}
