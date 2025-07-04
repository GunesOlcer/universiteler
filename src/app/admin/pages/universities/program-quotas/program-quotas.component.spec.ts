import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramQuotasComponent } from './program-quotas.component';

describe('ProgramQuotasComponent', () => {
  let component: ProgramQuotasComponent;
  let fixture: ComponentFixture<ProgramQuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramQuotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramQuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
