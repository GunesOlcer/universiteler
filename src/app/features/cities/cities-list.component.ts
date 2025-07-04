// src/app/features/cities/cities-list.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { City, RegionType, getRegionName } from '../../core/models/city.model';
import { Status } from '../../core/models/base.model';
import { CityService } from '../../core/services/city.service';
import { CountryService } from '../../core/services/country.service';
import { Country } from '../../core/models/country.model';

interface BreadcrumbItem {
  label: string;
  url?: string;
  active: boolean;
}

interface FilterState {
  searchTerm: string;
  activeCountry: 'all' | 'turkiye' | 'kktc';
  selectedRegions: RegionType[];
  selectedFeatures: string[];
  sorting: string;
}

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.scss']
})
export class CitiesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data
  cities: City[] = [];
  countries: Country[] = [];
  filteredCities: City[] = [];
  
  // Loading states
  isLoading = false;
  isSearching = false;
  
  // Filter state
  filterState: FilterState = {
    searchTerm: '',
    activeCountry: 'all',
    selectedRegions: [],
    selectedFeatures: [],
    sorting: 'name-asc'
  };
  
  // UI state
  showFilters = false;
  isMobile = false;
  breadcrumbPath: BreadcrumbItem[] = [];
  
  // Filter options
  regions = Object.values(RegionType).filter(value => typeof value === 'number') as RegionType[];
  features = [
    { key: 'hasAirport', label: 'Havalimanı' },
    { key: 'hasTrainStation', label: 'Tren İstasyonu' },
    { key: 'hasHighSpeedTrain', label: 'Hızlı Tren' }
  ];
  
  sortingOptions = [
    { value: 'name-asc', label: 'İsme Göre (A-Z)' },
    { value: 'name-desc', label: 'İsme Göre (Z-A)' },
    { value: 'population-desc', label: 'Nüfusa Göre (Azalan)' },
    { value: 'population-asc', label: 'Nüfusa Göre (Artan)' },
    { value: 'university-desc', label: 'Üniversite Sayısına Göre (Azalan)' },
    { value: 'university-asc', label: 'Üniversite Sayısına Göre (Artan)' }
  ];

  constructor(
    private cityService: CityService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.showFilters && this.isMobile) {
      this.closeFilters();
    }
  }

  ngOnInit(): void {
    console.log('🏁 [CitiesListComponent] Component initialized');
    this.checkScreenSize();
    this.setupBreadcrumb();
    this.setupSearch();
    this.loadInitialData();
    this.subscribeToQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.style.overflow = '';
  }

  private setupBreadcrumb(): void {
    // ✅ Path'i /sehirler olarak düzelt
    this.breadcrumbPath = [
      { label: 'Ana Sayfa', url: '/', active: false },
      { label: 'Şehirler', url: '/sehirler', active: true }
    ];
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filterState.searchTerm = searchTerm;
      this.applyFilters();
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    console.log('📊 [CitiesListComponent] Loading initial data');
    
    // Load countries and cities in parallel
    Promise.all([
      this.countryService.getAll().toPromise(),
      this.cityService.getAll().toPromise()
    ]).then(([countries, cities]) => {
      console.log('✅ [CitiesListComponent] Data loaded:', { 
        countries: countries?.length || 0, 
        cities: cities?.length || 0 
      });
      this.countries = countries || [];
      this.cities = (cities || []).filter(city => city.status === Status.Active);
      this.applyFilters();
      this.isLoading = false;
    }).catch(error => {
      console.error('❌ [CitiesListComponent] Error loading initial data:', error);
      this.isLoading = false;
      this.showError('Veri yüklenirken hata oluştu: ' + error.message);
    });
  }

  private subscribeToQueryParams(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      console.log('🔗 [CitiesListComponent] Query params changed:', params);
      // Update filter state from URL params
      this.filterState.searchTerm = params['search'] || '';
      this.filterState.activeCountry = params['country'] || 'all';
      this.filterState.selectedRegions = params['regions'] ? 
        params['regions'].split(',').map((r: string) => parseInt(r, 10)) : [];
      this.filterState.selectedFeatures = params['features'] ? 
        params['features'].split(',') : [];
      this.filterState.sorting = params['sorting'] || 'name-asc';
      
      if (this.cities.length > 0) {
        this.applyFilters();
      }
    });
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showFilters = true;
    }
  }

  // Filter methods
  onSearchInput(event: any): void {
    this.isSearching = true;
    this.searchSubject.next(event.target.value);
  }

  onCountryFilterChange(country: 'all' | 'turkiye' | 'kktc'): void {
    this.filterState.activeCountry = country;
    this.applyFilters();
  }

  onRegionChange(region: RegionType, checked: boolean): void {
    if (checked) {
      this.filterState.selectedRegions.push(region);
    } else {
      this.filterState.selectedRegions = this.filterState.selectedRegions.filter(r => r !== region);
    }
    this.applyFilters();
  }

  onFeatureChange(feature: string, checked: boolean): void {
    if (checked) {
      this.filterState.selectedFeatures.push(feature);
    } else {
      this.filterState.selectedFeatures = this.filterState.selectedFeatures.filter(f => f !== feature);
    }
    this.applyFilters();
  }

  onSortingChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    console.log('🔄 [CitiesListComponent] Resetting filters');
    this.filterState = {
      searchTerm: '',
      activeCountry: 'all',
      selectedRegions: [],
      selectedFeatures: [],
      sorting: 'name-asc'
    };
    this.applyFilters();
    this.updateUrlParams();
  }

  private applyFilters(): void {
    console.log('🔍 [CitiesListComponent] Applying filters:', this.filterState);
    let filtered = [...this.cities];
    
    // Apply country filter
    if (this.filterState.activeCountry !== 'all') {
      const targetCountry = this.filterState.activeCountry === 'turkiye' ? 'Türkiye' : 'KKTC';
      filtered = filtered.filter(city => city.countryName === targetCountry);
    }
    
    // Apply region filter
    if (this.filterState.selectedRegions.length > 0) {
      filtered = filtered.filter(city => 
        city.region && this.filterState.selectedRegions.includes(city.region)
      );
    }
    
    // Apply feature filter
    if (this.filterState.selectedFeatures.length > 0) {
      filtered = filtered.filter(city => {
        return this.filterState.selectedFeatures.every(feature => {
          switch (feature) {
            case 'hasAirport': return city.hasAirport;
            case 'hasTrainStation': return city.hasTrainStation;
            case 'hasHighSpeedTrain': return city.hasHighSpeedTrain;
            default: return false;
          }
        });
      });
    }
    
    // Apply search filter
    if (this.filterState.searchTerm.trim()) {
      const searchTerm = this.filterState.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(city => 
        city.name.toLowerCase().includes(searchTerm) ||
        city.countryName.toLowerCase().includes(searchTerm) ||
        (city.description && city.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    filtered = this.sortCities(filtered, this.filterState.sorting);
    
    this.filteredCities = filtered;
    this.isSearching = false;
    this.updateBreadcrumb();
    this.updateUrlParams();
    
    console.log('✅ [CitiesListComponent] Filters applied, results:', this.filteredCities.length);
  }

  private sortCities(cities: City[], sortType: string): City[] {
    const sorted = [...cities];
    
    switch (sortType) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
      case 'population-desc':
        return sorted.sort((a, b) => (b.population || 0) - (a.population || 0));
      case 'population-asc':
        return sorted.sort((a, b) => (a.population || 0) - (b.population || 0));
      case 'university-desc':
        return sorted.sort((a, b) => b.universityCount - a.universityCount);
      case 'university-asc':
        return sorted.sort((a, b) => a.universityCount - b.universityCount);
      default:
        return sorted;
    }
  }

  private updateBreadcrumb(): void {
    // ✅ Path'i /sehirler olarak düzelt
    this.breadcrumbPath = [
      { label: 'Ana Sayfa', url: '/', active: false },
      { label: 'Şehirler', url: '/sehirler', active: true }
    ];

    const activeFilters = [];
    
    if (this.filterState.activeCountry !== 'all') {
      const countryLabel = this.filterState.activeCountry === 'turkiye' ? 'Türkiye' : 'KKTC';
      activeFilters.push(countryLabel);
    }
    
    if (this.filterState.selectedRegions.length > 0) {
      activeFilters.push(`${this.filterState.selectedRegions.length} Bölge`);
    }
    
    if (this.filterState.selectedFeatures.length > 0) {
      activeFilters.push(`${this.filterState.selectedFeatures.length} Özellik`);
    }
    
    if (this.filterState.searchTerm) {
      activeFilters.push(`"${this.filterState.searchTerm}" araması`);
    }

    if (activeFilters.length > 0) {
      this.breadcrumbPath[1].active = false;
      this.breadcrumbPath.push({
        label: activeFilters.join(', '),
        active: true
      });
    }
  }

  private updateUrlParams(): void {
    const queryParams: any = {};
    
    if (this.filterState.searchTerm) {
      queryParams.search = this.filterState.searchTerm;
    }
    
    if (this.filterState.activeCountry !== 'all') {
      queryParams.country = this.filterState.activeCountry;
    }
    
    if (this.filterState.selectedRegions.length > 0) {
      queryParams.regions = this.filterState.selectedRegions.join(',');
    }
    
    if (this.filterState.selectedFeatures.length > 0) {
      queryParams.features = this.filterState.selectedFeatures.join(',');
    }
    
    if (this.filterState.sorting !== 'name-asc') {
      queryParams.sorting = this.filterState.sorting;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  // UI methods
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters && this.isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeFilters(): void {
    if (this.isMobile) {
      this.showFilters = false;
      document.body.style.overflow = '';
    }
  }

  applyMobileFilters(): void {
    if (this.isMobile) {
      this.closeFilters();
    }
  }

  // Helper methods
  getRegionName(region: RegionType): string {
    return getRegionName(region);
  }

  isRegionSelected(region: RegionType): boolean {
    return this.filterState.selectedRegions.includes(region);
  }

  isFeatureSelected(feature: string): boolean {
    return this.filterState.selectedFeatures.includes(feature);
  }

  trackByCity(index: number, city: City): number {
    return city.id;
  }

  private showError(message: string): void {
    console.error('❌ Error:', message);
    // TODO: Replace with proper toast notification service
    alert(message);
  }
}