// src/app/admin/pages/content/dynamic-menus/dynamic-menus.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-dynamic-menus',
  templateUrl: './dynamic-menus.component.html',
  styleUrls: ['./dynamic-menus.component.scss']
})
export class DynamicMenusComponent implements OnInit {
  dynamicMenus: any[] = [];
  
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
    this.loadDynamicMenus();
  }

  createMenuForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      adminTitle: ['', Validators.required]
    });
  }

  createMenuItemForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      linkType: ['custom', Validators.required],
      url: ['', Validators.required]
    });
  }

  loadDynamicMenus(): void {
    this.contentService.getDynamicMenus().subscribe(
      (data: any) => {
        this.dynamicMenus = data;
      },
      (error) => {
        console.error('Error loading dynamic menus:', error);
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
      adminTitle: menu.adminTitle
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
      this.contentService.updateDynamicMenu(
        this.selectedMenuId, 
        this.menuForm.value
      ).subscribe(
        () => {
          // Update local data
          const index = this.dynamicMenus.findIndex(m => m.id === this.selectedMenuId);
          if (index !== -1) {
            this.dynamicMenus[index] = {
              ...this.dynamicMenus[index],
              title: this.menuForm.value.title,
              adminTitle: this.menuForm.value.adminTitle
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
      this.contentService.createDynamicMenu(
        this.menuForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          this.dynamicMenus.push({
            id: response.id,
            title: this.menuForm.value.title,
            adminTitle: this.menuForm.value.adminTitle,
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
    this.menuItemForm.reset({
      linkType: 'custom'
    });
    this.showMenuItemModal = true;
  }

  openEditMenuItemModal(menuId: number, menuItem: any): void {
    this.selectedMenuId = menuId;
    this.selectedMenuItemId = menuItem.id;
    this.menuItemForm.patchValue({
      title: menuItem.title,
      linkType: menuItem.linkType,
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
      this.contentService.updateDynamicMenuItem(
        this.selectedMenuId,
        this.selectedMenuItemId,
        this.menuItemForm.value
      ).subscribe(
        () => {
          // Update local data
          const menuIndex = this.dynamicMenus.findIndex(m => m.id === this.selectedMenuId);
          if (menuIndex !== -1) {
            const itemIndex = this.dynamicMenus[menuIndex].items.findIndex((i: any) => i.id === this.selectedMenuItemId);
            if (itemIndex !== -1) {
              this.dynamicMenus[menuIndex].items[itemIndex] = {
                ...this.dynamicMenus[menuIndex].items[itemIndex],
                title: this.menuItemForm.value.title,
                linkType: this.menuItemForm.value.linkType,
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
      this.contentService.createDynamicMenuItem(
        this.selectedMenuId,
        this.menuItemForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          const menuIndex = this.dynamicMenus.findIndex(m => m.id === this.selectedMenuId);
          if (menuIndex !== -1) {
            this.dynamicMenus[menuIndex].items.push({
              id: response.id,
              title: this.menuItemForm.value.title,
              linkType: this.menuItemForm.value.linkType,
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

  deleteItem(): void {
    if (!this.itemToDelete) {
      return;
    }

    if (this.deleteType === 'menu') {
      this.contentService.deleteDynamicMenu(this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          this.dynamicMenus = this.dynamicMenus.filter(m => m.id !== this.itemToDelete.id);
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
      this.contentService.deleteDynamicMenuItem(this.selectedMenuId, this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          const menuIndex = this.dynamicMenus.findIndex(m => m.id === this.selectedMenuId);
          if (menuIndex !== -1) {
            this.dynamicMenus[menuIndex].items = this.dynamicMenus[menuIndex].items.filter((i: any) => i.id !== this.itemToDelete.id);
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

  // Helper Methods
  getLinkTypeName(type: string): string {
    const types = {
      'custom': 'Özel Link',
      'page': 'Sayfa',
      'module': 'Modül'
    };
    return types[type] || type;
  }
}