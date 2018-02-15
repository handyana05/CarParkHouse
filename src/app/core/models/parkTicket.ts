import {ParkSlot} from './parkSlot';

export class ParkingTicket {
  Id: string;
  AutoLicense: string;
  EnterDate: Date;
  ParkSlot: ParkSlot;
  Paid: boolean;

  constructor(autoLicense: string, parkSlot: ParkSlot) {
    this.Id = this.generateId();
    this.AutoLicense = autoLicense;
    this.ParkSlot = parkSlot;
    this.EnterDate = new Date();
    this.Paid = false;
  }

  GetStringEnterDate(): string {
    const strEnterDate = this.EnterDate.getHours() + ':' + this.EnterDate.getMinutes()
                    + ' ' + this.EnterDate.getDate() + ' ' + this.EnterDate.getMonth() + ' ' + this.EnterDate.getFullYear();
    return strEnterDate;
  }

  private generateId(): string {
    return this.generateRandomChars() + this.generateRandomChars() + '-' + this.generateRandomChars() + this.generateRandomChars();
  }

  private generateRandomChars(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
