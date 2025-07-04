// src/app/admin/pages/universities/department-menu/department-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';
import { DepartmentMenuService } from '../../../services/department-menu.service';

@Component({
  selector: 'app-department-menu',
  templateUrl: './department-menu.component.html',
  styleUrls: ['./department-menu.component.scss']
})
export class DepartmentMenuComponent implements OnInit {
  departmentId: number;
  department: any = {};
  menuItems: any[] = [];
  
  showConfirmDialog = false;
  menuItemToDelete: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private departmentMenuService: DepartmentMenuService
  ) { }

  ngOnInit(): void {
    this.departmentId = +this.route.snapshot.paramMap.get('id');
    this.loadDepartment();
    this.loadDepartmentMenus();
  }

  loadDepartment(): void {
    this.departmentService.getDepartment(this.departmentId).subscribe(
      (data: any) => {
        this.department = data;
      },
      (error) => {
        console.error('Error loading department:', error);
      }
    );
  }

  loadDepartmentMenus(): void {
    this.departmentMenuService.getDepartmentMenus(this.departmentId).subscribe(
      (data: any) => {
        this.menuItems = data;
      },
      (error) => {
        console.error('Error loading department menus:', error);
      }
    );
  }

  editMenuItem(menuItem: any): void {
    this.router.navigate(['/admin/departments/menus/edit', this.departmentId, menuItem.id]);
  }

  confirmDeleteMenuItem(menuItem: any): void {
    this.menuItemToDelete = menuItem;
    this.showConfirmDialog = true;
  }

  deleteMenuItem(): void {
    if (this.menuItemToDelete) {
      this.departmentMenuService.deleteMenuItem(this.departmentId, this.menuItemToDelete.id).subscribe(
        () => {
          // Başarılı silme işlemi sonrası listeyi güncelle
          this.menuItems = this.menuItems.filter(item => item.id !== this.menuItemToDelete.id);
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