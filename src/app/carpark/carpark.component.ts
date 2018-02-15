import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {CarPark} from '../core/models/carPark';
import {ParkSlot} from '../core/models/parkSlot';

@Component({
  selector: 'app-carpark',
  templateUrl: './carpark.component.html',
  styleUrls: ['./carpark.component.scss']
})
export class CarparkComponent implements OnInit {
  @Input() carPark: CarPark;
  @Output() onSelected = new EventEmitter<ParkSlot>();

  constructor() { }

  ngOnInit() {
  }

  onSelect(parkSlot: ParkSlot) {
    if (parkSlot.IsOccupy) {
      this.onSelected.emit(parkSlot);
      console.log('Parking Slot ID: ' + parkSlot.Id + ', occupy by: ' + parkSlot.OccupyBy + ' is selected.');
    }
  }
}
