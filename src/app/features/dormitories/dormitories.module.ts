import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Components
import { DormitoriesListComponent } from './dormitories-list.component';
import { DormitoryDetailComponent } from './dormitory-detail/dormitory-detail.component';
import { SidebarComponent } from './dormitory-detail/sidebar/sidebar.component';
import { GenelBilgiComponent } from './dormitory-detail/genel-bilgi/genel-bilgi.component';
import { OlanaklarComponent } from './dormitory-detail/olanaklar/olanaklar.component';
import { YakinUniversitelerComponent } from './dormitory-detail/yakin-universiteler/yakin-universiteler.component';
import { KonumCevreComponent } from './dormitory-detail/konum-cevre/konum-cevre.component';

const routes: Routes = [
  {
    path: '',
    component: DormitoriesListComponent
  },
  {
    path: ':id',
    component: DormitoryDetailComponent
  }
];

@NgModule({
  declarations: [
    DormitoriesListComponent,
    DormitoryDetailComponent,
    SidebarComponent,
    GenelBilgiComponent,
    OlanaklarComponent,
    YakinUniversitelerComponent,
    KonumCevreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    DormitoriesListComponent,
    DormitoryDetailComponent
  ]
})
export class DormitoriesModule { }