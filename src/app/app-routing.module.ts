// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'universiteler',
    loadChildren: () => import('./features/universities/universities.module').then(m => m.UniversitiesModule)
  },
  {
    path: 'bolumler',
    loadChildren: () => import('./features/departments/departments.module').then(m => m.DepartmentsModule)
  },
  {
    path: 'sehirler',
    loadChildren: () => import('./features/cities/cities.module').then(m => m.CitiesModule)
  },
  {
    path: 'ulkeler',
    loadChildren: () => import('./features/countries/countries.module').then(m => m.CountriesModule)
  },
  {
    path: 'yurtlar',
    loadChildren: () => import('./features/dormitories/dormitories.module').then(m => m.DormitoriesModule)
  },
  {
    path: 'makaleler',
    loadChildren: () => import('./features/articles/articles.module').then(m => m.ArticlesModule)
  },
  {
    path: 'tercih-botu',
    loadChildren: () => import('./features/selection-bot/selection-bot.module').then(m => m.SelectionBotModule)
  },
  {
    path: 'iletisim',
    loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: '',
    loadChildren: () => import('./features/static-pages/static-pages.module').then(m => m.StaticPagesModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }