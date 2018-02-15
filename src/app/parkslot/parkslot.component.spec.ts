import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkslotComponent } from './parkslot.component';

describe('ParkslotComponent', () => {
  let component: ParkslotComponent;
  let fixture: ComponentFixture<ParkslotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkslotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
