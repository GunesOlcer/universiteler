// city-menu.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CityService } from '../../../../core/services/city.service';
import { MenuService } from '../../../../core/services/menu.service';
import { AuthService } from '../../../../core/services/auth.service';
import { City } from '../../../../core/models/city.model';
import { CityMenu } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-city-menu',
  templateUrl: './city-menu.component.html',
  styleUrls: ['./city-menu.component.scss']
})
export class CityMenuComponent implements OnInit, OnDestroy {
  cityId: number = 0;
  city: City | null = null;
  menuItems: CityMenu[] = [];
  loading = false;
  showConfirmDialog = false;
  menuItemToDelete: CityMenu | null = null;
  error = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private menuService: MenuService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('📋 [CityMenuComponent] Initializing city menu component');
    
    // Check authentication
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('❌ [CityMenuComponent] User not authenticated, redirecting to login');
          this.router.navigate(['/admin/login']);
          return;
        }
        
        // Get city ID from route and load data
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.cityId = +id;
          console.log('🆔 [CityMenuComponent] City ID from route:', this.cityId);
          this.loadCity();
          this.loadCityMenus();
        } else {
          console.error('❌ [CityMenuComponent] No city ID found in route');
          this.router.navigate(['/admin/cities']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCity(): void {
    console.log('🏙️ [CityMenuComponent] Loading city with ID:', this.cityId);
    
    this.cityService.getById(this.cityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (city) => {
          console.log('✅ [CityMenuComponent] City loaded:', city);
          this.city = city;
        },
        error: (error) => {
          console.error('❌ [CityMenuComponent] Error loading city:', error);
          this.error = 'Şehir bilgileri yüklenirken hata oluştu: ' + error.message;
          this.router.navigate(['/admin/cities']);
        }
      });
  }

  loadCityMenus(): void {
    console.log('📋 [CityMenuComponent] Loading city menus for cityId:', this.cityId);
    
    this.loading = true;
    this.error = '';
    
    this.menuService.getCityMenus(this.cityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menus) => {
          console.log('✅ [CityMenuComponent] City menus loaded:', menus);
          this.menuItems = menus.sort((a, b) => a.order - b.order);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ [CityMenuComponent] Error loading city menus:', error);
          this.error = 'Menüler yüklenirken hata oluştu: ' + error.message;
          this.menuItems = [];
          this.loading = false;
          
          // If unauthorized, redirect to login
          if (error.message.includes('Yetkisiz') || error.message.includes('401')) {
            console.log('🔐 [CityMenuComponent] Unauthorized error, checking auth status');
            this.authService.logout().subscribe();
          }
        }
      });
  }

  addMenuItem(): void {
    console.log('➕ [CityMenuComponent] Adding new menu item for cityId:', this.cityId);
    this.router.navigate(['/admin/cities/menus/add', this.cityId]);
  }

  editMenuItem(menuItem: CityMenu): void {
    console.log('✏️ [CityMenuComponent] Editing menu item:', menuItem.id, menuItem.title);
    this.router.navigate(['/admin/cities/menus/edit', this.cityId, menuItem.id]);
  }

  confirmDeleteMenuItem(menuItem: CityMenu): void {
    console.log('🗑️ [CityMenuComponent] Confirm delete menu item:', menuItem.title);
    this.menuItemToDelete = menuItem;
    this.showConfirmDialog = true;
  }

  deleteMenuItem(): void {
    if (!this.menuItemToDelete) {
      console.warn('⚠️ [CityMenuComponent] No menu item selected for deletion');
      return;
    }
    
    console.log('🗑️ [CityMenuComponent] Deleting menu item:', this.menuItemToDelete.title);
    
    this.menuService.deleteCityMenu(this.menuItemToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ [CityMenuComponent] Menu item deleted successfully');
          this.menuItems = this.menuItems.filter(item => item.id !== this.menuItemToDelete!.id);
          this.showConfirmDialog = false;
          this.menuItemToDelete = null;
        },
        error: (error) => {
          console.error('❌ [CityMenuComponent] Error deleting menu item:', error);
          this.error = 'Menü silinirken hata oluştu: ' + error.message;
          this.showConfirmDialog = false;
          this.menuItemToDelete = null;
        }
      });
  }

  cancelDelete(): void {
    console.log('❌ [CityMenuComponent] Delete cancelled');
    this.showConfirmDialog = false;
    this.menuItemToDelete = null;
  }

  backToCities(): void {
    console.log('🔙 [CityMenuComponent] Navigating back to cities list');
    this.router.navigate(['/admin/cities']);
  }

  trackByMenuId(index: number, menu: CityMenu): number {
    return menu.id;
  }

  refreshMenus(): void {
    console.log('🔄 [CityMenuComponent] Refreshing menus');
    this.loadCityMenus();
  }
}