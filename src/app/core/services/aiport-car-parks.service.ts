import { Injectable } from '@angular/core';

import {ParkSlot} from '../models/parkSlot';
import {CarPark} from '../models/carPark';
import {ParkingTicket} from '../models/parkTicket';

@Injectable()
export class AiportCarParksService {
  /*** Private Variables ***/
  private isSystemStarted = false;
  private floorTotalCount = 3;
  private parkSlotsFloorTotalCount = 36;
  private backupData = './carparks.json';
  private lastUsedFloor = -1;
  private openHours = new Date();
  private closedHours = new Date();

  private startSystemIntervalId: any;
  private stopSystemIntervalId: any;

  /*** Public Variables **/
  CarParks: CarPark[];
  ParkingTickets: ParkingTicket[];

  constructor() {
    this.openHours.setUTCHours(8, 0, 0, 0);
    this.closedHours.setUTCHours(20, 0, 0, 0);
  }

  /*********************************************************
   * Start the system by checking if it is in opening hours
   * or if the admin force to start it
   ********************************************************/
  StartAirportCarParksSystem(forceStart: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((forceStart || this.InOpenHours()) && !this.isSystemStarted) {
        this.initAirportSystem();
        this.isSystemStarted = true;
      }

      if (!this.isSystemStarted) {
        this.startSystemIntervalId = setInterval(this.StartAirportCarParksSystem, 1000 * 60);
      } else {
        clearInterval(this.startSystemIntervalId);
        this.stopSystemIntervalId = setInterval(this.ShutdownAirportCarParkSystem, 1000 * 60 * 60);
        resolve();
      }
    });
  }

  /*********************************************************************
   * Shutdown the airport car park system if it is out of opening hours
   * or if the admin force to start it
   ********************************************************************/
  ShutdownAirportCarParkSystem(forceShutdown: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((forceShutdown || this.OutOfOpenHours()) && this.isSystemStarted) {
        this.isSystemStarted = false;

        // If there are still cars inside the car parks,
        // then save it into JSON
        if (this.CountFreeParkSlots() > 0) {
          this.saveToBackup();
          return;
        }

        // Otherwise remove backup file
        this.removeBackupFile();

        if (this.stopSystemIntervalId) {
          clearInterval(this.stopSystemIntervalId);
        }

        resolve();
      }
    });
  }

  /***********************************************
   * Retrieve the count of free park slots
   * @returns (number): count of free park slots
   **********************************************/
  CountFreeParkSlots(): number {
    let count = 0;
    if (this.isSystemStarted) {
      for (let i = 0; i < this.CarParks.length; i++) {
        count += this.CarParks[i].CountFreeParkSlots();
      }
    }
    return count;
  }

  /*************************************************
   * Retrieve random free park slot
   * @returns {ParkSlot}: free park slot
   ************************************************/
  GetFreeParkSlot(): ParkSlot {
    const carParkFloor = this.getRandomFloor();
    const carPark = this.CarParks.find(x => x.Floor === carParkFloor);
    const freeParkSlots = carPark.GetFreeParkSlots();
    const freeParkSlotsNumbers = freeParkSlots.map(x => x.Id);
    const randomFreeParkSlotNumber = Math.floor(Math.random() * freeParkSlotsNumbers.length);
    return freeParkSlots[randomFreeParkSlotNumber];
  }

  /**************************************************
   * Generate a parking ticket for certain car
   * @param {string} autoLicense
   * @returns {ParkingTicket}
   ************************************************/
  PrintTicket(autoLicense: string): ParkingTicket {
    const freeParkSlot = this.GetFreeParkSlot();

    if (!this.ParkingTickets) {
      this.ParkingTickets = [];
    }

    const parkingTicket = new ParkingTicket(autoLicense, freeParkSlot);
    this.ParkingTickets.push(parkingTicket);
    return parkingTicket;
  }

  /**********************************************************
   * Set the pay flag on parking ticket, to be able to exit
   * car park the parking should be paid first.
   * @param {string} parkingTicketId
   *********************************************************/
  PayParkingTicket(parkingTicketId: string): void {
    const parkingTicket = this.ParkingTickets.find(ticket => ticket.Id === parkingTicketId);
    if (parkingTicket) {
      parkingTicket.Paid = true;
    }
  }

  /****************************************************************
   * Set the IsOccupy flag on parking slot. If it returns true,
   * then the gate can be opened. Otherwise the gate can be opened
   * @param {string} parkingTicketId
   *********************************************************/
  EnterCarPark(parkingTicketId: string): boolean {
    const parkingTicket = this.ParkingTickets.find(ticket => ticket.Id === parkingTicketId);
    if (!parkingTicket) {
      console.error('Parking Ticket with ID: ' + parkingTicketId + ' cannot be found on the system!');
      return false;
    }

    const carPark = this.CarParks.find(park => park.Floor === parkingTicket.ParkSlot.BelongTo.Floor);
    if (!carPark) {
      console.error('Car Park with Floor: ' + parkingTicketId + ' cannot be found on the system!');
      return false;
    }

    const parkSlot = carPark.ParkSlots.find(slot => slot.Id === parkingTicket.ParkSlot.Id);
    if (!parkSlot) {
      console.error('Parking Slot with ID: ' + parkSlot + ' cannot be found on the system!');
      return false;
    }

    parkSlot.IsOccupy = true;
    parkSlot.OccupyBy = parkingTicket.AutoLicense;
    return true;
  }

  /****************************************************************
   * Check if the parking ticket is paid or not and set
   * the IsOccupy flag on parking slot. If it returns true,
   * then the gate can be opened. Otherwise the gate can be opened
   * @param {string} parkingTicketId
   *********************************************************/
  ExitCarPark(parkingTicketId: string): boolean {
    const parkingTicket = this.ParkingTickets.find(ticket => ticket.Id === parkingTicketId);
    if (!parkingTicket) {
      console.error('Parking Ticket with ID: ' + parkingTicketId + ' cannot be found on the system!');
      return false;
    }

    if (parkingTicket.Paid) {
      const carPark = this.CarParks.find(park => park.Floor === parkingTicket.ParkSlot.BelongTo.Floor);
      if (!carPark) {
        console.error('Car Park with Floor: ' + parkingTicketId + ' cannot be found on the system!');
        return false;
      }

      const parkSlot = carPark.ParkSlots.find(slot => slot.Id === parkingTicket.ParkSlot.Id);
      if (!parkSlot) {
        console.error('Parking Slot with ID: ' + parkSlot + ' cannot be found on the system!');
        return false;
      }

      parkSlot.IsOccupy = false;
      parkSlot.OccupyBy = '';
      this.ParkingTickets = this.ParkingTickets.filter(ticket => ticket.Id !== parkingTicketId);
      return true;
    }

    console.error('Parking Ticket with ID: ' + parkingTicketId + ' has not been paid!');
    return false;
  }

  /*****************************************************
   * Checks if the current time in opening hours
   * of airport car parks
   * @returns {boolean}:
   *  + true: if the current time is in opening hours
   *  + false: otherwise
   ****************************************************/
  InOpenHours(): boolean {
    const currentTime = new Date();

    if (currentTime.getTime() >= this.openHours.getTime() && currentTime.getTime() <= this.closedHours.getTime()) {
      return true;
    }
    return false;
  }

  /*****************************************************
   * Checks if the current time out of opening hours
   * of airport car parks
   * @returns {boolean}:
   *  + true: if the current time is in opening hours
   *  + false: otherwise
   ****************************************************/
  OutOfOpenHours(): boolean {
    const currentTime = new Date();

    if (currentTime.getTime() < this.openHours.getTime() && currentTime.getTime() > this.closedHours.getTime()) {
      return true;
    }
    return false;
  }

  /*** Private Methods ***/

  /*****************************************
   * Initialize car park and its park slots
   *****************************************/
  private initAirportSystem(): void {
    // this.readBackup();
    this.initCarParksManually();
  }

  /*********************************************
   * Initialize Car Parks manually.
   * This is done when there is no backup data
   ********************************************/
  private initCarParksManually(): void {
    if (!this.CarParks) {
      this.CarParks = [];
    }

    // There is no backup data on JSON file, then
    for (let i = 0; i < this.floorTotalCount; i++) {
      const carPark = new CarPark(i, this.parkSlotsFloorTotalCount);
      carPark.InitParkSlots((i * this.parkSlotsFloorTotalCount) + 1);
      this.CarParks.push(carPark);
    }
  }

  /********************************
   * Save data to local JSON file
   ********************************/
  private saveToBackup(): void {
    const obj = {
      CarParks: this.CarParks,
      ParkingTickets: this.ParkingTickets
    };

    const objJson = JSON.stringify(obj);
    /*
    fs.open(this.backupData, 'wx', (openErr, fd) => {
      if (openErr) {
        if (openErr.code === 'EEXIST') {
          console.error('Backup file already exists');
          return;
        }

        throw openErr;
      }

      fs.writeFile(this.backupData, objJson, 'utf8', (err) => {
        if (err) {
          console.error('Error on save backup data!');
          return;
        }

        console.log('Backup data has been saved.');
      });
    });
    */
  }

  /******************************************************
   * Read the backup file and init the CarParks from it
   *****************************************************/
  private readBackup(): void {
    /*
    fs.open(this.backupData, 'r', (openErr, fd) => {
      if (openErr) {
        if (openErr.code === 'ENOENT') {
          this.initCarParksManually();
          return;
        }
        throw openErr;
      }

      let obj;
      fs.readFile(this.backupData, 'utf8', function (err, data) {
        if (err) {
          console.error('Error on read backup data');
        }
        obj = JSON.parse(data);

        if (obj) {
          this.CarParks = obj.CarParks;
          this.ParkingTickets = obj.ParkingTickets;
        }
      });
    });
    */
  }

  /************************************
   * Remove backup file if it exists
   ***********************************/
  private removeBackupFile(): void {
    // If there is a backup data
    /*
    fs.stat(this.backupData, (err, stats) => {
      console.log('Backup file info:');
      console.log(stats);

      if (err) {
        return console.error(err);
      }

      fs.unlink(this.backupData, (unlinkErr) => {
        if (unlinkErr) {
          return console.log(err);
        }
        console.log('file deleted successfully');
      });
    });
    */
  }

  /******************************************************
   * Retrieve random floor value and prevent
   * congestion by make an exception of last used floor
   * @returns {number} - the floor number
   *****************************************************/
  private getRandomFloor(): number {
    const randomFloor = Math.floor(Math.random() * this.floorTotalCount);
    return (randomFloor === this.lastUsedFloor) ? this.getRandomFloor() : randomFloor;
  }
}
