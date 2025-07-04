// university-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityService } from '../../../services/university.service';
import { CountryService } from '../../../services/country.service';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-university-list',
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.scss']
})
export class UniversityListComponent implements OnInit {
  universities: any[] = [];
  countries: any[] = [];
  cities: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    name: '',
    status: '',
    country: '',
    city: ''
  };
  
  filterPanelOpen = true; // Controls filter panel visibility
  
  showConfirmDialog = false;
  universityToDelete: any = null;
  
  // For use in template
  Math = Math;

  constructor(
    private universityService: UniversityService,
    private countryService: CountryService,
    private cityService: CityService,
    private router: Router // Added router for navigation
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.loadCities();
    this.loadUniversities();
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe(
      (data: any) => {
        this.countries = data;
      },
      (error) => {
        console.error('Error loading countries:', error);
      }
    );
  }

  loadCities(): void {
    this.cityService.getCities().subscribe(
      (data: any) => {
        this.cities = data;
      },
      (error) => {
        console.error('Error loading cities:', error);
      }
    );
  }

  loadUniversities(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.universityService.getUniversities(params).subscribe(
      (data: any) => {
        this.universities = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading universities:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.universities.filter(u => u.isActive).length;
  }

  getUniversityType(type: string): string {
    const types = {
      'state': 'Devlet',
      'foundation': 'Vakıf',
      'private': 'Özel',
      'kktc': 'KKTC',
      'foreign_public': 'Yurtdışı Kamu',
      'foreign_foundation': 'Yurtdışı Vakıf',
      'foundation_myo': 'Vakıf MYO'
    };
    return types[type] || type;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadUniversities();
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      status: '',
      country: '',
      city: ''
    };
    this.currentPage = 1;
    this.loadUniversities();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUniversities();
  }

  confirmDelete(university: any): void {
    this.universityToDelete = university;
    this.showConfirmDialog = true;
  }

  deleteUniversity(): void {
    if (this.universityToDelete) {
      this.universityService.deleteUniversity(this.universityToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.universities = this.universities.filter(u => u.id !== this.universityToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.universityToDelete = null;
          
          // Eğer geçerli sayfa boşsa, önceki sayfaya dön
          if (this.universities.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadUniversities();
          }
        },
        (error) => {
          console.error('Error deleting university:', error);
          this.showConfirmDialog = false;
          this.universityToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.universityToDelete = null;
  }

  // New methods for the added buttons
  navigateToFaculties(university: any): void {
    // Navigate to faculties page with university filter
    this.router.navigate(['/admin/faculties'], { 
      queryParams: { universityId: university.id }
    });
  }

  navigateToMenus(university: any): void {
    // Navigate to university menus page
    this.router.navigate(['/admin/universities/menus', university.id]);
  }
}