import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormitoryMenuComponent } from './dormitory-menu.component';

describe('DormitoryMenuComponent', () => {
  let component: DormitoryMenuComponent;
  let fixture: ComponentFixture<DormitoryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormitoryMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormitoryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
