// src/app/admin/pages/universities/program-list/program-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';
import { FacultyService } from '../../../services/faculty.service';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit {
  programs: any[] = [];
  faculties: any[] = [];
  selectedFaculty: any = null;
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    name: '',
    status: '',
    facultyId: '',
    language: ''
  };
  
  filterPanelOpen = true; // Controls filter panel visibility
  
  showConfirmDialog = false;
  programToDelete: any = null;
  
  // For use in template
  Math = Math;

  constructor(
    private programService: ProgramService,
    private facultyService: FacultyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for query parameters
    this.route.params.subscribe(params => {
      if (params.facultyId) {
        this.filters.facultyId = params.facultyId;
        // Load faculty details to display in the UI
        this.loadSelectedFaculty(params.facultyId);
      }
      
      this.loadFaculties();
      this.loadPrograms();
    });
  }

  loadSelectedFaculty(facultyId: string): void {
    this.facultyService.getFaculty(+facultyId).subscribe(
      (data: any) => {
        this.selectedFaculty = data;
      },
      (error) => {
        console.error('Error loading faculty:', error);
      }
    );
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe(
      (data: any) => {
        this.faculties = data.items;
      },
      (error) => {
        console.error('Error loading faculties:', error);
      }
    );
  }

  loadPrograms(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.programService.getPrograms(params).subscribe(
      (data: any) => {
        this.programs = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading programs:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.programs.filter(p => p.isActive).length;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadPrograms();
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      status: '',
      facultyId: '',
      language: ''
    };
    this.selectedFaculty = null;
    this.currentPage = 1;
    this.loadPrograms();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPrograms();
  }

  confirmDelete(program: any): void {
    this.programToDelete = program;
    this.showConfirmDialog = true;
  }

  deleteProgram(): void {
    if (this.programToDelete) {
      this.programService.deleteProgram(this.programToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.programs = this.programs.filter(p => p.id !== this.programToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.programToDelete = null;
          
          // Eğer geçerli sayfa boşsa, önceki sayfaya dön
          if (this.programs.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadPrograms();
          }
        },
        (error) => {
          console.error('Error deleting program:', error);
          this.showConfirmDialog = false;
          this.programToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.programToDelete = null;
  }

  navigateToMenus(program: any): void {
    this.router.navigate(['/admin/programs/menus', program.id]);
  }

  navigateToQuotas(program: any): void {
    this.router.navigate(['/admin/programs/quotas', program.id]);
  }

  navigateToRankings(program: any): void {
    this.router.navigate(['/admin/programs/rankings', program.id]);
  }

  // Helper function to format currency
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  }
}