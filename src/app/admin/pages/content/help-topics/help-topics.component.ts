import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-help-topics',
  templateUrl: './help-topics.component.html',
  styleUrls: ['./help-topics.component.scss']
})
export class HelpTopicsComponent implements OnInit {
  helpCategories: any[] = [];
  
  showCategoryModal = false;
  showTopicModal = false;
  showConfirmDialog = false;
  
  categoryForm: FormGroup;
  topicForm: FormGroup;
  
  selectedCategoryId: number | null = null;
  selectedTopicId: number | null = null;
  deleteType: 'category' | 'topic' = 'category';
  itemToDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService
  ) {
    this.categoryForm = this.createCategoryForm();
    this.topicForm = this.createTopicForm();
  }

  ngOnInit(): void {
    this.loadHelpCategories();
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required]
    });
  }

  createTopicForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  loadHelpCategories(): void {
    this.contentService.getHelpCategories().subscribe(
      (data: any) => {
        this.helpCategories = data;
      },
      (error) => {
        console.error('Error loading help categories:', error);
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
      this.contentService.updateHelpCategory(
        this.selectedCategoryId, 
        this.categoryForm.value
      ).subscribe(
        () => {
          // Update local data
          const index = this.helpCategories.findIndex(c => c.id === this.selectedCategoryId);
          if (index !== -1) {
            this.helpCategories[index].name = this.categoryForm.value.name;
          }
          this.closeCategoryModal();
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    } else {
      // Create new category
      this.contentService.createHelpCategory(
        this.categoryForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          this.helpCategories.push({
            id: response.id,
            name: this.categoryForm.value.name,
            topics: []
          });
          this.closeCategoryModal();
        },
        (error) => {
          console.error('Error creating category:', error);
        }
      );
    }
  }

  // Topic Modal Methods
  openAddTopicModal(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.selectedTopicId = null;
    this.topicForm.reset();
    this.showTopicModal = true;
  }

  openEditTopicModal(categoryId: number, topic: any): void {
    this.selectedCategoryId = categoryId;
    this.selectedTopicId = topic.id;
    this.topicForm.patchValue({
      title: topic.title,
      content: topic.content
    });
    this.showTopicModal = true;
  }

  closeTopicModal(): void {
    this.showTopicModal = false;
  }

  saveTopic(): void {
    if (this.topicForm.invalid || !this.selectedCategoryId) {
      return;
    }

    if (this.selectedTopicId) {
      // Update existing topic
      this.contentService.updateHelpTopic(
        this.selectedCategoryId,
        this.selectedTopicId,
        this.topicForm.value
      ).subscribe(
        () => {
          // Update local data
          const categoryIndex = this.helpCategories.findIndex(c => c.id === this.selectedCategoryId);
          if (categoryIndex !== -1) {
            const topicIndex = this.helpCategories[categoryIndex].topics.findIndex((t: any) => t.id === this.selectedTopicId);
            if (topicIndex !== -1) {
              this.helpCategories[categoryIndex].topics[topicIndex] = {
                ...this.helpCategories[categoryIndex].topics[topicIndex],
                title: this.topicForm.value.title,
                content: this.topicForm.value.content
              };
            }
          }
          this.closeTopicModal();
        },
        (error) => {
          console.error('Error updating topic:', error);
        }
      );
    } else {
      // Create new topic
      this.contentService.createHelpTopic(
        this.selectedCategoryId,
        this.topicForm.value
      ).subscribe(
        (response: any) => {
          // Add to local data
          const categoryIndex = this.helpCategories.findIndex(c => c.id === this.selectedCategoryId);
          if (categoryIndex !== -1) {
            this.helpCategories[categoryIndex].topics.push({
              id: response.id,
              title: this.topicForm.value.title,
              content: this.topicForm.value.content
            });
          }
          this.closeTopicModal();
        },
        (error) => {
          console.error('Error creating topic:', error);
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

  confirmDeleteTopic(categoryId: number, topic: any): void {
    this.deleteType = 'topic';
    this.selectedCategoryId = categoryId;
    this.itemToDelete = topic;
    this.showConfirmDialog = true;
  }

  deleteItem(): void {
    if (!this.itemToDelete) {
      return;
    }

    if (this.deleteType === 'category') {
      this.contentService.deleteHelpCategory(this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          this.helpCategories = this.helpCategories.filter(c => c.id !== this.itemToDelete.id);
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting category:', error);
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        }
      );
    } else if (this.deleteType === 'topic' && this.selectedCategoryId) {
      this.contentService.deleteHelpTopic(this.selectedCategoryId, this.itemToDelete.id).subscribe(
        () => {
          // Remove from local data
          const categoryIndex = this.helpCategories.findIndex(c => c.id === this.selectedCategoryId);
          if (categoryIndex !== -1) {
            this.helpCategories[categoryIndex].topics = this.helpCategories[categoryIndex].topics.filter((t: any) => t.id !== this.itemToDelete.id);
          }
          this.showConfirmDialog = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting topic:', error);
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