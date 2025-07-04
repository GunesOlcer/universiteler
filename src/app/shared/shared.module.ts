// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CityCardComponent } from './components/city-card/city-card.component';
import { CountryCardComponent } from './components/country-card/country-card.component'; // ✅ Ekle
import { UniversityCardComponent } from './components/university-card/university-card.component';
import { DepartmentCardComponent } from './components/department-card/department-card.component';
import { DormitoryCardComponent } from './components/dormitory-card/dormitory-card.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';

import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [
    CityCardComponent,
    CountryCardComponent, // ✅ Ekle
    UniversityCardComponent,
    DepartmentCardComponent,
    DormitoryCardComponent,
    ArticleCardComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CityCardComponent,
    CountryCardComponent, // ✅ Ekle
    UniversityCardComponent,
    DepartmentCardComponent,
    DormitoryCardComponent,
    ArticleCardComponent,
    SafeUrlPipe
  ]
})
export class SharedModule { }