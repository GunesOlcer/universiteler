import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dormitory, DormitoryType, GenderType } from '../../core/models/dormitory.model';
import { DormitoryService } from '../../core/services/dormitory.service';

@Component({
  selector: 'app-dormitories-list',
  templateUrl: './dormitories-list.component.html',
  styleUrls: ['./dormitories-list.component.scss']
})
export class DormitoriesListComponent implements OnInit {
  dormitories: Dormitory[] = [];
  filteredDormitories: Dormitory[] = [];
  isLoading = false;
  searchTerm = '';
  activeTypeFilter: DormitoryType | null = null;
  activeGenderFilter: GenderType | null = null;
  pageTitle = 'Yurtlar';

  // Enum references for template
  dormitoryTypes = DormitoryType;
  genderTypes = GenderType;

  constructor(
    private dormitoryService: DormitoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['type']) {
        this.activeTypeFilter = parseInt(params['type']) as DormitoryType;
      }
      if (params['gender']) {
        this.activeGenderFilter = parseInt(params['gender']) as GenderType;
      }
      this.updatePageTitle();
      this.loadDormitories();
    });
  }

  loadDormitories(): void {
    this.isLoading = true;
    this.dormitoryService.getAll()
      .subscribe({
        next: (data) => {
          this.dormitories = data;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dormitories', error);
          this.isLoading = false;
        }
      });
  }

  applyTypeFilter(filter: DormitoryType | null): void {
    this.activeTypeFilter = filter;
    this.updateUrlParams();
    this.updatePageTitle();
    this.applyFilters();
  }

  applyGenderFilter(filter: GenderType | null): void {
    this.activeGenderFilter = filter;
    this.updateUrlParams();
    this.updatePageTitle();
    this.applyFilters();
  }

  onSearch(): void {
    this.updateUrlParams();
    this.applyFilters();
  }

  private updateUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm || null,
        type: this.activeTypeFilter || null,
        gender: this.activeGenderFilter || null
      },
      queryParamsHandling: 'merge'
    });
  }

  private updatePageTitle(): void {
    let typeLabel = '';
    let genderLabel = '';

    if (this.activeTypeFilter !== null) {
      switch (this.activeTypeFilter) {
        case DormitoryType.State:
          typeLabel = 'Devlet Yurtları';
          break;
        case DormitoryType.Private:
          typeLabel = 'Özel Yurtlar';
          break;
        case DormitoryType.University:
          typeLabel = 'Üniversite Yurtları';
          break;
      }
    }

    if (this.activeGenderFilter !== null) {
      switch (this.activeGenderFilter) {
        case GenderType.Male:
          genderLabel = 'Erkek';
          break;
        case GenderType.Female:
          genderLabel = 'Kız';
          break;
        case GenderType.Mixed:
          genderLabel = 'Karma';
          break;
      }
    }

    if (this.activeTypeFilter === null && this.activeGenderFilter === null) {
      this.pageTitle = 'Yurtlar';
    } else if (this.activeTypeFilter !== null && this.activeGenderFilter === null) {
      this.pageTitle = typeLabel;
    } else if (this.activeTypeFilter === null && this.activeGenderFilter !== null) {
      this.pageTitle = genderLabel + ' Yurtlar';
    } else {
      this.pageTitle = genderLabel + ' ' + typeLabel;
    }
  }

  private applyFilters(): void {
    let filtered = [...this.dormitories];

    if (this.activeTypeFilter !== null) {
      filtered = filtered.filter(d => d.type === this.activeTypeFilter);
    }

    if (this.activeGenderFilter !== null) {
      filtered = filtered.filter(d => d.gender === this.activeGenderFilter);
    }

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(search) || 
        d.cityName.toLowerCase().includes(search) ||
        d.countryName.toLowerCase().includes(search) ||
        (d.description && d.description.toLowerCase().includes(search))
      );
    }

    this.filteredDormitories = filtered;
  }

  resetFilters(): void {
    this.activeTypeFilter = null;
    this.activeGenderFilter = null;
    this.searchTerm = '';
    this.updateUrlParams();
    this.updatePageTitle();
    this.applyFilters();
  }
}