import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { City, RegionType, getRegionName } from '../../../core/models/city.model';
import { CityMenu } from '../../../core/models/menu.model';
import { CityService } from '../../../core/services/city.service';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-city-detail',
  templateUrl: './city-detail.component.html',
  styleUrls: ['./city-detail.component.scss']
})
export class CityDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  city: City | undefined;
  cityMenus: CityMenu[] = [];
  activeMenu: CityMenu | undefined;
  activeMenuId: number | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    console.log('🏙️ [CityDetailComponent] Component initialized');
    
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id = params.get('id');
      console.log('🆔 [CityDetailComponent] City ID from route:', id);
      
      if (id && !isNaN(+id)) {
        this.loadCity(parseInt(id, 10));
      } else {
        console.error('❌ [CityDetailComponent] Invalid city ID:', id);
        this.error = 'Geçersiz şehir ID\'si';
        this.router.navigate(['/sehirler']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCity(id: number): void {
    this.isLoading = true;
    this.error = null;
    
    console.log('🔄 [CityDetailComponent] Loading city with ID:', id);
    
    this.cityService.getById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (city) => {
        console.log('✅ [CityDetailComponent] City loaded:', city);
        this.city = city;
        this.updatePageMetadata();
        this.loadCityMenus(id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [CityDetailComponent] Error loading city:', error);
        this.error = error.message || 'Şehir yüklenirken bir hata oluştu';
        this.isLoading = false;
        
        // If city not found, redirect to cities list
        if (error.status === 404) {
          setTimeout(() => {
            this.router.navigate(['/sehirler']);
          }, 2000);
        }
      }
    });
  }

  private loadCityMenus(cityId: number): void {
    console.log('📋 [CityDetailComponent] Loading city menus for ID:', cityId);
    
    this.menuService.getCityMenus(cityId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (menus) => {
        console.log('✅ [CityDetailComponent] City menus loaded:', menus.length);
        // Filter visible menus and sort by order
        this.cityMenus = menus
          .filter(menu => menu.isVisible)
          .sort((a, b) => a.order - b.order);
        
        // Select first menu by default
        if (this.cityMenus.length > 0) {
          this.selectMenu(this.cityMenus[0].id);
        }
      },
      error: (error) => {
        console.error('❌ [CityDetailComponent] Error loading city menus:', error);
        // Don't show error for menus, just log it
        this.cityMenus = [];
      }
    });
  }

  private updatePageMetadata(): void {
    if (this.city) {
      document.title = `${this.city.name} | Üniversiteler.net`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${this.city.name} hakkında detaylı bilgi. ${this.city.universityCount} üniversite, ${this.city.studentPopulation || 0} öğrenci. ${this.city.description || ''}`
        );
      }
    }
  }

  onMenuSelect(menuId: number): void {
    console.log('📄 [CityDetailComponent] Menu selected:', menuId);
    this.selectMenu(menuId);
  }

  private selectMenu(menuId: number): void {
    this.activeMenuId = menuId;
    this.activeMenu = this.cityMenus.find(menu => menu.id === menuId);
    
    // Smooth scroll to top of content
    const contentElement = document.querySelector('.main-content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ✅ Missing getRegionName method
  getRegionName(region: RegionType): string {
    return getRegionName(region);
  }
}