import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramAddEditComponent } from './program-add-edit.component';

describe('ProgramAddEditComponent', () => {
  let component: ProgramAddEditComponent;
  let fixture: ComponentFixture<ProgramAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
