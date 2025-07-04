// src/app/features/countries/countries.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Components
import { CountriesListComponent } from './countries-list.component';
import { CountryDetailComponent } from './country-detail/country-detail.component';

// Shared Components
import { SharedModule } from '../../shared/shared.module';

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
    CountryDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CountriesModule { }