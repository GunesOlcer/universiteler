import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Components
import { CitiesListComponent } from './cities-list.component';
import { CityDetailComponent } from './city-detail/city-detail.component';
import { SidebarComponent } from './city-detail/components/sidebar/sidebar.component';
import { GeneralInfoComponent } from './city-detail/components/general-info/general-info.component';
import { ClimateComponent } from './city-detail/components/climate/climate.component';
import { DemographicsComponent } from './city-detail/components/demographics/demographics.component';
import { UniversitiesComponent } from './city-detail/components/universities/universities.component';
import { DormitoriesComponent } from './city-detail/components/dormitories/dormitories.component';
import { LifestyleComponent } from './city-detail/components/lifestyle/lifestyle.component';
import { CultureArtComponent } from './city-detail/components/culture-art/culture-art.component';
import { ImportantPlacesComponent } from './city-detail/components/important-places/important-places.component';
import { FoodDrinkComponent } from './city-detail/components/food-drink/food-drink.component';
import { EconomyWorkComponent } from './city-detail/components/economy-work/economy-work.component';
import { HealthSportsComponent } from './city-detail/components/health-sports/health-sports.component';
import { TransportationComponent } from './city-detail/components/transportation/transportation.component';
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
    GeneralInfoComponent,
    ClimateComponent,
    DemographicsComponent,
    UniversitiesComponent,
    DormitoriesComponent,
    LifestyleComponent,
    CultureArtComponent,
    ImportantPlacesComponent,
    FoodDrinkComponent,
    EconomyWorkComponent,
    HealthSportsComponent,
    TransportationComponent,
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