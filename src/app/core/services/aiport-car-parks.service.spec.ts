import { TestBed, inject } from '@angular/core/testing';

import { AiportCarParksService } from './aiport-car-parks.service';

describe('AiportCarParksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiportCarParksService]
    });
  });

  it('should be created', inject([AiportCarParksService], (service: AiportCarParksService) => {
    expect(service).toBeTruthy();
  }));
});
