import { Component, OnInit } from '@angular/core';

import { AiportCarParksService } from '../core/services/aiport-car-parks.service';
import {CarPark} from '../core/models/carPark';
import {ParkSlot} from '../core/models/parkSlot';
import {ParkingTicket} from '../core/models/parkTicket';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  carParks: CarPark[];
  countFreeParkSlots: number;
  selectedParkSlot: ParkSlot;
  selectedParkingTicket: ParkingTicket;
  disabledPayButton = true;
  disabledExitButton = true;

  constructor(public airportCarParksService: AiportCarParksService) { }

  ngOnInit() {
    this.airportCarParksService.StartAirportCarParksSystem().then(() => {
      this.initCarParks(this.airportCarParksService.CarParks, this.airportCarParksService.CountFreeParkSlots());
    });
  }

  onStartSystem() {
    this.airportCarParksService.StartAirportCarParksSystem(true).then(() => {
      this.initCarParks(this.airportCarParksService.CarParks, this.airportCarParksService.CountFreeParkSlots());
    });
  }

  onShutdownSystem() {
    this.airportCarParksService.ShutdownAirportCarParkSystem(true);
  }

  onAddCar() {
    const parkingTicket = this.airportCarParksService.PrintTicket(this.generateMunichAutoLicense());
    this.airportCarParksService.EnterCarPark(parkingTicket.Id);
    this.countFreeParkSlots = this.airportCarParksService.CountFreeParkSlots();
  }

  onRemoveCar() {
    if (this.selectedParkSlot) {
      const carLicense = this.selectedParkSlot.OccupyBy;
      const ticket = this.airportCarParksService.ParkingTickets.find(t => t.AutoLicense === carLicense);
      if (ticket) {
        this.airportCarParksService.ExitCarPark(ticket.Id);
      }
      this.selectedParkSlot = null;
      this.selectedParkingTicket = null;
      this.disabledExitButton = true;
    }
    this.countFreeParkSlots = this.airportCarParksService.CountFreeParkSlots();
  }

  onPayParkingTicket() {
    if (this.selectedParkSlot) {
      const carLicense = this.selectedParkSlot.OccupyBy;
      const ticket = this.airportCarParksService.ParkingTickets.find(t => t.AutoLicense === carLicense);
      if (ticket) {
        this.airportCarParksService.PayParkingTicket(ticket.Id);
      }
      this.selectedParkSlot = null;
      this.selectedParkingTicket = null;
      this.disabledPayButton = true;
    }
  }

  onSelected(parkSlot: ParkSlot) {
    this.selectedParkSlot = parkSlot;
    this.selectedParkingTicket = this.getParkingTicketByParkingSlot(this.selectedParkSlot);
    console.log(this.selectedParkingTicket.Paid);
    this.disabledPayButton = this.selectedParkingTicket.Paid;
    this.disabledExitButton = !this.selectedParkingTicket.Paid;
  }

  private initCarParks(carParks: CarPark[], countFreeParkSlots: number) {
    this.carParks = carParks;
    this.countFreeParkSlots = countFreeParkSlots;
  }

  private generateMunichAutoLicense(): string {
    const randomNumber = Math.floor(Math.random() * 9999);
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÜÖ';
    let randomChars = '';
    for (let i = 0; i < 2; i++) {
      randomChars += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return 'M ' + randomChars + ' ' + randomNumber;
  }

  private getParkingTicketByParkingSlot(parkingSlot: ParkSlot): ParkingTicket {
    const carLicense = this.selectedParkSlot.OccupyBy;
    return this.airportCarParksService.ParkingTickets.find(t => t.AutoLicense === carLicense);
  }
}
