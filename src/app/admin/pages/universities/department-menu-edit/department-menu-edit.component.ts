// src/app/admin/pages/universities/department-menu-edit/department-menu-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';
import { DepartmentMenuService } from '../../../services/department-menu.service';

@Component({
  selector: 'app-department-menu-edit',
  templateUrl: './department-menu-edit.component.html',
  styleUrls: ['./department-menu-edit.component.scss']
})
export class DepartmentMenuEditComponent implements OnInit {
  departmentId: number;
  menuItemId: number;
  department: any = {};
  menuItem: any = {};
  contentForm: FormGroup;
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private departmentMenuService: DepartmentMenuService
  ) {
    this.contentForm = this.createForm();
  }

  ngOnInit(): void {
    this.departmentId = +this.route.snapshot.paramMap.get('departmentId');
    this.menuItemId = +this.route.snapshot.paramMap.get('menuItemId');
    
    this.loadDepartment();
    this.loadMenuItem();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      seoKeywords: [''],
      seoDescription: ['']
    });
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

  loadMenuItem(): void {
    this.departmentMenuService.getMenuItem(this.departmentId, this.menuItemId).subscribe(
      (data: any) => {
        this.menuItem = data;
        this.contentForm.patchValue({
          title: this.menuItem.title,
          content: this.menuItem.content,
          seoKeywords: this.menuItem.seoKeywords || '',
          seoDescription: this.menuItem.seoDescription || ''
        });
      },
      (error) => {
        console.error('Error loading menu item:', error);
      }
    );
  }

  // Helper to access form controls easily in the template
  get f() {
    return this.contentForm.controls;
  }

  saveContent(): void {
    this.submitted = true;
    
    if (this.contentForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    this.departmentMenuService.updateMenuItem(this.departmentId, this.menuItemId, this.contentForm.value).subscribe(
      () => {
        this.router.navigate(['/admin/departments/menus', this.departmentId]);
      },
      (error) => {
        console.error('Error updating menu item:', error);
        this.submitting = false;
      }
    );
  }
}