import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramRankingsComponent } from './program-rankings.component';

describe('ProgramRankingsComponent', () => {
  let component: ProgramRankingsComponent;
  let fixture: ComponentFixture<ProgramRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramRankingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
