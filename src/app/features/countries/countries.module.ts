// src/app/features/countries/countries.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Components
import { CountriesListComponent } from './countries-list.component';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { CountrySidebarComponent } from './country-detail/components/sidebar/sidebar.component';
import { CountryGeneralInfoComponent } from './country-detail/components/general-info/general-info.component';
import { CountryCitiesComponent } from './country-detail/components/cities/cities.component';
import { CountryUniversitiesComponent } from './country-detail/components/universities/universities.component';
import { CountryEducationSystemComponent } from './country-detail/components/education-system/education-system.component';
import { CountryCultureComponent } from './country-detail/components/culture/culture.component';
import { CountryTravelInfoComponent } from './country-detail/components/travel-info/travel-info.component';

const routes: Routes = [
  {
    path: '',
    component: CountriesListComponent
  },
  {
    path: ':id',
    component: CountryDetailComponent
  }
];

@NgModule({
  declarations: [
    CountriesListComponent,
    CountryDetailComponent,
    CountrySidebarComponent,
    CountryGeneralInfoComponent,
    CountryCitiesComponent,
    CountryUniversitiesComponent,
    CountryEducationSystemComponent,
    CountryCultureComponent,
    CountryTravelInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CountriesModule { }