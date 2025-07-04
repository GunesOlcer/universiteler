import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Editor, Toolbar } from 'ngx-editor';
import { CityService } from '../../../../core/services/city.service';
import { MenuService } from '../../../../core/services/menu.service';
import { AuthService } from '../../../../core/services/auth.service';
import { City } from '../../../../core/models/city.model';
import { CityMenu, CityMenuCreateRequest, CityMenuUpdateRequest } from '../../../../core/models/menu.model';
import { Status } from '../../../../core/models/base.model';

@Component({
  selector: 'app-city-menu-edit',
  templateUrl: './city-menu-edit.component.html',
  styleUrls: ['./city-menu-edit.component.scss']
})
export class CityMenuEditComponent implements OnInit, OnDestroy {
  cityId: number = 0;
  menuItemId: number | null = null;
  city: City | null = null;
  menuItem: CityMenu | null = null;
  contentForm: FormGroup;
  submitted = false;
  submitting = false;
  loading = false;
  isEditMode = false;
  error = '';
  
  Status = Status;
  
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear']
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private menuService: MenuService,
    private authService: AuthService
  ) {
    this.contentForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('📝 [CityMenuEditComponent] Initializing city menu edit component');
    
    this.editor = new Editor();
    
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('❌ [CityMenuEditComponent] User not authenticated, redirecting to login');
          this.router.navigate(['/admin/login']);
          return;
        }
        
        const cityId = this.route.snapshot.paramMap.get('cityId');
        const menuItemId = this.route.snapshot.paramMap.get('menuItemId');
        
        console.log('🔍 [CityMenuEditComponent] Route params - cityId:', cityId, 'menuItemId:', menuItemId);
        
        if (cityId) {
          this.cityId = +cityId;
          this.loadCity();
          
          if (menuItemId) {
            this.isEditMode = true;
            this.menuItemId = +menuItemId;
            console.log('✏️ [CityMenuEditComponent] Edit mode - loading menu item:', this.menuItemId);
            this.loadMenuItem();
          } else {
            console.log('➕ [CityMenuEditComponent] Add mode - preparing new menu form');
            this.setDefaultFormValues();
          }
        } else {
          console.error('❌ [CityMenuEditComponent] No cityId found in route');
          this.router.navigate(['/admin/cities']);
        }
      });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      order: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
      parentId: [''],
      isVisible: [true],
      status: [Status.Active, Validators.required]
    });
  }

  setDefaultFormValues(): void {
    console.log('🔧 [CityMenuEditComponent] Setting default form values for new menu');
    this.contentForm.patchValue({
      title: '',
      content: '',
      order: 1,
      parentId: '',
      isVisible: true,
      status: Status.Active
    });
  }

  loadCity(): void {
    console.log('🏙️ [CityMenuEditComponent] Loading city with ID:', this.cityId);
    
    this.cityService.getById(this.cityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (city) => {
          console.log('✅ [CityMenuEditComponent] City loaded:', city);
          this.city = city;
        },
        error: (error) => {
          console.error('❌ [CityMenuEditComponent] Error loading city:', error);
          this.error = 'Şehir bilgileri yüklenirken hata oluştu: ' + error.message;
          this.router.navigate(['/admin/cities']);
        }
      });
  }

  loadMenuItem(): void {
    if (!this.menuItemId) {
      console.warn('⚠️ [CityMenuEditComponent] No menu item ID provided');
      return;
    }
    
    console.log('📋 [CityMenuEditComponent] Loading menu item with ID:', this.menuItemId);
    
    this.loading = true;
    this.error = '';
    
    this.menuService.getCityMenuById(this.menuItemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menuItem) => {
          console.log('✅ [CityMenuEditComponent] Menu item loaded:', menuItem);
          this.menuItem = menuItem;
          this.contentForm.patchValue({
            title: menuItem.title || '',
            content: menuItem.content || '',
            order: menuItem.order || 1,
            parentId: menuItem.parentId || '',
            isVisible: menuItem.isVisible !== undefined ? menuItem.isVisible : true,
            status: menuItem.status || Status.Active
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ [CityMenuEditComponent] Error loading menu item:', error);
          this.error = 'Menü bilgileri yüklenirken hata oluştu: ' + error.message;
          this.loading = false;
          this.router.navigate(['/admin/cities/menus', this.cityId]);
        }
      });
  }

  get f() {
    return this.contentForm.controls;
  }

  saveContent(): void {
    console.log('💾 [CityMenuEditComponent] Attempting to save content');
    
    this.submitted = true;
    this.error = '';

    if (this.contentForm.invalid) {
      console.log('❌ [CityMenuEditComponent] Form is invalid:', this.getFormValidationErrors());
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formValues = this.contentForm.value;
    
    console.log('📋 [CityMenuEditComponent] Form values:', formValues);

    if (this.isEditMode && this.menuItemId) {
      const updateRequest: CityMenuUpdateRequest = {
        id: this.menuItemId,
        cityId: this.cityId,
        title: formValues.title.trim(),
        content: formValues.content.trim(),
        order: parseInt(formValues.order.toString()),
        parentId: formValues.parentId || null,
        isVisible: !!formValues.isVisible,
        status: formValues.status
      };

      console.log('✏️ [CityMenuEditComponent] Update request:', updateRequest);

      this.menuService.updateCityMenu(this.menuItemId, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            console.log('✅ [CityMenuEditComponent] Menu item updated successfully:', result);
            this.router.navigate(['/admin/cities/menus', this.cityId]);
          },
          error: (error) => {
            console.error('❌ [CityMenuEditComponent] Error updating menu item:', error);
            this.error = 'Menü güncellenirken hata oluştu: ' + error.message;
            this.submitting = false;
          }
        });
    } else {
      const createRequest: CityMenuCreateRequest = {
        cityId: this.cityId,
        title: formValues.title.trim(),
        content: formValues.content.trim(),
        order: parseInt(formValues.order.toString()),
        parentId: formValues.parentId || null,
        isVisible: !!formValues.isVisible,
        status: formValues.status
      };

      console.log('➕ [CityMenuEditComponent] Create request:', createRequest);

      this.menuService.createCityMenu(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            console.log('✅ [CityMenuEditComponent] Menu item created successfully:', result);
            this.router.navigate(['/admin/cities/menus', this.cityId]);
          },
          error: (error) => {
            console.error('❌ [CityMenuEditComponent] Error creating menu item:', error);
            this.error = 'Menü oluşturulurken hata oluştu: ' + error.message;
            this.submitting = false;
          }
        });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contentForm.controls).forEach(key => {
      const control = this.contentForm.get(key);
      control?.markAsTouched();
    });
  }

  private getFormValidationErrors(): any {
    const formErrors: any = {};
    Object.keys(this.contentForm.controls).forEach(key => {
      const controlErrors = this.contentForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    return formErrors;
  }

  cancel(): void {
    console.log('❌ [CityMenuEditComponent] Cancelling and navigating back');
    this.router.navigate(['/admin/cities/menus', this.cityId]);
  }

  getStatusName(status: Status): string {
    switch (status) {
      case Status.Active: return 'Aktif';
      case Status.Passive: return 'Pasif';
      case Status.Pending: return 'Beklemede';
      default: return 'Bilinmiyor';
    }
  }
}