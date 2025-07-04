// src/app/features/home/home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './home.component';
import { HeroSectionComponent } from './hero-section.component';
import { FeaturedUniversitiesComponent } from './featured-universities.component';
import { PopularDepartmentsComponent } from './popular-departments.component';
import { PopularCitiesComponent } from './popular-cities.component';
import { FeaturedDormitoriesComponent } from './featured-dormitories.component';
import { LatestArticlesComponent } from './latest-articles.component';
import { SelectionBotPromoComponent } from './selection-bot-promo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    HeroSectionComponent,
    FeaturedUniversitiesComponent,
    PopularDepartmentsComponent,
    PopularCitiesComponent,
    FeaturedDormitoriesComponent,
    LatestArticlesComponent,
    SelectionBotPromoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ]
})
export class HomeModule { }