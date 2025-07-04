import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyAddEditComponent } from './faculty-add-edit.component';

describe('FacultyAddEditComponent', () => {
  let component: FacultyAddEditComponent;
  let fixture: ComponentFixture<FacultyAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultyAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
