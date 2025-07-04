import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

// University management components
import { UniversityListComponent } from './pages/universities/university-list/university-list.component';
import { UniversityAddEditComponent } from './pages/universities/university-add-edit/university-add-edit.component';
import { FacultyListComponent } from './pages/universities/faculty-list/faculty-list.component';
import { FacultyAddEditComponent } from './pages/universities/faculty-add-edit/faculty-add-edit.component';
import { DepartmentListComponent } from './pages/universities/department-list/department-list.component';
import { DepartmentAddEditComponent } from './pages/universities/department-add-edit/department-add-edit.component';
import { CitiesListComponent } from './pages/regions/cities-list/cities-list.component';
import { CityAddEditComponent } from './pages/regions/city-add-edit/city-add-edit.component';
import { CountriesListComponent } from './pages/regions/countries-list/countries-list.component';
import { CountryAddEditComponent } from './pages/regions/country-add-edit/country-add-edit.component';

// Dormitory management components
import { DormitoryListComponent } from './pages/dormitories/dormitory-list/dormitory-list.component';
import { DormitoryAddEditComponent } from './pages/dormitories/dormitory-add-edit/dormitory-add-edit.component';
import { DormitoryFeaturesComponent } from './pages/dormitories/dormitory-features/dormitory-features.component';
import { FeatureCategoryAddEditComponent } from './pages/dormitories/feature-category-add-edit/feature-category-add-edit.component';

// Content management components
import { NewsListComponent } from './pages/content/news-list/news-list.component';
import { ArticlesListComponent } from './pages/content/articles-list/articles-list.component';
import { PagesListComponent } from './pages/content/pages-list/pages-list.component';
import { DynamicMenusComponent } from './pages/content/dynamic-menus/dynamic-menus.component';
import { ModuleMenusComponent } from './pages/content/module-menus/module-menus.component';
import { HelpTopicsComponent } from './pages/content/help-topics/help-topics.component';

// User management components
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { OnlineUsersComponent } from './pages/users/online-users/online-users.component';

// Site management components
import { AdminUsersComponent } from './pages/site/admin-users/admin-users.component';
import { SiteSettingsComponent } from './pages/site/site-settings/site-settings.component';

// Shared components
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NewsAddEditComponent } from './pages/content/news-add-edit/news-add-edit.component';
import { ArticlesAddEditComponent } from './pages/content/articles-add-edit/articles-add-edit.component';
import { PagesAddEditComponent } from './pages/content/pages-add-edit/pages-add-edit.component';
import { UniversityMenuComponent } from './pages/universities/university-menu/university-menu.component';
import { UniversityMenuEditComponent } from './pages/universities/university-menu-edit/university-menu-edit.component';
import { DepartmentMenuComponent } from './pages/universities/department-menu/department-menu.component';
import { DepartmentMenuEditComponent } from './pages/universities/department-menu-edit/department-menu-edit.component';
import { CityMenuEditComponent } from './pages/regions/city-menu-edit/city-menu-edit.component';
import { CityMenuComponent } from './pages/regions/city-menu/city-menu.component';
import { DormitoryMenuComponent } from './pages/dormitories/dormitory-menu/dormitory-menu/dormitory-menu.component';
import { DormitoryMenuEditComponent } from './pages/dormitories/dormitory-menu/dormitory-menu-edit/dormitory-menu-edit.component';
import { ProgramListComponent } from './pages/universities/program-list/program-list.component';
import { ProgramAddEditComponent } from './pages/universities/program-add-edit/program-add-edit.component';
import { ProgramMenuComponent } from './pages/universities/program-menu/program-menu.component';
import { ProgramMenuEditComponent } from './pages/universities/program-menu-edit/program-menu-edit.component';
import { ProgramQuotasComponent } from './pages/universities/program-quotas/program-quotas.component';
import { ProgramQuotaAddEditComponent } from './pages/universities/program-quota-add-edit/program-quota-add-edit.component';
import { ProgramRankingsComponent } from './pages/universities/program-rankings/program-rankings.component';
import { ProgramRankingAddEditComponent } from './pages/universities/program-ranking-add-edit/program-ranking-add-edit.component';

// Import guards
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    DashboardComponent,
    UniversityListComponent,
    UniversityAddEditComponent,
    FacultyListComponent,
    FacultyAddEditComponent,
    DepartmentListComponent,
    DepartmentAddEditComponent,
    CitiesListComponent,
    CityAddEditComponent,
    CountriesListComponent,
    CountryAddEditComponent,
    DormitoryListComponent,
    DormitoryAddEditComponent,
    DormitoryFeaturesComponent,
    FeatureCategoryAddEditComponent,
    NewsListComponent,
    ArticlesListComponent,
    PagesListComponent,
    DynamicMenusComponent,
    ModuleMenusComponent,
    HelpTopicsComponent,
    UserListComponent,
    OnlineUsersComponent,
    AdminUsersComponent,
    SiteSettingsComponent,
    BreadcrumbComponent,
    ConfirmDialogComponent,
    PaginationComponent,
    FileUploadComponent,
    LoginComponent,
    NewsAddEditComponent,
    ArticlesAddEditComponent,
    PagesAddEditComponent,
    UniversityMenuComponent,
    UniversityMenuEditComponent,
    DepartmentMenuComponent,
    DepartmentMenuEditComponent,
    CityMenuEditComponent,
    CityMenuComponent,
    DormitoryMenuComponent,
    DormitoryMenuEditComponent,
    ProgramListComponent,
    ProgramAddEditComponent,
    ProgramMenuComponent,
    ProgramMenuEditComponent,
    ProgramQuotasComponent,
    ProgramQuotaAddEditComponent,
    ProgramRankingsComponent,
    ProgramRankingAddEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AdminRoutingModule
  ],
  providers: [
    AuthGuard,
    AdminGuard
  ]
})
export class AdminModule { }