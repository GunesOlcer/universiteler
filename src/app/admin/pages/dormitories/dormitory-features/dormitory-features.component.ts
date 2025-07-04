// src/app/admin/pages/dormitories/dormitory-features/dormitory-features.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DormitoryService } from '../../../services/dormitory.service';

@Component({
  selector: 'app-dormitory-features',
  templateUrl: './dormitory-features.component.html',
  styleUrls: ['./dormitory-features.component.scss']
})
export class DormitoryFeaturesComponent implements OnInit {
  featureCategories: any[] = [];
  featuresMap: { [key: number]: any[] } = {};
  
  categoryForm: FormGroup;
  featureForm: FormGroup;
  
  selectedCategoryId: number | null = null;
  selectedFeatureId: number | null = null;
  
  showCategoryModal = false;
  showFeatureModal = false;
  showConfirmDialog = false;
  
  deleteType: 'category' | 'feature' = 'category';
  itemToDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private dormitoryService: DormitoryService
  ) {
    this.categoryForm = this.createCategoryForm();
    this.featureForm = this.createFeatureForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required]
    });
  }

  createFeatureForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  loadCategories(): void {
    this.dormitoryService.getFeatureCategories().subscribe(
      (data: any) => {
        this.featureCategories = data;
        this.loadAllFeatures();
      },
      (error) => {
        console.error('Error loading feature categories:', error);
      }
    );
  }

  loadAllFeatures(): void {
    this.dormitoryService.getFeatures().subscribe(
      (data: any) => {
        // Group features by category
        this.featuresMap = {};
        this.featureCategories.forEach(category => {
          this.featuresMap[category.id] = data.filter((feature: any) => feature.categoryId === category.id);
        });
      },
      (error) => {
        console.error('Error loading features:', error);
      }
    );
  }

  // Category Modal Methods
  openAddCategoryModal(): void {
    this.selectedCategoryId = null;
    this.categoryForm.reset();
    this.showCategoryModal = true;
  }

  openEditCategoryModal(category: any): void {
    this.selectedCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name
    });
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    if (this.selectedCategoryId) {
      // Update existing category
      this.dormitoryService.updateFeatureCategory(
        this.selectedCategoryId, 
        this.categoryForm.value
      ).subscribe(
        () => {
          // Update local data
          const index = this.featureCategories.findIndex(c => c.id === this.selectedCategoryId);
          if (index !== -1) {
            this.featureCategories[index].name = this.categoryForm.value.name;
          }
          this.closeCategoryModal();
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    } else {
      // Create new category
      this.dormitoryService.createFeatureCategory(
        this.categoryForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          this.featureCategories.push({
            id: response.id,
            name: this.categoryForm.value.name
          });
          this.featuresMap[response.id] = [];
          this.closeCategoryModal();
        },
        (error) => {
          console.error('Error creating category:', error);
        }
      );
    }
  }

  // Feature Modal Methods
  openAddFeatureModal(categoryId: number): void {
    this.selectedFeatureId = null;
    this.featureForm.reset();
    this.featureForm.patchValue({
      categoryId: categoryId
    });
    this.showFeatureModal = true;
  }

  openEditFeatureModal(feature: any): void {
    this.selectedFeatureId = feature.id;
    this.featureForm.patchValue({
      name: feature.name,
      categoryId: feature.categoryId
    });
    this.showFeatureModal = true;
  }

  closeFeatureModal(): void {
    this.showFeatureModal = false;
  }

  saveFeature(): void {
    if (this.featureForm.invalid) {
      return;
    }

    if (this.selectedFeatureId) {
      // Update existing feature
      this.dormitoryService.updateFeature(
        this.selectedFeatureId, 
        this.featureForm.value
      ).subscribe(
        () => {
          // Update local data
          const categoryId = this.featureForm.value.categoryId;
          const features = this.featuresMap[categoryId] || [];
          const index = features.findIndex(f => f.id === this.selectedFeatureId);
          
          // If feature was moved to another category
          if (index === -1) {
            // Find the feature in its original category
            for (const catId in this.featuresMap) {
              const oldCatId = parseInt(catId);
              const oldFeatures = this.featuresMap[oldCatId];
              const oldIndex = oldFeatures.findIndex(f => f.id === this.selectedFeatureId);
              
              if (oldIndex !== -1) {
                // Remove from old category
                const feature = oldFeatures[oldIndex];
                this.featuresMap[oldCatId] = oldFeatures.filter(f => f.id !== this.selectedFeatureId);
                
                // Add to new category
                const updatedFeature = {
                  ...feature,
                  name: this.featureForm.value.name,
                  categoryId: categoryId
                };
                this.featuresMap[categoryId] = [...this.featuresMap[categoryId], updatedFeature];
                break;
              }
            }
          } else {
            // Just update the name
            features[index].name = this.featureForm.value.name;
          }
          
          this.closeFeatureModal();
        },
        (error) => {
          console.error('Error updating feature:', error);
        }
      );
    } else {
      // Create new feature
      this.dormitoryService.createFeature(
        this.featureForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          const categoryId = this.featureForm.value.categoryId;
          const newFeature = {
            id: response.id,
            name: this.featureForm.value.name,
            categoryId: categoryId
          };
          
          this.featuresMap[categoryId] = [
            ...(this.featuresMap[categoryId] || []),
            newFeature
          ];
          
          this.closeFeatureModal();
        },
        (error) => {
          console.error('Error creating feature:', error);
        }
      );
    }
  }

  // Delete Methods
  confirmDeleteCategory(category: any): void {
    this.deleteType = 'category';
    this.itemToDelete = category;
    this.showConfirmDialog = true;
  }

  confirmDeleteFeature(feature: any): void {
    this.deleteType = 'feature';
    this.itemToDelete = feature;
    this.showConfirmDialog = true;
  }

  deleteItem(): void {
    if (!this.itemToDelete) {
      return;
    }

    if (this.deleteType === 'category') {
      this.dormitoryService.deleteFeatureCategory(this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          this.featureCategories = this.featureCategories.filter(c => c.id !== this.itemToDelete.id);
          delete this.featuresMap[this.itemToDelete.id];
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting category:', error);
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        }
      );
    } else {
      this.dormitoryService.deleteFeature(this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          const categoryId = this.itemToDelete.categoryId;
          this.featuresMap[categoryId] = this.featuresMap[categoryId].filter(f => f.id !== this.itemToDelete.id);
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting feature:', error);
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
  getCategoryName(categoryId: number): string {
    const category = this.featureCategories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }
}