import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesAddEditComponent } from './articles-add-edit.component';

describe('ArticlesAddEditComponent', () => {
  let component: ArticlesAddEditComponent;
  let fixture: ComponentFixture<ArticlesAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
