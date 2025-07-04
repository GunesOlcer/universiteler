import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Components
import { CitiesListComponent } from './cities-list.component';
import { CityDetailComponent } from './city-detail/city-detail.component';
import { SidebarComponent } from './city-detail/components/sidebar/sidebar.component';
import { DynamicContentComponent } from './city-detail/components/dynamic-content/dynamic-content.component';
import { NearbyCitiesComponent } from './city-detail/components/nearby-cities/nearby-cities.component';

const routes: Routes = [
  {
    path: '',
    component: CitiesListComponent
  },
  {
    path: ':id',
    component: CityDetailComponent
  }
];

@NgModule({
  declarations: [
    CitiesListComponent,
    CityDetailComponent,
    SidebarComponent,
    DynamicContentComponent,
    NearbyCitiesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CitiesModule { }