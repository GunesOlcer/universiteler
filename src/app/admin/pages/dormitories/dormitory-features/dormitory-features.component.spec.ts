import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormitoryFeaturesComponent } from './dormitory-features.component';

describe('DormitoryFeaturesComponent', () => {
  let component: DormitoryFeaturesComponent;
  let fixture: ComponentFixture<DormitoryFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormitoryFeaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormitoryFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
