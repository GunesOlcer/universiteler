// src/app/admin/pages/site/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SiteService } from '../../../services/site.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  admins: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    search: '',
    status: '',
    permission: ''
  };
  
  filterPanelOpen = true; // Controls the visibility of filter panel
  
  showAdminModal = false;
  showConfirmDialog = false;
  
  adminForm: FormGroup;
  selectedAdminId: number | null = null;
  adminToDelete: any = null;
  
  permissionOptions = [
    { id: 'full_admin', name: 'Tam Yetkili Yönetici' },
    { id: 'content_management', name: 'İçerik Yönetimi' },
    { id: 'user_management', name: 'Kullanıcı Yönetimi' },
    { id: 'statistics', name: 'İstatistikler' },
    { id: 'site_management', name: 'Site Yönetimi' }
  ];
  
  // For use in template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService
  ) {
    this.adminForm = this.createAdminForm();
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

  createAdminForm(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isActive: [true],
      permissions: this.fb.array([])
    });
  }
  
  get permissionsFormArray(): FormArray {
    return this.adminForm.get('permissions') as FormArray;
  }

  loadAdmins(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.siteService.getAdmins(params).subscribe(
      (data: any) => {
        this.admins = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading admins:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.admins.filter(a => a.isActive).length;
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadAdmins();
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      status: '',
      permission: ''
    };
    this.currentPage = 1;
    this.loadAdmins();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAdmins();
  }

  // Permission helpers
  getPermissionName(permissionId: string): string {
    const permission = this.permissionOptions.find(p => p.id === permissionId);
    return permission ? permission.name : permissionId;
  }

  getPermissionNames(permissions: string[]): string {
    if (!permissions || permissions.length === 0) return '-';
    
    // If "full_admin" is present, just show that
    if (permissions.includes('full_admin')) {
      return this.getPermissionName('full_admin');
    }
    
    return permissions.map(id => this.getPermissionName(id)).join(', ');
  }

  // Admin Modal Methods
  openAddAdminModal(): void {
    this.selectedAdminId = null;
    this.adminForm.reset({
      isActive: true
    });
    
    // Clear and initialize permissions checkboxes
    this.permissionsFormArray.clear();
    this.permissionOptions.forEach(() => {
      this.permissionsFormArray.push(this.fb.control(false));
    });
    
    this.showAdminModal = true;
  }

  openEditAdminModal(admin: any): void {
    this.selectedAdminId = admin.id;
    this.adminForm.patchValue({
      fullName: admin.fullName,
      email: admin.email,
      username: admin.username,
      isActive: admin.isActive
    });
    
    // Remove password validators in edit mode (password change is optional)
    this.adminForm.get('password')?.clearValidators();
    this.adminForm.get('password')?.updateValueAndValidity();
    
    // Set permissions
    this.permissionsFormArray.clear();
    this.permissionOptions.forEach(option => {
      const isSelected = admin.permissions.includes(option.id);
      this.permissionsFormArray.push(this.fb.control(isSelected));
    });
    
    this.showAdminModal = true;
  }

  closeAdminModal(): void {
    this.showAdminModal = false;
    
    // Restore password validators for next time
    this.adminForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.adminForm.get('password')?.updateValueAndValidity();
  }

  saveAdmin(): void {
    if (this.adminForm.invalid) {
      return;
    }

    const adminData = { ...this.adminForm.value };
    
    // Process permissions
    adminData.permissions = this.permissionOptions
      .filter((_, index) => this.permissionsFormArray.at(index).value)
      .map(option => option.id);
    
    // If no permissions selected, add default one
    if (adminData.permissions.length === 0) {
      adminData.permissions = ['content_management'];
    }
    
    // If password is empty and in edit mode, don't send it
    if (this.selectedAdminId && !adminData.password) {
      delete adminData.password;
    }

    if (this.selectedAdminId) {
      // Update existing admin
      this.siteService.updateAdmin(this.selectedAdminId, adminData).subscribe(
        () => {
          // Update local data
          const index = this.admins.findIndex(a => a.id === this.selectedAdminId);
          if (index !== -1) {
            this.admins[index] = {
              ...this.admins[index],
              fullName: adminData.fullName,
              email: adminData.email,
              username: adminData.username,
              isActive: adminData.isActive,
              permissions: adminData.permissions
            };
          }
          this.closeAdminModal();
        },
        (error) => {
          console.error('Error updating admin:', error);
        }
      );
    } else {
      // Create new admin
      this.siteService.createAdmin(adminData).subscribe(
        (response: any) => {
          // Reload admins
          this.loadAdmins();
          this.closeAdminModal();
        },
        (error) => {
          console.error('Error creating admin:', error);
        }
      );
    }
  }

  // Delete Methods
  confirmDelete(admin: any): void {
    this.adminToDelete = admin;
    this.showConfirmDialog = true;
  }

  deleteAdmin(): void {
    if (this.adminToDelete) {
      this.siteService.deleteAdmin(this.adminToDelete.id).subscribe(
        () => {
          // Remove from local data
          this.admins = this.admins.filter(a => a.id !== this.adminToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.adminToDelete = null;
          
          // If current page is empty, go to previous page
          if (this.admins.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadAdmins();
          }
        },
        (error) => {
          console.error('Error deleting admin:', error);
          this.showConfirmDialog = false;
          this.adminToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.adminToDelete = null;
  }
}