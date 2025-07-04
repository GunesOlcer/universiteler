// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';

// University management routes
import { UniversityListComponent } from './pages/universities/university-list/university-list.component';
import { UniversityAddEditComponent } from './pages/universities/university-add-edit/university-add-edit.component';
import { FacultyListComponent } from './pages/universities/faculty-list/faculty-list.component';
import { FacultyAddEditComponent } from './pages/universities/faculty-add-edit/faculty-add-edit.component';
import { DepartmentListComponent } from './pages/universities/department-list/department-list.component';
import { DepartmentAddEditComponent } from './pages/universities/department-add-edit/department-add-edit.component';
import { UniversityMenuComponent } from './pages/universities/university-menu/university-menu.component';
import { UniversityMenuEditComponent } from './pages/universities/university-menu-edit/university-menu-edit.component';
import { DepartmentMenuComponent } from './pages/universities/department-menu/department-menu.component';
import { DepartmentMenuEditComponent } from './pages/universities/department-menu-edit/department-menu-edit.component';

// Program management routes
import { ProgramListComponent } from './pages/universities/program-list/program-list.component';
import { ProgramAddEditComponent } from './pages/universities/program-add-edit/program-add-edit.component';
import { ProgramMenuComponent } from './pages/universities/program-menu/program-menu.component';
import { ProgramMenuEditComponent } from './pages/universities/program-menu-edit/program-menu-edit.component';
import { ProgramQuotasComponent } from './pages/universities/program-quotas/program-quotas.component';
import { ProgramQuotaAddEditComponent } from './pages/universities/program-quota-add-edit/program-quota-add-edit.component';
import { ProgramRankingsComponent } from './pages/universities/program-rankings/program-rankings.component';
import { ProgramRankingAddEditComponent } from './pages/universities/program-ranking-add-edit/program-ranking-add-edit.component';

// Region management routes
import { CitiesListComponent } from './pages/regions/cities-list/cities-list.component';
import { CityAddEditComponent } from './pages/regions/city-add-edit/city-add-edit.component';
import { CityMenuComponent } from './pages/regions/city-menu/city-menu.component';
import { CityMenuEditComponent } from './pages/regions/city-menu-edit/city-menu-edit.component';
import { CountriesListComponent } from './pages/regions/countries-list/countries-list.component';
import { CountryAddEditComponent } from './pages/regions/country-add-edit/country-add-edit.component';

// Dormitory management routes
import { DormitoryListComponent } from './pages/dormitories/dormitory-list/dormitory-list.component';
import { DormitoryAddEditComponent } from './pages/dormitories/dormitory-add-edit/dormitory-add-edit.component';
import { DormitoryFeaturesComponent } from './pages/dormitories/dormitory-features/dormitory-features.component';
import { FeatureCategoryAddEditComponent } from './pages/dormitories/feature-category-add-edit/feature-category-add-edit.component';
import { DormitoryMenuComponent } from './pages/dormitories/dormitory-menu/dormitory-menu/dormitory-menu.component';
import { DormitoryMenuEditComponent } from './pages/dormitories/dormitory-menu/dormitory-menu-edit/dormitory-menu-edit.component';

// Content management routes
import { NewsListComponent } from './pages/content/news-list/news-list.component';
import { NewsAddEditComponent } from './pages/content/news-add-edit/news-add-edit.component';
import { ArticlesListComponent } from './pages/content/articles-list/articles-list.component';
import { ArticlesAddEditComponent } from './pages/content/articles-add-edit/articles-add-edit.component';
import { PagesListComponent } from './pages/content/pages-list/pages-list.component';
import { PagesAddEditComponent } from './pages/content/pages-add-edit/pages-add-edit.component';
import { DynamicMenusComponent } from './pages/content/dynamic-menus/dynamic-menus.component';
import { ModuleMenusComponent } from './pages/content/module-menus/module-menus.component';
import { HelpTopicsComponent } from './pages/content/help-topics/help-topics.component';

// User management routes
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { OnlineUsersComponent } from './pages/users/online-users/online-users.component';

// Site management routes
import { AdminUsersComponent } from './pages/site/admin-users/admin-users.component';
import { SiteSettingsComponent } from './pages/site/site-settings/site-settings.component';

