// src/app/features/departments/department-detail/content/kim-icin-uygun-degil/kim-icin-uygun-degil.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Department, DepartmentMenu } from '../../../../../core/models/department.model';
import { DepartmentService } from '../../../../../core/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-kim-icin-uygun-degil',
  templateUrl: './kim-icin-uygun-degil.component.html',
  styleUrls: ['./kim-icin-uygun-degil.component.scss']
})
export class KimIcinUygunDegilComponent implements OnInit, OnDestroy {
  @Input() department: Department | null = null;
  
  departmentMenus: DepartmentMenu[] = [];
  isLoading = false;
  error: string | null = null;
  unsuitabilityContent: DepartmentMenu | null = null;

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
            (menu.title.toLowerCase().includes('uygun değil') || 
             menu.title.toLowerCase().includes('not suitable') ||
             menu.title.toLowerCase().includes('unsuitable'))
          );
          
          this.unsuitabilityContent = this.departmentMenus.find(menu => 
            menu.title.toLowerCase().includes('kim için uygun değil') ||
            menu.title.toLowerCase().includes('not suitable for')
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