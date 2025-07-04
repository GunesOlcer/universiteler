// UPDATED: src/app/features/departments/department-detail/content/icerik-mufredat/icerik-mufredat.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Department, DepartmentMenu } from '../../../../../core/models/department.model';
import { DepartmentService } from '../../../../../core/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-icerik-mufredat',
  templateUrl: './icerik-mufredat.component.html',
  styleUrls: ['./icerik-mufredat.component.scss']
})
export class IcerikMufredatComponent implements OnInit, OnDestroy {
  @Input() department: Department | null = null;
  
  departmentMenus: DepartmentMenu[] = [];
  isLoading = false;
  error: string | null = null;
  curriculumContent: DepartmentMenu | null = null;

  private destroy$ = new Subject<void>();

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    if (this.department) {
      this.loadDepartmentMenus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDepartmentMenus(): void {
    if (!this.department) return;

    this.isLoading = true;
    this.error = null;

    this.departmentService.getDepartmentMenus(this.department.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menus) => {
          this.departmentMenus = menus.filter(menu => 
            menu.isVisible && 
            menu.status === 1 &&
            (menu.title.toLowerCase().includes('müfredat') || 
             menu.title.toLowerCase().includes('curriculum') ||
             menu.title.toLowerCase().includes('ders') ||
             menu.title.toLowerCase().includes('course') ||
             menu.title.toLowerCase().includes('içerik'))
          );
          
          this.curriculumContent = this.departmentMenus.find(menu => 
            menu.title.toLowerCase().includes('müfredat') ||
            menu.title.toLowerCase().includes('curriculum')
          ) || null;
          
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message || 'İçerik yüklenirken bir hata oluştu';
          this.isLoading = false;
          console.error('Error loading department menus:', error);
        }
      });
  }

  retry(): void {
    this.loadDepartmentMenus();
  }

  formatContent(content: string): string {
    if (!content) return '';
    
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/, '<p>$1</p>');
  }
}