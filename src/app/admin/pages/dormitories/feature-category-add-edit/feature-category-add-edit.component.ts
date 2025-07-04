// src/app/admin/pages/dormitories/feature-category-add-edit/feature-category-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DormitoryService } from '../../../services/dormitory.service';

@Component({
  selector: 'app-feature-category-add-edit',
  templateUrl: './feature-category-add-edit.component.html',
  styleUrls: ['./feature-category-add-edit.component.scss']
})
export class FeatureCategoryAddEditComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dormitoryService: DormitoryService
  ) {
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required]
    });
  }

  loadCategory(id: number): void {
    this.dormitoryService.getFeatureCategories().subscribe(
      (data: any) => {
        const category = data.find((c: any) => c.id === id);
        if (category) {
          this.categoryForm.patchValue({
            name: category.name
          });
        } else {
          // Category not found
          this.router.navigate(['/admin/dormitory-features']);
        }
      },
      (error) => {
        console.error('Error loading category:', error);
      }
    );
  }

  // Helper to access form controls easily in the template
  get f() { 
    return this.categoryForm.controls; 
  }

  saveCategory(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.categoryForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    if (this.isEditMode && this.categoryId) {
      // Update existing category
      this.dormitoryService.updateFeatureCategory(this.categoryId, this.categoryForm.value).subscribe(
        () => {
          this.router.navigate(['/admin/dormitory-features']);
        },
        (error) => {
          console.error('Error updating category:', error);
          this.submitting = false;
        }
      );
    } else {
      // Create new category
      this.dormitoryService.createFeatureCategory(this.categoryForm.value).subscribe(
        () => {
          this.router.navigate(['/admin/dormitory-features']);
        },
        (error) => {
          console.error('Error creating category:', error);
          this.submitting = false;
        }
      );
    }
  }
}