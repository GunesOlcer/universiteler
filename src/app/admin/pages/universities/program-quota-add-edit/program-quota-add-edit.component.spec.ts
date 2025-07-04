import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramQuotaAddEditComponent } from './program-quota-add-edit.component';

describe('ProgramQuotaAddEditComponent', () => {
  let component: ProgramQuotaAddEditComponent;
  let fixture: ComponentFixture<ProgramQuotaAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramQuotaAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramQuotaAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
