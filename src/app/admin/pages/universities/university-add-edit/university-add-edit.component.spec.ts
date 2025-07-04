import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityAddEditComponent } from './university-add-edit.component';

describe('UniversityAddEditComponent', () => {
  let component: UniversityAddEditComponent;
  let fixture: ComponentFixture<UniversityAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversityAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