// Guards
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
    canActivateChild: [AuthGuard, AdminGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
      },
      
      // University Management Routes
      {
        path: 'universities',
        children: [
          {
            path: '',
            component: UniversityListComponent,
            data: { title: 'Üniversite Listesi', breadcrumb: 'Üniversiteler' }
          },
          {
            path: 'add',
            component: UniversityAddEditComponent,
            data: { title: 'Yeni Üniversite Ekle', breadcrumb: 'Yeni Üniversite' }
          },
          {
            path: 'edit/:id',
            component: UniversityAddEditComponent,
            data: { title: 'Üniversite Düzenle', breadcrumb: 'Üniversite Düzenle' }
          },
          {
            path: 'menus/:id',
            component: UniversityMenuComponent,
            data: { title: 'Üniversite Menüleri', breadcrumb: 'Menüler' }
          },
          {
            path: 'menus/add/:universityId',
            component: UniversityMenuEditComponent,
            data: { title: 'Yeni Menü Ekle', breadcrumb: 'Yeni Menü' }
          },
          {
            path: 'menus/edit/:universityId/:menuItemId',
            component: UniversityMenuEditComponent,
            data: { title: 'Menü İçeriği Düzenleme', breadcrumb: 'Menü Düzenle' }
          }
        ]
      },
      
      // Faculty Management Routes
      {
        path: 'faculties',
        children: [
          {
            path: '',
            component: FacultyListComponent,
            data: { title: 'Fakülteler', breadcrumb: 'Fakülteler' }
          },
          {
            path: 'add',
            component: FacultyAddEditComponent,
            data: { title: 'Yeni Fakülte Ekle', breadcrumb: 'Yeni Fakülte' }
          },
          {
            path: 'edit/:id',
            component: FacultyAddEditComponent,
            data: { title: 'Fakülte Düzenle', breadcrumb: 'Fakülte Düzenle' }
          }
        ]
      },
      
      // Department Management Routes
      {
        path: 'departments',
        children: [
          {
            path: '',
            component: DepartmentListComponent,
            data: { title: 'Bölümler', breadcrumb: 'Bölümler' }
          },
          {
            path: 'add',
            component: DepartmentAddEditComponent,
            data: { title: 'Yeni Bölüm Ekle', breadcrumb: 'Yeni Bölüm' }
          },
          {
            path: 'edit/:id',
            component: DepartmentAddEditComponent,
            data: { title: 'Bölüm Düzenle', breadcrumb: 'Bölüm Düzenle' }
          },
          {
            path: 'menus/:id',
            component: DepartmentMenuComponent,
            data: { title: 'Bölüm Menüleri', breadcrumb: 'Bölüm Menüleri' }
          },
          {
            path: 'menus/add/:departmentId',
            component: DepartmentMenuEditComponent,
            data: { title: 'Yeni Bölüm Menüsü Ekle', breadcrumb: 'Yeni Menü' }
          },
          {
            path: 'menus/edit/:departmentId/:menuItemId',
            component: DepartmentMenuEditComponent,
            data: { title: 'Bölüm Menü İçeriği Düzenleme', breadcrumb: 'Menü Düzenle' }
          }
        ]
      },
      
      // Program Management Routes
      {
        path: 'programs',
        children: [
          {
            path: '',
            component: ProgramListComponent,
            data: { title: 'Program Listesi', breadcrumb: 'Programlar' }
          },
          {
            path: 'add',
            component: ProgramAddEditComponent,
            data: { title: 'Yeni Program Ekle', breadcrumb: 'Yeni Program' }
          },
          {
            path: 'edit/:id',
            component: ProgramAddEditComponent,
            data: { title: 'Program Düzenle', breadcrumb: 'Program Düzenle' }
          },
          {
            path: 'menus/:id',
            component: ProgramMenuComponent,
            data: { title: 'Program Menüleri', breadcrumb: 'Program Menüleri' }
          },
          {
            path: 'menus/add/:programId',
            component: ProgramMenuEditComponent,
            data: { title: 'Yeni Program Menüsü Ekle', breadcrumb: 'Yeni Menü' }
          },
          {
            path: 'menus/edit/:programId/:menuItemId',
            component: ProgramMenuEditComponent,
            data: { title: 'Program Menü İçeriği Düzenleme', breadcrumb: 'Menü Düzenle' }
          },
          {
            path: 'quotas/:id',
            component: ProgramQuotasComponent,
            data: { title: 'Program Kontenjanları', breadcrumb: 'Kontenjanlar' }
          },
          {
            path: 'quotas/add/:programId',
            component: ProgramQuotaAddEditComponent,
            data: { title: 'Yeni Kontenjan Ekle', breadcrumb: 'Yeni Kontenjan' }
          },
          {
            path: 'quotas/edit/:programId/:quotaId',
            component: ProgramQuotaAddEditComponent,
            data: { title: 'Kontenjan Düzenle', breadcrumb: 'Kontenjan Düzenle' }
          },
          {
            path: 'rankings/:id',
            component: ProgramRankingsComponent,
            data: { title: 'Program Başarı Sıralamaları', breadcrumb: 'Başarı Sıralamaları' }
          },
          {
            path: 'rankings/add/:programId',
            component: ProgramRankingAddEditComponent,
            data: { title: 'Yeni Başarı Sıralaması Ekle', breadcrumb: 'Yeni Sıralama' }
          },
          {
            path: 'rankings/edit/:programId/:rankingId',
            component: ProgramRankingAddEditComponent,
            data: { title: 'Başarı Sıralaması Düzenle', breadcrumb: 'Sıralama Düzenle' }
          }
        ]
      },
      
      // Region Management Routes - FIXED CITY MENU ROUTES
      {
        path: 'cities',
        children: [
          {
            path: '',
            component: CitiesListComponent,
            data: { title: 'Şehirler', breadcrumb: 'Şehirler' }
          },
          {
            path: 'add',
            component: CityAddEditComponent,
            data: { title: 'Yeni Şehir Ekle', breadcrumb: 'Yeni Şehir' }
          },
          {
            path: 'edit/:id',
            component: CityAddEditComponent,
            data: { title: 'Şehir Düzenle', breadcrumb: 'Şehir Düzenle' }
          },
          {
            path: 'menus/:id',
            component: CityMenuComponent,
            data: { title: 'Şehir Menüleri', breadcrumb: 'Şehir Menüleri' }
          },
          // FIXED: Added route for adding new city menu
          {
            path: 'menus/add/:cityId',
            component: CityMenuEditComponent,
            data: { title: 'Yeni Şehir Menüsü Ekle', breadcrumb: 'Yeni Menü' }
          },
          {
            path: 'menus/edit/:cityId/:menuItemId',
            component: CityMenuEditComponent,
            data: { title: 'Şehir Menü İçeriği Düzenleme', breadcrumb: 'Menü Düzenle' }
          }
        ]
      },
      
      {
        path: 'countries',
        children: [
          {
            path: '',
            component: CountriesListComponent,
            data: { title: 'Ülkeler', breadcrumb: 'Ülkeler' }
          },
          {
            path: 'add',
            component: CountryAddEditComponent,
            data: { title: 'Yeni Ülke Ekle', breadcrumb: 'Yeni Ülke' }
          },
          {
            path: 'edit/:id',
            component: CountryAddEditComponent,
            data: { title: 'Ülke Düzenle', breadcrumb: 'Ülke Düzenle' }
          }
        ]
      },
      
      // Dormitory Management Routes
      {
        path: 'dormitories',
        children: [
          {
            path: '',
            component: DormitoryListComponent,
            data: { title: 'Yurtlar', breadcrumb: 'Yurtlar' }
          },
          {
            path: 'add',
            component: DormitoryAddEditComponent,
            data: { title: 'Yeni Yurt Ekle', breadcrumb: 'Yeni Yurt' }
          },
          {
            path: 'edit/:id',
            component: DormitoryAddEditComponent,
            data: { title: 'Yurt Düzenle', breadcrumb: 'Yurt Düzenle' }
          },
          {
            path: 'menus/:id',
            component: DormitoryMenuComponent,
            data: { title: 'Yurt Menüleri', breadcrumb: 'Yurt Menüleri' }
          },
          {
            path: 'menus/add/:dormitoryId',
            component: DormitoryMenuEditComponent,
            data: { title: 'Yeni Yurt Menüsü Ekle', breadcrumb: 'Yeni Menü' }
          },
          {
            path: 'menus/edit/:dormitoryId/:menuItemId',
            component: DormitoryMenuEditComponent,
            data: { title: 'Yurt Menü İçeriği Düzenleme', breadcrumb: 'Menü Düzenle' }
          }
        ]
      },
      
      {
        path: 'dormitory-features',
        children: [
          {
            path: '',
            component: DormitoryFeaturesComponent,
            data: { title: 'Yurt Özellikleri', breadcrumb: 'Yurt Özellikleri' }
          },
          {
            path: 'add-category',
            component: FeatureCategoryAddEditComponent,
            data: { title: 'Yeni Özellik Kategorisi Ekle', breadcrumb: 'Yeni Kategori' }
          },
          {
            path: 'edit-category/:id',
            component: FeatureCategoryAddEditComponent,
            data: { title: 'Özellik Kategorisi Düzenle', breadcrumb: 'Kategori Düzenle' }
          }
        ]
      },
      
      // Content Management Routes
      {
        path: 'news',
        children: [
          {
            path: '',
            component: NewsListComponent,
            data: { title: 'Haberler', breadcrumb: 'Haberler' }
          },
          {
            path: 'add',
            component: NewsAddEditComponent,
            data: { title: 'Yeni Haber Ekle', breadcrumb: 'Yeni Haber' }
          },
          {
            path: 'edit/:id',
            component: NewsAddEditComponent,
            data: { title: 'Haber Düzenle', breadcrumb: 'Haber Düzenle' }
          }
        ]
      },
      
      {
        path: 'articles',
        children: [
          {
            path: '',
            component: ArticlesListComponent,
            data: { title: 'Makaleler', breadcrumb: 'Makaleler' }
          },
          {
            path: 'add',
            component: ArticlesAddEditComponent,
            data: { title: 'Yeni Makale Ekle', breadcrumb: 'Yeni Makale' }
          },
          {
            path: 'edit/:id',
            component: ArticlesAddEditComponent,
            data: { title: 'Makale Düzenle', breadcrumb: 'Makale Düzenle' }
          }
        ]
      },
      
      {
        path: 'pages',
        children: [
          {
            path: '',
            component: PagesListComponent,
            data: { title: 'Sayfalar', breadcrumb: 'Sayfalar' }
          },
          {
            path: 'add',
            component: PagesAddEditComponent,
            data: { title: 'Yeni Sayfa Ekle', breadcrumb: 'Yeni Sayfa' }
          },
          {
            path: 'edit/:id',
            component: PagesAddEditComponent,
            data: { title: 'Sayfa Düzenle', breadcrumb: 'Sayfa Düzenle' }
          }
        ]
      },
      
      // Menu Management Routes
      {
        path: 'dynamic-menus',
        component: DynamicMenusComponent,
        data: { title: 'Dinamik Menüler', breadcrumb: 'Dinamik Menüler' }
      },
      {
        path: 'module-menus',
        component: ModuleMenusComponent,
        data: { title: 'Modül Menüleri', breadcrumb: 'Modül Menüleri' }
      },
      {
        path: 'help-topics',
        component: HelpTopicsComponent,
        data: { title: 'Yardım Konuları', breadcrumb: 'Yardım Konuları' }
      },
      
      // User Management Routes
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UserListComponent,
            data: { title: 'Kullanıcılar', breadcrumb: 'Kullanıcılar' }
          },
          {
            path: 'online',
            component: OnlineUsersComponent,
            data: { title: 'Online Kullanıcılar', breadcrumb: 'Online Kullanıcılar' }
          }
        ]
      },
      
      // Site Management Routes
      {
        path: 'admins',
        component: AdminUsersComponent,
        data: { title: 'Yöneticiler', breadcrumb: 'Yöneticiler' }
      },
      {
        path: 'site-settings',
        component: SiteSettingsComponent,
        data: { title: 'Site Ayarları', breadcrumb: 'Site Ayarları' }
      },
      
      // Fallback route for admin module
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }