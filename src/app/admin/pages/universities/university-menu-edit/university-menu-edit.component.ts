// university-menu-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-university-menu-edit',
  templateUrl: './university-menu-edit.component.html',
  styleUrls: ['./university-menu-edit.component.scss']
})
export class UniversityMenuEditComponent implements OnInit {
  universityId: number;
  menuItemId: number;
  university: any = {};
  menuItem: any = {};
  contentForm: FormGroup;
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private universityService: UniversityService
  ) {
    this.contentForm = this.createForm();
  }

  ngOnInit(): void {
    this.universityId = +this.route.snapshot.paramMap.get('universityId');
    this.menuItemId = +this.route.snapshot.paramMap.get('menuItemId');
    
    this.loadUniversity();
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

  loadUniversity(): void {
    this.universityService.getUniversity(this.universityId).subscribe(
      (data: any) => {
        this.university = data;
      },
      (error) => {
        console.error('Error loading university:', error);
      }
    );
  }

  loadMenuItem(): void {
    // In a real app, make an API call to get the menu item data
    // For now, we'll use mock data based on menuItemId
    const menuStructure = [
      {
        id: 1,
        title: '1. Üniversite',
        children: [
          { id: 101, title: '1.A. Kilit Özellikler', content: 'Kilit özellikler içeriği burada yer alacak.' },
          { id: 102, title: '1.B. Kampüsler', content: 'Kampüsler içeriği burada yer alacak.' },
          // ... other items
        ]
      },
      // ... other categories
    ];

    // Find the menu item in the structure
    let foundMenuItem = null;
    for (const category of menuStructure) {
      const item = category.children.find(child => child.id === this.menuItemId);
      if (item) {
        foundMenuItem = item;
        break;
      }
    }

    if (foundMenuItem) {
      this.menuItem = foundMenuItem;
      this.contentForm.patchValue({
        title: this.menuItem.title,
        content: this.menuItem.content,
        seoKeywords: this.menuItem.seoKeywords || '',
        seoDescription: this.menuItem.seoDescription || ''
      });
    } else {
      console.error('Menu item not found');
    }
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
    
    // In a real app, make an API call to save the content
    console.log('Saving content:', this.contentForm.value);
    
    // Simulate API call
    setTimeout(() => {
      this.submitting = false;
      // Navigate back to the menu list
      this.router.navigate(['/admin/universities/menus', this.universityId]);
    }, 1000);
  }
}