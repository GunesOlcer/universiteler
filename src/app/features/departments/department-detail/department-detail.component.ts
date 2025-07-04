// src/app/features/departments/department-detail/department-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Department } from '../../../core/models/department.model';
import { DepartmentService } from '../../../core/services/department.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.scss']
})
export class DepartmentDetailComponent implements OnInit, OnDestroy {
  department: Department | null = null;
  isLoading = false;
  error: string | null = null;
  activeSection = 'genel-bilgi';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id || isNaN(id)) {
          throw new Error('Geçersiz bölüm ID\'si');
        }
        return this.loadDepartment(id);
      })
    ).subscribe({
      next: (department) => {
        this.department = department;
        this.updateMetaTags();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message || 'Bölüm yüklenirken bir hata oluştu';
        this.isLoading = false;
        console.error('Error loading department:', error);
      }
    });

    // Handle fragment for direct section linking
    this.route.fragment.pipe(takeUntil(this.destroy$)).subscribe(fragment => {
      if (fragment && this.isValidSection(fragment)) {
        this.activeSection = fragment;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDepartment(id: number) {
    this.isLoading = true;
    this.error = null;
    return this.departmentService.getDepartmentById(id);
  }

  private updateMetaTags(): void {
    if (!this.department) return;

    const title = `${this.department.name} - ${this.department.facultyName} | Bölüm Detayları`;
    const description = this.department.description 
      ? this.department.description.slice(0, 160) + '...'
      : `${this.department.name} bölümü hakkında detaylı bilgi. ${this.department.facultyName}, ${this.department.universityName}`;

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });
    
    if (this.department.imagePath) {
      const imageUrl = this.departmentService.getDepartmentImageUrl(this.department.imagePath);
      this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    }
  }

  onSectionChange(sectionId: string): void {
    if (this.isValidSection(sectionId)) {
      this.activeSection = sectionId;
      // Update URL fragment without navigating
      this.router.navigate([], {
        fragment: sectionId,
        relativeTo: this.route,
        replaceUrl: true
      });
    }
  }

  private isValidSection(section: string): boolean {
    const validSections = [
      'genel-bilgi',
      'icerik-mufredat',
      'kim-icin-uygun',
      'kim-icin-uygun-degil',
      'gerekli-beceriler',
      'tavsiyeler',
      'calisma-hayati'
    ];
    return validSections.includes(section);
  }

  getDepartmentImageUrl(): string {
    return this.departmentService.getDepartmentImageUrl(this.department?.imagePath);
  }

  formatSalary(salary?: number): string {
    if (!salary) return '';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(salary);
  }

  retry(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadDepartment(id).subscribe({
        next: (department) => {
          this.department = department;
          this.updateMetaTags();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message || 'Bölüm yüklenirken bir hata oluştu';
          this.isLoading = false;
        }
      });
    }
  }
}