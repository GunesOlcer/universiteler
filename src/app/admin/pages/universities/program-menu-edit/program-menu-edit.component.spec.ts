import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramMenuEditComponent } from './program-menu-edit.component';

describe('ProgramMenuEditComponent', () => {
  let component: ProgramMenuEditComponent;
  let fixture: ComponentFixture<ProgramMenuEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramMenuEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
