import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAddEditComponent } from './news-add-edit.component';

describe('NewsAddEditComponent', () => {
  let component: NewsAddEditComponent;
  let fixture: ComponentFixture<NewsAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
