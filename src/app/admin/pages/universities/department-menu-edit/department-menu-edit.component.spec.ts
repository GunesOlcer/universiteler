import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentMenuEditComponent } from './department-menu-edit.component';

describe('DepartmentMenuEditComponent', () => {
  let component: DepartmentMenuEditComponent;
  let fixture: ComponentFixture<DepartmentMenuEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentMenuEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
