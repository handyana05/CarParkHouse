import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiportCarParksService } from './services/aiport-car-parks.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ ],
  exports: [ ],
  providers: [AiportCarParksService]
})
export class CoreModule { }
