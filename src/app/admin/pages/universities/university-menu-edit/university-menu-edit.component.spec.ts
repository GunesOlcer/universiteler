import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityMenuEditComponent } from './university-menu-edit.component';

describe('UniversityMenuEditComponent', () => {
  let component: UniversityMenuEditComponent;
  let fixture: ComponentFixture<UniversityMenuEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversityMenuEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
