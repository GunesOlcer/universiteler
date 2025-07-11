import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormitoryListComponent } from './dormitory-list.component';

describe('DormitoryListComponent', () => {
  let component: DormitoryListComponent;
  let fixture: ComponentFixture<DormitoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormitoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormitoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
