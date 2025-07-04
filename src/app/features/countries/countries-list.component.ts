// src/app/features/countries/countries-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Country, CountryFilterParams } from '../../core/models/country.model';
import { Status } from '../../core/models/base.model';
import { CountryService } from '../../core/services/country.service';

interface BreadcrumbItem {
  label: string;
  url?: string;
  active: boolean;
}

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  totalItems = 0;
  
  // Loading states
  isLoading = false;
  
  // Filter state
  searchTerm = '';
  sorting = 'name-asc';
  
  // UI state
  breadcrumbPath: BreadcrumbItem[] = [];
  
  sortingOptions = [
    { value: 'name-asc', label: 'İsme Göre (A-Z)' },
    { value: 'name-desc', label: 'İsme Göre (Z-A)' },
    { value: 'code-asc', label: 'Koda Göre (A-Z)' },
    { value: 'code-desc', label: 'Koda Göre (Z-A)' }
  ];

  constructor(
    private countryService: CountryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🏁 [CountriesListComponent] Component initialized');
    this.setupBreadcrumb();
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbPath = [
      { label: 'Ana Sayfa', url: '/', active: false },
      { label: 'Ülkeler', url: '/ulkeler', active: true }
    ];
  }

  private loadCountries(): void {
    this.isLoading = true;
    console.log('📊 [CountriesListComponent] Loading countries');
    
    // Admin panelden sadece aktif ülkeleri getir
    const params: CountryFilterParams = {
      status: Status.Active,
      pageNumber: 1,
      pageSize: 999 // Tüm aktif ülkeleri getir
    };

    this.countryService.getAllPaginated(params).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('✅ [CountriesListComponent] Countries loaded:', response.data.length);
        this.countries = response.data;
        this.totalItems = response.totalItems;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [CountriesListComponent] Error loading countries:', error);
        this.isLoading = false;
        this.showError('Ülkeler yüklenirken hata oluştu');
      }
    });
  }

  onSearchInput(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onSortingChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    console.log('🔄 [CountriesListComponent] Resetting filters');
    this.searchTerm = '';
    this.sorting = 'name-asc';
    this.applyFilters();
  }

  private applyFilters(): void {
    console.log('🔍 [CountriesListComponent] Applying filters');
    let filtered = [...this.countries];
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(country => 
        country.name.toLowerCase().includes(searchTermLower) ||
        country.code.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply sorting
    filtered = this.sortCountries(filtered, this.sorting);
    
    this.filteredCountries = filtered;
    
    console.log('✅ [CountriesListComponent] Filters applied, results:', this.filteredCountries.length);
  }

  private sortCountries(countries: Country[], sortType: string): Country[] {
    const sorted = [...countries];
    
    switch (sortType) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
      case 'code-asc':
        return sorted.sort((a, b) => a.code.localeCompare(b.code));
      case 'code-desc':
        return sorted.sort((a, b) => b.code.localeCompare(a.code));
      default:
        return sorted;
    }
  }

  navigateToCountry(country: Country): void {
    this.router.navigate(['/ulkeler', country.id]);
  }

  trackByCountry(index: number, country: Country): number {
    return country.id;
  }

  private showError(message: string): void {
    console.error('❌ Error:', message);
    // TODO: Toast notification service kullan
    alert(message);
  }
}