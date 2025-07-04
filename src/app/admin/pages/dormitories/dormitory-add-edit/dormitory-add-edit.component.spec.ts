import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormitoryAddEditComponent } from './dormitory-add-edit.component';

describe('DormitoryAddEditComponent', () => {
  let component: DormitoryAddEditComponent;
  let fixture: ComponentFixture<DormitoryAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormitoryAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormitoryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
