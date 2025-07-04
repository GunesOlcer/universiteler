// src/app/admin/pages/universities/department-add-edit/department-add-edit.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './department-add-edit.component.html',
  styleUrls: ['./department-add-edit.component.scss']
})
export class DepartmentAddEditComponent implements OnInit {
  departmentForm: FormGroup;
  isEditMode = false;
  departmentId: number | null = null;
  submitted = false;
  submitting = false;
  
  // For section navigation
  currentSection = 'basic';
  
  // For image preview
  mainImagePreview: string | null = null;
  
  @ViewChild('mainImageInput') mainImageInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.departmentId = +id;
      this.loadDepartment(this.departmentId);
    }
    
    // Setup scroll observer to update active section
    this.setupScrollObserver();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      shortDescription: [''],
      description: ['', Validators.required],
      trainingPeriod: [4, [Validators.required, Validators.min(1), Validators.max(10)]],
      examType: ['sayısal', Validators.required],
      videoLinks: this.fb.group({
        link1: [''],
        link2: [''],
        link3: [''],
        link4: [''],
        link5: ['']
      }),
      mainImage: [null],
      mainImageUrl: [''],
      isActive: [true],
      isImportant: [false]
    });
  }

  loadDepartment(id: number): void {
    this.departmentService.getDepartment(id).subscribe(
      (data: any) => {
        // Update form with department data
        this.departmentForm.patchValue({
          name: data.name,
          slug: data.slug,
          shortDescription: data.shortDescription,
          description: data.description,
          trainingPeriod: data.trainingPeriod,
          examType: data.examType,
          videoLinks: {
            link1: data.videoLinks?.link1 || '',
            link2: data.videoLinks?.link2 || '',
            link3: data.videoLinks?.link3 || '',
            link4: data.videoLinks?.link4 || '',
            link5: data.videoLinks?.link5 || ''
          },
          mainImageUrl: data.mainImageUrl,
          isActive: data.isActive,
          isImportant: data.isImportant
        });
        
        // Load image preview if available
        if (data.mainImageUrl) {
          this.mainImagePreview = data.mainImageUrl;
        }
      },
      (error) => {
        console.error('Error loading department:', error);
      }
    );
  }

  // Setup scroll observer to update active section
  setupScrollObserver() {
    const sections = ['basic', 'content', 'videos', 'status'];
    
    window.addEventListener('scroll', () => {
      for (const section of sections) {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            this.currentSection = section;
            break;
          }
        }
      }
    });
  }
  
  // Scroll to a section
  scrollToSection(section: string) {
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.currentSection = section;
    }
  }

  // Helper to access form controls easily in the template
  get f() { 
    return this.departmentForm.controls; 
  }

  // Image handling methods
  onMainImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.departmentForm.patchValue({ mainImage: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }
  
  removeMainImage() {
    this.departmentForm.patchValue({ 
      mainImage: null,
      mainImageUrl: '' 
    });
    this.mainImagePreview = null;
    if (this.mainImageInput) {
      this.mainImageInput.nativeElement.value = '';
    }
  }

  generateSlug(): void {
    const name = this.departmentForm.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      
      this.departmentForm.patchValue({ slug });
    }
  }

  saveDepartment(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.departmentForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    const formData = new FormData();
    
    // Append all form values to FormData
    Object.keys(this.departmentForm.value).forEach(key => {
      // Skip nested objects and file fields
      if (key !== 'videoLinks' && key !== 'mainImage' && !key.endsWith('Url')) {
        formData.append(key, this.departmentForm.value[key]);
      }
    });
    
    // Handle nested video links
    const videoLinks = this.departmentForm.get('videoLinks')?.value;
    if (videoLinks) {
      Object.keys(videoLinks).forEach(linkKey => {
        formData.append(`videoLinks.${linkKey}`, videoLinks[linkKey] || '');
      });
    }
    
    // Append file if it exists
    if (this.departmentForm.value.mainImage) {
      formData.append('mainImage', this.departmentForm.value.mainImage);
    }
    
    if (this.isEditMode && this.departmentId) {
      // Update existing department
      this.departmentService.updateDepartment(this.departmentId, formData).subscribe(
        () => {
          this.router.navigate(['/admin/departments']);
        },
        (error) => {
          console.error('Error updating department:', error);
          this.submitting = false;
        }
      );
    } else {
      // Create new department
      this.departmentService.createDepartment(formData).subscribe(
        () => {
          this.router.navigate(['/admin/departments']);
        },
        (error) => {
          console.error('Error creating department:', error);
          this.submitting = false;
        }
      );
    }
  }
}