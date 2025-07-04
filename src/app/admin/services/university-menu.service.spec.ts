import { TestBed } from '@angular/core/testing';

import { UniversityMenuService } from './university-menu.service';

describe('UniversityMenuService', () => {
  let service: UniversityMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversityMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
