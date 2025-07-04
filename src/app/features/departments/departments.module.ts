// src/app/features/departments/departments.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Components
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { DepartmentDetailComponent } from './department-detail/department-detail.component';
import { SidebarComponent } from './department-detail/sidebar/sidebar.component';
import { RelatedContentComponent } from './department-detail/related-content/related-content.component';

// Content Components
import { GenelBilgiComponent } from './department-detail/content/genel-bilgi/genel-bilgi.component';
import { IcerikMufredatComponent } from './department-detail/content/icerik-mufredat/icerik-mufredat.component';
import { KimIcinUygunComponent } from './department-detail/content/kim-icin-uygun/kim-icin-uygun.component';
import { KimIcinUygunDegilComponent } from './department-detail/content/kim-icin-uygun-degil/kim-icin-uygun-degil.component';
import { GerekliBecerilerComponent } from './department-detail/content/gerekli-beceriler/gerekli-beceriler.component';
import { TavsiyelerComponent } from './department-detail/content/tavsiyeler/tavsiyeler.component';
import { CalismaHayatiComponent } from './department-detail/content/calisma-hayati/calisma-hayati.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentsListComponent
  },
  {
    path: ':id',
    component: DepartmentDetailComponent
  }
];

@NgModule({
  declarations: [
    DepartmentsListComponent,
    DepartmentDetailComponent,
    SidebarComponent,
    RelatedContentComponent,
    GenelBilgiComponent,
    IcerikMufredatComponent,
    KimIcinUygunComponent,
    KimIcinUygunDegilComponent,
    GerekliBecerilerComponent,
    TavsiyelerComponent,
    CalismaHayatiComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DepartmentsModule { }