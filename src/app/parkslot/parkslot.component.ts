import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {ParkSlot} from '../core/models/parkSlot';

@Component({
  selector: 'app-parkslot',
  templateUrl: './parkslot.component.html',
  styleUrls: ['./parkslot.component.scss']
})
export class ParkslotComponent implements OnInit {
  @Input() parkSlot: ParkSlot;

  constructor() { }

  ngOnInit() {
  }
}
