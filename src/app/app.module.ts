import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AiportCarParksService } from './core/services/aiport-car-parks.service';

import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { CarparkComponent } from './carpark/carpark.component';
import { ParkslotComponent } from './parkslot/parkslot.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    CarparkComponent,
    ParkslotComponent,
    DashboardComponent,
    TopNavbarComponent
  ],
  imports: [
    BrowserModule,
    CoreModule
  ],
  providers: [AiportCarParksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
