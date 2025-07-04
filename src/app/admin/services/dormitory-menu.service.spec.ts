import { TestBed } from '@angular/core/testing';

import { DormitoryMenuService } from './dormitory-menu.service';

describe('DormitoryMenuService', () => {
  let service: DormitoryMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DormitoryMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
