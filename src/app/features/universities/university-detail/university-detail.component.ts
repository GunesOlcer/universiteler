import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { University, UniversityType } from '../../../core/models/university.model';
import { UniversityService } from '../../../core/services/university.service';
import { MenuService } from '../../../core/services/menu.service';
import { UniversityMenu } from '../../../core/models/menu.model';

@Component({
  selector: 'app-university-detail',
  templateUrl: './university-detail.component.html',
  styleUrls: ['./university-detail.component.scss']
})
export class UniversityDetailComponent implements OnInit {
  university: University | undefined;
  universityMenus: UniversityMenu[] = [];
  isLoading = false;
  activeSection = 'genel-bilgi';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private universityService: UniversityService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loadUniversity();
  }

  loadUniversity(): void {
    this.isLoading = true;
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    
    if (id === 0) {
      this.isLoading = false;
      return;
    }

    this.universityService.getById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.university = response.data;
          this.loadUniversityMenus(id);
        } else {
          console.error('University not found:', response.message);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading university:', error);
        this.isLoading = false;
      }
    });
  }

  loadUniversityMenus(universityId: number): void {
    this.menuService.getUniversityMenus(universityId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.universityMenus = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading university menus:', error);
      }
    });
  }

  onSectionChange(sectionId: string): void {
    this.activeSection = sectionId;
  }

  getLogoUrl(): string {
    return this.university?.logoPath || 'assets/images/universities/default-logo.png';
  }

  getTypeLabel(): string {
    if (!this.university) return '';
    
    switch(this.university.type) {
      case UniversityType.State: return 'Devlet';
      case UniversityType.Foundation: return 'Vakıf';
      case UniversityType.Private: return 'Özel';
      case UniversityType.KKTC: return 'KKTC';
      default: return this.university.typeName || 'Diğer';
    }
  }

  getTypeCssClass(): string {
    if (!this.university) return '';
    
    switch(this.university.type) {
      case UniversityType.State: return 'state';
      case UniversityType.Foundation: return 'foundation';
      case UniversityType.Private: return 'private';
      case UniversityType.KKTC: return 'kktc';
      default: return 'other';
    }
  }

  getMenuContent(sectionId: string): UniversityMenu | undefined {
    if (sectionId.startsWith('custom-')) {
      const menuId = parseInt(sectionId.replace('custom-', ''));
      return this.universityMenus.find(menu => menu.id === menuId);
    }
    return undefined;
  }
}