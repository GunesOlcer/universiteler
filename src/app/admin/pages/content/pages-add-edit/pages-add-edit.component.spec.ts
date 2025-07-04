import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesAddEditComponent } from './pages-add-edit.component';

describe('PagesAddEditComponent', () => {
  let component: PagesAddEditComponent;
  let fixture: ComponentFixture<PagesAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
