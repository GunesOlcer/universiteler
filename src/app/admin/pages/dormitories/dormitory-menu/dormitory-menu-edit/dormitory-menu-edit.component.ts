// src/app/admin/pages/dormitories/dormitory-menu-edit/dormitory-menu-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DormitoryService } from '../../../../services/dormitory.service';
import { DormitoryMenuService } from '../../../../services/dormitory-menu.service';

@Component({
  selector: 'app-dormitory-menu-edit',
  templateUrl: './dormitory-menu-edit.component.html',
  styleUrls: ['./dormitory-menu-edit.component.scss']
})
export class DormitoryMenuEditComponent implements OnInit {
  dormitoryId: number;
  menuItemId: number;
  dormitory: any = {};
  menuItem: any = {};
  contentForm: FormGroup;
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dormitoryService: DormitoryService,
    private dormitoryMenuService: DormitoryMenuService
  ) {
    this.contentForm = this.createForm();
  }

  ngOnInit(): void {
    this.dormitoryId = +this.route.snapshot.paramMap.get('dormitoryId');
    this.menuItemId = +this.route.snapshot.paramMap.get('menuItemId');
    
    this.loadDormitory();
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

  loadMenuItem(): void {
    this.dormitoryMenuService.getMenuItem(this.dormitoryId, this.menuItemId).subscribe(
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
    
    this.dormitoryMenuService.updateMenuItem(this.dormitoryId, this.menuItemId, this.contentForm.value).subscribe(
      () => {
        this.router.navigate(['/admin/dormitories/menus', this.dormitoryId]);
      },
      (error) => {
        console.error('Error updating menu item:', error);
        this.submitting = false;
      }
    );
  }
}