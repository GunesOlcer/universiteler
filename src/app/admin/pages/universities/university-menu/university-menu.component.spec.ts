import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityMenuComponent } from './university-menu.component';

describe('UniversityMenuComponent', () => {
  let component: UniversityMenuComponent;
  let fixture: ComponentFixture<UniversityMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversityMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
