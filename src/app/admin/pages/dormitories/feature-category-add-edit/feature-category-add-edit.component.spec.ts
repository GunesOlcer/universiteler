import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureCategoryAddEditComponent } from './feature-category-add-edit.component';

describe('FeatureCategoryAddEditComponent', () => {
  let component: FeatureCategoryAddEditComponent;
  let fixture: ComponentFixture<FeatureCategoryAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureCategoryAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureCategoryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
