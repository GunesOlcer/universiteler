import { TestBed } from '@angular/core/testing';

import { CityMenuService } from './city-menu.service';

describe('CityMenuService', () => {
  let service: CityMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
