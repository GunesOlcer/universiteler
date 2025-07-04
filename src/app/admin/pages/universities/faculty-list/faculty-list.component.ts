// faculty-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../../../services/faculty.service';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.component.html',
  styleUrls: ['./faculty-list.component.scss']
})
export class FacultyListComponent implements OnInit {
  faculties: any[] = [];
  universities: any[] = [];
  selectedUniversity: any = null;
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    name: '',
    status: '',
    universityId: '',
    type: ''
  };
  
  filterPanelOpen = true; // Controls filter panel visibility
  
  showConfirmDialog = false;
  facultyToDelete: any = null;
  
  // For use in template
  Math = Math;

  constructor(
    private facultyService: FacultyService,
    private universityService: UniversityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for query parameters
    this.route.queryParams.subscribe(params => {
      if (params.universityId) {
        this.filters.universityId = params.universityId;
        // Load university details to display in the UI
        this.loadSelectedUniversity(params.universityId);
      }
      
      this.loadUniversities();
      this.loadFaculties();
    });
  }

  loadSelectedUniversity(universityId: string): void {
    this.universityService.getUniversity(+universityId).subscribe(
      (data: any) => {
        this.selectedUniversity = data;
      },
      (error) => {
        console.error('Error loading university:', error);
      }
    );
  }

  loadUniversities(): void {
    this.universityService.getUniversities().subscribe(
      (data: any) => {
        this.universities = data.items;
      },
      (error) => {
        console.error('Error loading universities:', error);
      }
    );
  }

  loadFaculties(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.facultyService.getFaculties(params).subscribe(
      (data: any) => {
        this.faculties = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading faculties:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.faculties.filter(f => f.isActive).length;
  }

  getFacultyType(type: string): string {
    const types = {
      'faculty': 'Fakülte',
      'school': 'Yüksekokul',
      'institute': 'Enstitü'
    };
    return types[type] || type;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadFaculties();
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      status: '',
      universityId: '',
      type: ''
    };
    this.selectedUniversity = null;
    this.currentPage = 1;
    this.loadFaculties();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFaculties();
  }

  confirmDelete(faculty: any): void {
    this.facultyToDelete = faculty;
    this.showConfirmDialog = true;
  }

  deleteFaculty(): void {
    if (this.facultyToDelete) {
      this.facultyService.deleteFaculty(this.facultyToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.faculties = this.faculties.filter(f => f.id !== this.facultyToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.facultyToDelete = null;
          
          // Eğer geçerli sayfa boşsa, önceki sayfaya dön
          if (this.faculties.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadFaculties();
          }
        },
        (error) => {
          console.error('Error deleting faculty:', error);
          this.showConfirmDialog = false;
          this.facultyToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.facultyToDelete = null;
  }
  
  // New method to navigate to faculty programs
  navigateToPrograms(faculty: any): void {
    // Doğru rotaya yönlendir
    this.router.navigate(['/admin/programs'], {
      queryParams: { facultyId: faculty.id, facultyName: faculty.name }
    });
  }
}