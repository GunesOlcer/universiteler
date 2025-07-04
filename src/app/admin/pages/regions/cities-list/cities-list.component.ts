// src/app/features/admin/pages/regions/cities-list/cities-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CityService } from '../../../../core/services/city.service';
import { CountryService } from '../../../../core/services/country.service';
import { AuthService } from '../../../../core/services/auth.service';
import { City, CityFilterParams, getRegionName } from '../../../../core/models/city.model';
import { Country } from '../../../../core/models/country.model';
import { Status } from '../../../../core/models/base.model';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit, OnDestroy {
  cities: City[] = [];
  countries: Country[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  loading = false;
  filters: CityFilterParams = {
    searchTerm: '',
    status: undefined,
    countryId: undefined,
    region: undefined,
    pageNumber: 1,
    pageSize: 10
  };
  filterPanelOpen = true;
  showConfirmDialog = false;
  cityToDelete: City | null = null;
  error = '';
  
  private destroy$ = new Subject<void>();
  
  Math = Math;
  Status = Status;

  constructor(
    private cityService: CityService,
    private countryService: CountryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🏙️ [CitiesListComponent] Initializing cities list');
    
    // Check authentication
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('❌ [CitiesListComponent] User not authenticated, redirecting to login');
          this.router.navigate(['/admin/login']);
          return;
        }
        
        // Load data if authenticated
        this.loadCountries();
        this.loadCities();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCountries(): void {
    console.log('🌍 [CitiesListComponent] Loading countries');
    
    this.countryService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries) => {
          console.log('✅ [CitiesListComponent] Countries loaded:', countries.length);
          this.countries = countries;
        },
        error: (error) => {
          console.error('❌ [CitiesListComponent] Error loading countries:', error);
          this.error = 'Ülkeler yüklenirken hata oluştu: ' + error.message;
        }
      });
  }

  loadCities(): void {
    console.log('🏙️ [CitiesListComponent] Loading cities with filters:', this.filters);
    
    this.loading = true;
    this.error = '';
    
    const params: CityFilterParams = {
      ...this.filters,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    this.cityService.getAllPaginated(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ [CitiesListComponent] Cities loaded:', response);
          this.cities = response.data || [];
          this.totalItems = response.totalItems || 0;
          this.totalPages = response.totalPages || 0;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ [CitiesListComponent] Error loading cities:', error);
          this.error = 'Şehirler yüklenirken hata oluştu: ' + error.message;
          this.cities = [];
          this.totalItems = 0;
          this.totalPages = 0;
          this.loading = false;
          
          // If unauthorized, redirect to login
          if (error.message.includes('Yetkisiz') || error.message.includes('401')) {
            console.log('🔐 [CitiesListComponent] Unauthorized error, checking auth status');
            this.authService.logout().subscribe();
          }
        }
      });
  }

  applyFilters(): void {
    console.log('🔍 [CitiesListComponent] Applying filters:', this.filters);
    this.currentPage = 1;
    this.loadCities();
  }

  resetFilters(): void {
    console.log('🔄 [CitiesListComponent] Resetting filters');
    this.filters = {
      searchTerm: '',
      status: undefined,
      countryId: undefined,
      region: undefined,
      pageNumber: 1,
      pageSize: 10
    };
    this.currentPage = 1;
    this.loadCities();
  }

  onPageChange(page: number): void {
    console.log('📄 [CitiesListComponent] Page changed to:', page);
    this.currentPage = page;
    this.loadCities();
  }

  confirmDelete(city: City): void {
    console.log('🗑️ [CitiesListComponent] Confirm delete city:', city.name);
    this.cityToDelete = city;
    this.showConfirmDialog = true;
  }

  deleteCity(): void {
    if (!this.cityToDelete) return;
    
    console.log('🗑️ [CitiesListComponent] Deleting city:', this.cityToDelete.name);
    
    this.cityService.delete(this.cityToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ [CitiesListComponent] City deleted successfully');
          this.cities = this.cities.filter(c => c.id !== this.cityToDelete!.id);
          this.totalItems--;
          this.showConfirmDialog = false;
          this.cityToDelete = null;
          
          // If no cities left on current page, go to previous page
          if (this.cities.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadCities();
          }
        },
        error: (error) => {
          console.error('❌ [CitiesListComponent] Error deleting city:', error);
          this.error = 'Şehir silinirken hata oluştu: ' + error.message;
          this.showConfirmDialog = false;
          this.cityToDelete = null;
        }
      });
  }

  cancelDelete(): void {
    console.log('❌ [CitiesListComponent] Delete cancelled');
    this.showConfirmDialog = false;
    this.cityToDelete = null;
  }

  navigateToMenus(city: City): void {
    console.log('📋 [CitiesListComponent] Navigating to menus for city:', city.name);
    this.router.navigate(['/admin/cities/menus', city.id]);
  }

  getStatusName(status: Status): string {
    switch (status) {
      case Status.Active: return 'Aktif';
      case Status.Passive: return 'Pasif';
      case Status.Pending: return 'Beklemede';
      default: return 'Bilinmiyor';
    }
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.Active: return 'status-active';
      case Status.Passive: return 'status-passive';
      case Status.Pending: return 'status-pending';
      default: return 'status-unknown';
    }
  }

  getRegionName = getRegionName;

  trackByCityId(index: number, city: City): number {
    return city.id;
  }

  getActiveCount(): number {
    return this.cities.filter(city => city.status === Status.Active).length;
  }

  refreshData(): void {
    console.log('🔄 [CitiesListComponent] Refreshing data');
    this.loadCities();
  }
}