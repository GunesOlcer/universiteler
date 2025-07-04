// src/app/features/departments/department-detail/sidebar/sidebar.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Department } from '../../../../core/models/department.model';
import { DepartmentService } from '../../../../core/services/department.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() department: Department | null = null;
  @Input() activeSection: string = 'genel-bilgi';
  @Output() sectionChange = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    {
      id: 'genel-bilgi',
      title: 'Genel Bilgi',
      icon: 'fas fa-info-circle',
      description: 'Bölüm hakkında temel bilgiler'
    },
    {
      id: 'icerik-mufredat',
      title: 'İçerik ve Müfredat',
      icon: 'fas fa-book',
      description: 'Ders programı ve müfredat'
    },
    {
      id: 'kim-icin-uygun',
      title: 'Kim İçin Uygun?',
      icon: 'fas fa-user-check',
      description: 'Uygun öğrenci profili'
    },
    {
      id: 'kim-icin-uygun-degil',
      title: 'Kim İçin Uygun Değil?',
      icon: 'fas fa-user-times',
      description: 'Uygun olmayan profiller'
    },
    {
      id: 'gerekli-beceriler',
      title: 'Gerekli Beceriler',
      icon: 'fas fa-cogs',
      description: 'Başarı için gerekli yetenekler'
    },
    {
      id: 'tavsiyeler',
      title: 'Tavsiyeler',
      icon: 'fas fa-lightbulb',
      description: 'Uzman tavsiyeleri'
    },
    {
      id: 'calisma-hayati',
      title: 'Çalışma Hayatı',
      icon: 'fas fa-briefcase',
      description: 'Kariyer ve iş imkanları'
    }
  ];

  departmentMenus: any[] = [];
  isLoadingMenus = false;
  
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

  selectSection(sectionId: string): void {
    this.sectionChange.emit(sectionId);
  }

  private loadDepartmentMenus(): void {
    if (!this.department) return;

    this.isLoadingMenus = true;
    this.departmentService.getDepartmentMenus(this.department.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menus) => {
          this.departmentMenus = menus.filter(menu => menu.isVisible && menu.status === 1);
          this.isLoadingMenus = false;
        },
        error: (error) => {
          console.error('Error loading department menus:', error);
          this.isLoadingMenus = false;
        }
      });
  }

  isActive(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }
}