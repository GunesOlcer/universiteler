import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

// Main Components
import { UniversitiesListComponent } from './universities-list.component';
import { UniversityDetailComponent } from './university-detail/university-detail.component';
import { SidebarComponent } from './university-detail/sidebar/sidebar.component';
import { NearbyUniversitiesComponent } from './university-detail/nearby-universities/nearby-universities.component';
import { CustomMenuContentComponent } from './university-detail/custom-menu-content/custom-menu-content.component';

// All Detail Section Components
import { GenelBilgiComponent } from './university-detail/genel-bilgi/genel-bilgi.component';
import { KilitOzelliklerComponent } from './university-detail/kilit-ozellikler/kilit-ozellikler.component';
import { KampuslerComponent } from './university-detail/kampusler/kampusler.component';
import { BurslarComponent } from './university-detail/burslar/burslar.component';
import { IsStajComponent } from './university-detail/is-staj/is-staj.component';
import { ErasmusComponent } from './university-detail/erasmus/erasmus.component';
import { EgitimSistemiComponent } from './university-detail/egitim-sistemi/egitim-sistemi.component';
import { HazirlikEgitimiComponent } from './university-detail/hazirlik-egitimi/hazirlik-egitimi.component';
import { CiftAnaDalComponent } from './university-detail/cift-ana-dal/cift-ana-dal.component';
import { UzaktanEgitimComponent } from './university-detail/uzaktan-egitim/uzaktan-egitim.component';
import { AkreditasyonComponent } from './university-detail/akreditasyon/akreditasyon.component';
import { TabanPuanlarComponent } from './university-detail/taban-puanlar/taban-puanlar.component';
import { UlasimComponent } from './university-detail/ulasim/ulasim.component';
import { KampusYasamComponent } from './university-detail/kampus-yasam/kampus-yasam.component';
import { TopluluklarComponent } from './university-detail/topluluklar/topluluklar.component';
import { KutuphaneComponent } from './university-detail/kutuphane/kutuphane.component';
import { SaglikOlanaklariComponent } from './university-detail/saglik-olanaklari/saglik-olanaklari.component';
import { YemeIcmeComponent } from './university-detail/yeme-icme/yeme-icme.component';
import { UluslararasiComponent } from './university-detail/uluslararasi/uluslararasi.component';
import { YurtlarComponent } from './university-detail/yurtlar/yurtlar.component';

const routes: Routes = [
  {
    path: '',
    component: UniversitiesListComponent
  },
  {
    path: ':id',
    component: UniversityDetailComponent
  }
];

@NgModule({
  declarations: [
    // Main Components
    UniversitiesListComponent,
    UniversityDetailComponent,
    SidebarComponent,
    NearbyUniversitiesComponent,
    CustomMenuContentComponent,
    
    // ALL Detail Section Components
    GenelBilgiComponent,
    KilitOzelliklerComponent,
    KampuslerComponent,
    BurslarComponent,
    IsStajComponent,
    ErasmusComponent,
    EgitimSistemiComponent,
    HazirlikEgitimiComponent,
    CiftAnaDalComponent,
    UzaktanEgitimComponent,
    AkreditasyonComponent,
    TabanPuanlarComponent,
    UlasimComponent,
    KampusYasamComponent,
    TopluluklarComponent,
    KutuphaneComponent,
    SaglikOlanaklariComponent,
    YemeIcmeComponent,
    UluslararasiComponent,
    YurtlarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UniversitiesModule { }