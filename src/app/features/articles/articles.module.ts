// src/app/features/articles/articles.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ArticlesListComponent } from './articles-list.component';
import { ArticleDetailComponent } from './article-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesListComponent
  },
  {
    path: ':id',
    component: ArticleDetailComponent
  }
];

@NgModule({
  declarations: [
    ArticlesListComponent,
    ArticleDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ]
})
export class ArticlesModule { }