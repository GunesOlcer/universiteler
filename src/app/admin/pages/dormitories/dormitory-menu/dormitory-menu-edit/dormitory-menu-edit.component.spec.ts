import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormitoryMenuEditComponent } from './dormitory-menu-edit.component';

describe('DormitoryMenuEditComponent', () => {
  let component: DormitoryMenuEditComponent;
  let fixture: ComponentFixture<DormitoryMenuEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormitoryMenuEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormitoryMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
