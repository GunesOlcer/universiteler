// src/app/admin/pages/content/module-menus/module-menus.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-module-menus',
  templateUrl: './module-menus.component.html',
  styleUrls: ['./module-menus.component.scss']
})
export class ModuleMenusComponent implements OnInit {
  moduleMenus: any[] = [];
  
  showMenuModal = false;
  showMenuItemModal = false;
  showConfirmDialog = false;
  
  menuForm: FormGroup;
  menuItemForm: FormGroup;
  
  selectedMenuId: number | null = null;
  selectedMenuItemId: number | null = null;
  deleteType: 'menu' | 'menuItem' = 'menu';
  itemToDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService
  ) {
    this.menuForm = this.createMenuForm();
    this.menuItemForm = this.createMenuItemForm();
  }

  ngOnInit(): void {
    this.loadModuleMenus();
  }

  createMenuForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      adminTitle: ['', Validators.required],
      slug: ['', Validators.required]
    });
  }

  createMenuItemForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  loadModuleMenus(): void {
    this.contentService.getModuleMenus().subscribe(
      (data: any) => {
        this.moduleMenus = data;
      },
      (error) => {
        console.error('Error loading module menus:', error);
      }
    );
  }

  // Menu Modal Methods
  openAddMenuModal(): void {
    this.selectedMenuId = null;
    this.menuForm.reset();
    this.showMenuModal = true;
  }

  openEditMenuModal(menu: any): void {
    this.selectedMenuId = menu.id;
    this.menuForm.patchValue({
      title: menu.title,
      adminTitle: menu.adminTitle,
      slug: menu.slug
    });
    this.showMenuModal = true;
  }

  closeMenuModal(): void {
    this.showMenuModal = false;
  }

  saveMenu(): void {
    if (this.menuForm.invalid) {
      return;
    }

    if (this.selectedMenuId) {
      // Update existing menu
      this.contentService.updateModuleMenu(
        this.selectedMenuId, 
        this.menuForm.value
      ).subscribe(
        () => {
          // Update local data
          const index = this.moduleMenus.findIndex(m => m.id === this.selectedMenuId);
          if (index !== -1) {
            this.moduleMenus[index] = {
              ...this.moduleMenus[index],
              title: this.menuForm.value.title,
              adminTitle: this.menuForm.value.adminTitle,
              slug: this.menuForm.value.slug
            };
          }
          this.closeMenuModal();
        },
        (error) => {
          console.error('Error updating menu:', error);
        }
      );
    } else {
      // Create new menu
      this.contentService.createModuleMenu(
        this.menuForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          this.moduleMenus.push({
            id: response.id,
            title: this.menuForm.value.title,
            adminTitle: this.menuForm.value.adminTitle,
            slug: this.menuForm.value.slug,
            items: []
          });
          this.closeMenuModal();
        },
        (error) => {
          console.error('Error creating menu:', error);
        }
      );
    }
  }

  // Menu Item Modal Methods
  openAddMenuItemModal(menuId: number): void {
    this.selectedMenuId = menuId;
    this.selectedMenuItemId = null;
    this.menuItemForm.reset();
    this.showMenuItemModal = true;
  }

  openEditMenuItemModal(menuId: number, menuItem: any): void {
    this.selectedMenuId = menuId;
    this.selectedMenuItemId = menuItem.id;
    this.menuItemForm.patchValue({
      title: menuItem.title,
      url: menuItem.url
    });
    this.showMenuItemModal = true;
  }

  closeMenuItemModal(): void {
    this.showMenuItemModal = false;
  }

  saveMenuItem(): void {
    if (this.menuItemForm.invalid || !this.selectedMenuId) {
      return;
    }

    if (this.selectedMenuItemId) {
      // Update existing menu item
      this.contentService.updateModuleMenuItem(
        this.selectedMenuId,
        this.selectedMenuItemId,
        this.menuItemForm.value
      ).subscribe(
        () => {
          // Update local data
          const menuIndex = this.moduleMenus.findIndex(m => m.id === this.selectedMenuId);
          if (menuIndex !== -1) {
            const itemIndex = this.moduleMenus[menuIndex].items.findIndex((i: any) => i.id === this.selectedMenuItemId);
            if (itemIndex !== -1) {
              this.moduleMenus[menuIndex].items[itemIndex] = {
                ...this.moduleMenus[menuIndex].items[itemIndex],
                title: this.menuItemForm.value.title,
                url: this.menuItemForm.value.url
              };
            }
          }
          this.closeMenuItemModal();
        },
        (error) => {
          console.error('Error updating menu item:', error);
        }
      );
    } else {
      // Create new menu item
      this.contentService.createModuleMenuItem(
        this.selectedMenuId,
        this.menuItemForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          const menuIndex = this.moduleMenus.findIndex(m => m.id === this.selectedMenuId);
          if (menuIndex !== -1) {
            this.moduleMenus[menuIndex].items.push({
              id: response.id,
              title: this.menuItemForm.value.title,
              url: this.menuItemForm.value.url
            });
          }
          this.closeMenuItemModal();
        },
        (error) => {
          console.error('Error creating menu item:', error);
        }
      );
    }
  }

  // Delete Methods
  confirmDeleteMenu(menu: any): void {
    this.deleteType = 'menu';
    this.itemToDelete = menu;
    this.showConfirmDialog = true;
  }

  confirmDeleteMenuItem(menuId: number, menuItem: any): void {
    this.deleteType = 'menuItem';
    this.selectedMenuId = menuId;
    this.itemToDelete = menuItem;
    this.showConfirmDialog = true;
  }

  // Add this method to your ModuleMenusComponent class
getTotalMenuItems(): number {
  let total = 0;
  this.moduleMenus.forEach(menu => {
    if (menu.items && Array.isArray(menu.items)) {
      total += menu.items.length;
    }
  });
  return total;
}

  deleteItem(): void {
    if (!this.itemToDelete) {
      return;
    }

    if (this.deleteType === 'menu') {
      this.contentService.deleteModuleMenu(this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          this.moduleMenus = this.moduleMenus.filter(m => m.id !== this.itemToDelete.id);
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting menu:', error);
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        }
      );
    } else if (this.deleteType === 'menuItem' && this.selectedMenuId) {
      this.contentService.deleteModuleMenuItem(this.selectedMenuId, this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          const menuIndex = this.moduleMenus.findIndex(m => m.id === this.selectedMenuId);
          if (menuIndex !== -1) {
            this.moduleMenus[menuIndex].items = this.moduleMenus[menuIndex].items.filter((i: any) => i.id !== this.itemToDelete.id);
          }
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting menu item:', error);
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.itemToDelete = null;
  }
}