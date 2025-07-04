import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramRankingAddEditComponent } from './program-ranking-add-edit.component';

describe('ProgramRankingAddEditComponent', () => {
  let component: ProgramRankingAddEditComponent;
  let fixture: ComponentFixture<ProgramRankingAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramRankingAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramRankingAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
