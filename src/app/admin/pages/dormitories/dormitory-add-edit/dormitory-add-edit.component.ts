import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DormitoryService } from '../../../services/dormitory.service';
import { CityService } from '../../../services/city.service';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-dormitory-add-edit',
  templateUrl: './dormitory-add-edit.component.html',
  styleUrls: ['./dormitory-add-edit.component.scss']
})
export class DormitoryAddEditComponent implements OnInit {
  dormitoryForm: FormGroup;
  isEditMode = false;
  dormitoryId: number | null = null;
  submitted = false;
  submitting = false;
  
  cities: any[] = [];
  universities: any[] = [];
  featureCategories: any[] = [];
  features: any[] = [];
  
  // For section navigation
  currentSection = 'basic';
  
  // For image previews
  coverImagePreview: string | null = null;
  thumbnailImagePreview: string | null = null;
  
  @ViewChild('coverImageInput') coverImageInput: ElementRef;
  @ViewChild('thumbnailImageInput') thumbnailImageInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dormitoryService: DormitoryService,
    private cityService: CityService,
    private universityService: UniversityService
  ) {
    this.dormitoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCities();
    this.loadUniversities();
    this.loadFeatureCategories();
    this.loadFeatures();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.dormitoryId = +id;
      this.loadDormitory(this.dormitoryId);
    }
    
    // Setup scroll observer to update active section
    this.setupScrollObserver();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: [''],
      coverImage: [null],
      coverImageUrl: [''],
      thumbnailImage: [null],
      thumbnailImageUrl: [''],
      features: this.fb.group({}), // Will be populated dynamically
      address: [''],
      latitude: [''],
      longitude: [''],
      cityId: ['', Validators.required],
      district: ['', Validators.required],
      universityId: [''],
      bedCount: [''],
      mealCount: [''],
      hasWifi: [false],
      hasDailyCleaning: [false],
      hasGym: [false],
      isActive: [true],
      isImportant: [false],
      contactPerson: [''],
      contactPhone: [''],
      contactMobile: [''],
      contactAddress: [''],
      website: [''],
      whatsapp: ['']
    });
  }

  // Setup scroll observer to update active section
  setupScrollObserver() {
    const sections = ['basic', 'features', 'location', 'general', 'contact'];
    
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

  loadCities(): void {
    this.cityService.getCities().subscribe(
      (data: any) => {
        this.cities = data;
      },
      (error) => {
        console.error('Error loading cities:', error);
      }
    );
  }

  loadUniversities(): void {
    this.universityService.getUniversities().subscribe(
      (data: any) => {
        this.universities = data.items;
      },
      (error) => {
        console.error('Error loading universities:', error);
      }
    );
  }

  loadFeatureCategories(): void {
    this.dormitoryService.getFeatureCategories().subscribe(
      (data: any) => {
        this.featureCategories = data;
      },
      (error) => {
        console.error('Error loading feature categories:', error);
      }
    );
  }

  loadFeatures(): void {
    this.dormitoryService.getFeatures().subscribe(
      (data: any) => {
        this.features = data;
        
        // Add form controls for each feature
        const featuresGroup = this.dormitoryForm.get('features') as FormGroup;
        this.features.forEach(feature => {
          featuresGroup.addControl(feature.id.toString(), this.fb.control(false));
        });
      },
      (error) => {
        console.error('Error loading features:', error);
      }
    );
  }

  loadDormitory(id: number): void {
    this.dormitoryService.getDormitory(id).subscribe(
      (data: any) => {
        // Update form with dormitory data
        this.dormitoryForm.patchValue({
          name: data.name,
          slug: data.slug,
          description: data.description,
          coverImageUrl: data.coverImageUrl,
          thumbnailImageUrl: data.thumbnailImageUrl,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          cityId: data.cityId,
          district: data.district,
          universityId: data.universityId,
          bedCount: data.bedCount,
          mealCount: data.mealCount,
          hasWifi: data.hasWifi,
          hasDailyCleaning: data.hasDailyCleaning,
          hasGym: data.hasGym,
          isActive: data.isActive,
          isImportant: data.isImportant,
          contactPerson: data.contactPerson,
          contactPhone: data.contactPhone,
          contactMobile: data.contactMobile,
          contactAddress: data.contactAddress,
          website: data.website,
          whatsapp: data.whatsapp
        });
        
        // Set image previews if available
        if (data.coverImageUrl) {
          this.coverImagePreview = data.coverImageUrl;
        }
        
        if (data.thumbnailImageUrl) {
          this.thumbnailImagePreview = data.thumbnailImageUrl;
        }
        
        // Update features if available
        if (data.features) {
          // Simulate feature selection based on mock data
          const featuresGroup = this.dormitoryForm.get('features') as FormGroup;
          Object.keys(featuresGroup.controls).forEach(featureId => {
            // Randomly set some features to true for demo purposes
            if (Math.random() > 0.7) {
              featuresGroup.get(featureId)?.setValue(true);
            }
          });
        }
      },
      (error) => {
        console.error('Error loading dormitory:', error);
      }
    );
  }

  // Helper to access form controls easily in the template
  get f() { 
    return this.dormitoryForm.controls; 
  }

  generateSlug(): void {
    const name = this.dormitoryForm.get('name')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      
      this.dormitoryForm.patchValue({ slug });
    }
  }

  getFeaturesByCategory(categoryId: number): any[] {
    return this.features.filter(f => f.categoryId === categoryId);
  }
  
  // Image handling methods
  onCoverImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.dormitoryForm.patchValue({ coverImage: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.coverImagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  onThumbnailImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.dormitoryForm.patchValue({ thumbnailImage: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailImagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage() {
    this.dormitoryForm.patchValue({ 
      coverImage: null,
      coverImageUrl: '' 
    });
    this.coverImagePreview = null;
    if (this.coverImageInput) {
      this.coverImageInput.nativeElement.value = '';
    }
  }

  removeThumbnailImage() {
    this.dormitoryForm.patchValue({ 
      thumbnailImage: null,
      thumbnailImageUrl: '' 
    });
    this.thumbnailImagePreview = null;
    if (this.thumbnailImageInput) {
      this.thumbnailImageInput.nativeElement.value = '';
    }
  }

  saveDormitory(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.dormitoryForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    const formData = new FormData();
    
    // Append all form values to FormData except for nested objects and files
    Object.keys(this.dormitoryForm.value).forEach(key => {
      if (key !== 'features' && key !== 'coverImage' && key !== 'thumbnailImage' && !key.endsWith('Url')) {
        formData.append(key, this.dormitoryForm.value[key]);
      }
    });
    
    // Handle features
    const featuresGroup = this.dormitoryForm.get('features')?.value;
    if (featuresGroup) {
      Object.keys(featuresGroup).forEach(featureId => {
        if (featuresGroup[featureId]) {
          formData.append(`features[${featureId}]`, '1');
        }
      });
    }
    
    // Append files if they exist
    if (this.dormitoryForm.value.coverImage) {
      formData.append('coverImage', this.dormitoryForm.value.coverImage);
    }
    
    if (this.dormitoryForm.value.thumbnailImage) {
      formData.append('thumbnailImage', this.dormitoryForm.value.thumbnailImage);
    }
    
    if (this.isEditMode && this.dormitoryId) {
      // Update existing dormitory
      this.dormitoryService.updateDormitory(this.dormitoryId, formData).subscribe(
        () => {
          this.router.navigate(['/admin/dormitories']);
        },
        (error) => {
          console.error('Error updating dormitory:', error);
          this.submitting = false;
        }
      );
    } else {
      // Create new dormitory
      this.dormitoryService.createDormitory(formData).subscribe(
        () => {
          this.router.navigate(['/admin/dormitories']);
        },
        (error) => {
          console.error('Error creating dormitory:', error);
          this.submitting = false;
        }
      );
    }
  }
}