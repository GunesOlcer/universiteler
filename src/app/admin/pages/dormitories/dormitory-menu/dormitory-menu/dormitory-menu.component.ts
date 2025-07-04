// src/app/admin/pages/dormitories/dormitory-menu/dormitory-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DormitoryService } from '../../../../services/dormitory.service';
import { DormitoryMenuService } from '../../../../services/dormitory-menu.service';

@Component({
  selector: 'app-dormitory-menu',
  templateUrl: './dormitory-menu.component.html',
  styleUrls: ['./dormitory-menu.component.scss']
})
export class DormitoryMenuComponent implements OnInit {
  dormitoryId: number;
  dormitory: any = {};
  menuItems: any[] = [];
  subMenus: { [key: number]: any[] } = {};
  
  expandedMenuIds: number[] = [];
  
  showConfirmDialog = false;
  menuItemToDelete: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dormitoryService: DormitoryService,
    private dormitoryMenuService: DormitoryMenuService
  ) { }

  ngOnInit(): void {
    this.dormitoryId = +this.route.snapshot.paramMap.get('id');
    this.loadDormitory();
    this.loadDormitoryMenus();
  }

  loadDormitory(): void {
    this.dormitoryService.getDormitory(this.dormitoryId).subscribe(
      (data: any) => {
        this.dormitory = data;
      },
      (error) => {
        console.error('Error loading dormitory:', error);
      }
    );
  }

  loadDormitoryMenus(): void {
    this.dormitoryMenuService.getDormitoryMenus(this.dormitoryId).subscribe(
      (data: any) => {
        this.menuItems = data;
        // Automatically load submenu items for the "Oda Tipleri" menu
        const odaTipleri = this.menuItems.find(item => item.title === 'Oda Tipleri');
        if (odaTipleri) {
          this.loadSubMenuItems(odaTipleri.id);
        }
      },
      (error) => {
        console.error('Error loading dormitory menus:', error);
      }
    );
  }

  loadSubMenuItems(parentId: number): void {
    this.dormitoryMenuService.getSubMenuItems(this.dormitoryId, parentId).subscribe(
      (data: any) => {
        this.subMenus[parentId] = data;
        // Add to expanded menu IDs to keep it open
        if (!this.expandedMenuIds.includes(parentId) && data.length > 0) {
          this.expandedMenuIds.push(parentId);
        }
      },
      (error) => {
        console.error('Error loading submenu items:', error);
      }
    );
  }

  toggleSubMenu(parentId: number): void {
    if (this.expandedMenuIds.includes(parentId)) {
      this.expandedMenuIds = this.expandedMenuIds.filter(id => id !== parentId);
    } else {
      this.expandedMenuIds.push(parentId);
      // Load sub menu items if not already loaded
      if (!this.subMenus[parentId]) {
        this.loadSubMenuItems(parentId);
      }
    }
  }

  isMenuExpanded(parentId: number): boolean {
    return this.expandedMenuIds.includes(parentId);
  }

  hasSubMenus(parentId: number): boolean {
    return this.subMenus[parentId] && this.subMenus[parentId].length > 0;
  }

  editMenuItem(menuItem: any): void {
    this.router.navigate(['/admin/dormitories/menus/edit', this.dormitoryId, menuItem.id]);
  }

  confirmDeleteMenuItem(menuItem: any): void {
    this.menuItemToDelete = menuItem;
    this.showConfirmDialog = true;
  }

  deleteMenuItem(): void {
    if (this.menuItemToDelete) {
      this.dormitoryMenuService.deleteMenuItem(this.dormitoryId, this.menuItemToDelete.id).subscribe(
        () => {
          if (this.menuItemToDelete.parentId) {
            // If submenu item, remove from submenus
            const parentId = this.menuItemToDelete.parentId;
            this.subMenus[parentId] = this.subMenus[parentId].filter(
              item => item.id !== this.menuItemToDelete.id
            );
          } else {
            // If main menu item, remove from menu items
            this.menuItems = this.menuItems.filter(
              item => item.id !== this.menuItemToDelete.id
            );
            // Also remove submenu entries if any
            if (this.subMenus[this.menuItemToDelete.id]) {
              delete this.subMenus[this.menuItemToDelete.id];
            }
          }
          
          this.showConfirmDialog = false;
          this.menuItemToDelete = null;
        },
        (error) => {
          console.error('Error deleting menu item:', error);
          this.showConfirmDialog = false;
          this.menuItemToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.menuItemToDelete = null;
  }
}