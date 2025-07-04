import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversityService } from '../../core/services/university.service';
import { University, UniversityFilterRequest, UniversityType, Status } from '../../core/models/university.model';

@Component({
  selector: 'app-universities-list',
  templateUrl: './universities-list.component.html',
  styleUrls: ['./universities-list.component.scss']
})
export class UniversitiesListComponent implements OnInit {
  universities: University[] = [];
  filteredUniversities: University[] = [];
  isLoading = false;
  searchTerm = '';
  activeFilter: 'all' | 'turkiye' | 'kktc' = 'all';
  selectedType?: UniversityType;
  selectedCityId?: number;
  sortValue: string = '';
  
  isMobile: boolean = false;
  showFilters: boolean = false;
  breadcrumbPath: {label: string, url: string, active: boolean}[] = [];
  
  currentPage = 1;
  pageSize = 12;
  totalCount = 0;
  totalPages = 0;

  universityTypes = ['all', 'state', 'foundation', 'private', 'kktc'];
  regions = ['marmara', 'ege', 'akdeniz', 'ic_anadolu', 'karadeniz', 'dogu_anadolu', 'guneydogu_anadolu'];
  cities: string[] = [];
  options = ['research', 'erasmus'];
  
  selectedTypes: string[] = [];
  selectedRegions: string[] = [];
  selectedCities: string[] = [];
  selectedOptions: string[] = [];

  constructor(
    private universityService: UniversityService,
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
    this.checkScreenSize();
    this.initializeBreadcrumb();
    this.loadQueryParams();
    this.loadUniversities();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showFilters = true;
    }
  }

  initializeBreadcrumb(): void {
    this.breadcrumbPath = [
      {label: 'Ana Sayfa', url: '/', active: false},
      {label: 'Üniversiteler', url: '/universiteler', active: true}
    ];
  }

  loadQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['type']) {
        this.selectedType = parseInt(params['type']);
      }
      if (params['cityId']) {
        this.selectedCityId = parseInt(params['cityId']);
      }
      if (params['sort']) {
        this.sortValue = params['sort'];
      }
      this.loadUniversities();
    });
  }

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

  loadUniversities(): void {
    this.isLoading = true;
    
    let filterType: UniversityType | undefined;
    if (this.activeFilter === 'kktc') {
      filterType = UniversityType.KKTC;
    } else if (this.selectedType) {
      filterType = this.selectedType;
    }

    const filterRequest: UniversityFilterRequest = {
      pagination: {
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      },
      searchTerm: this.searchTerm || undefined,
      type: filterType,
      cityId: this.selectedCityId,
      status: Status.Active
    };

    this.universityService.filter(filterRequest).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.universities = response.data.data;
          this.totalCount = response.data.totalItems;
          this.totalPages = response.data.totalPages;
          this.filteredUniversities = [...this.universities];
          this.applySorting();
        } else {
          this.universities = [];
          this.filteredUniversities = [];
          this.totalCount = 0;
          this.totalPages = 0;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading universities:', error);
        this.universities = [];
        this.filteredUniversities = [];
        this.totalCount = 0;
        this.totalPages = 0;
        this.isLoading = false;
      }
    });
  }

  applyFilter(filter: 'all' | 'turkiye' | 'kktc'): void {
    this.activeFilter = filter;
    this.selectedType = undefined;
    this.selectedCityId = undefined;
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadUniversities();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateUrlParams();
    this.loadUniversities();
    if (this.isMobile) {
      this.closeFilters();
    }
  }

  onSortChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.sortValue = selectedValue;
    this.applySorting();
    this.updateUrlParams();
  }

  applySorting(): void {
    if (!this.sortValue) return;
    
    if (this.sortValue === 'asc') {
      this.filteredUniversities.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (this.sortValue === 'desc') {
      this.filteredUniversities.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.selectedType = undefined;
    this.selectedCityId = undefined;
    this.sortValue = '';
    this.currentPage = 1;
    this.selectedTypes = [];
    this.selectedRegions = [];
    this.selectedCities = [];
    this.selectedOptions = [];
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
    this.loadUniversities();
    
    if (this.isMobile) {
      this.closeFilters();
    }
  }

  applyMobileFilters(): void {
    this.onSearch();
  }

  toggleTypeFilter(type: string): void {
    const index = this.selectedTypes.indexOf(type);
    if (index === -1) {
      this.selectedTypes.push(type);
    } else {
      this.selectedTypes.splice(index, 1);
    }
  }

  toggleRegionFilter(region: string): void {
    const index = this.selectedRegions.indexOf(region);
    if (index === -1) {
      this.selectedRegions.push(region);
    } else {
      this.selectedRegions.splice(index, 1);
    }
    this.updateCitiesForRegions();
  }

  toggleCityFilter(city: string): void {
    const index = this.selectedCities.indexOf(city);
    if (index === -1) {
      this.selectedCities.push(city);
    } else {
      this.selectedCities.splice(index, 1);
    }
  }

  toggleOptionFilter(option: string): void {
    const index = this.selectedOptions.indexOf(option);
    if (index === -1) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions.splice(index, 1);
    }
  }

  private updateCitiesForRegions(): void {
    this.cities = ['istanbul', 'ankara', 'izmir', 'antalya', 'bursa'];
  }

  private updateUrlParams(): void {
    const queryParams: any = {};
    
    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }
    if (this.selectedType) {
      queryParams.type = this.selectedType;
    }
    if (this.selectedCityId) {
      queryParams.cityId = this.selectedCityId;
    }
    if (this.sortValue) {
      queryParams.sort = this.sortValue;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUniversities();
  }
}