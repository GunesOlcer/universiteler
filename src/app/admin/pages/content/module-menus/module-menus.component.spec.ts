import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleMenusComponent } from './module-menus.component';

describe('ModuleMenusComponent', () => {
  let component: ModuleMenusComponent;
  let fixture: ComponentFixture<ModuleMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleMenusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
