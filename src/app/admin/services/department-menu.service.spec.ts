import { TestBed } from '@angular/core/testing';

import { DepartmentMenuService } from './department-menu.service';

describe('DepartmentMenuService', () => {
  let service: DepartmentMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
