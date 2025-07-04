import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversityService } from '../../../services/university.service';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-university-add-edit',
  templateUrl: './university-add-edit.component.html',
  styleUrls: ['./university-add-edit.component.scss']
})
export class UniversityAddEditComponent implements OnInit {
  universityForm: FormGroup;
  isEditMode = false;
  universityId: number | null = null;
  submitted = false;
  submitting = false;
  cities: any[] = [];
  
  // For section navigation
  currentSection = 'basic';
  
  // For image previews
  coverImagePreview: string | null = null;
  thumbnailImagePreview: string | null = null;
  logoPreview: string | null = null;
  
  @ViewChild('coverImageInput') coverImageInput: ElementRef;
  @ViewChild('thumbnailImageInput') thumbnailImageInput: ElementRef;
  @ViewChild('logoInput') logoInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private universityService: UniversityService,
    private cityService: CityService
  ) {
    this.universityForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCities();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.universityId = +id;
      this.loadUniversity(this.universityId);
    }
    
    // Setup scroll observer to update active section
    this.setupScrollObserver();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: ['', Validators.required],
      coverImage: [null],
      coverImageUrl: [''],
      thumbnailImage: [null],
      thumbnailImageUrl: [''],
      cityId: ['', Validators.required],
      type: ['', Validators.required],
      logo: [null],
      logoUrl: [''],
      studentCount: [0],
      internationalStudentCount: [0],
      professorCount: [0],
      associateProfessorCount: [0],
      assistantProfessorCount: [0],
      lecturerCount: [0],
      researchAssistantCount: [0],
      vocationalSchoolCount: [0],
      foundedYear: [null],
      scholarshipPercentage: [0],
      turkeyRanking: [null],
      urapRanking: [null],
      averageTuition: [0],
      whatsapp1: [''],
      whatsapp2: [''],
      whatsapp3: [''],
      whatsapp4: [''],
      hasErasmus: [false],
      isResearchUniversity: [false],
      isActive: [true],
      isImportant: [false],
      isPopular: [false]
    });
  }

  // Helper to access form controls easily in the template
  get f() { 
    return this.universityForm.controls; 
  }
  
  // Setup scroll observer to update active section
  setupScrollObserver() {
    const sections = ['basic', 'content', 'stats', 'contact', 'other'];
    
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
  
  // Image handling methods
  onCoverImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.universityForm.patchValue({ coverImage: file });
      
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
      this.universityForm.patchValue({ thumbnailImage: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailImagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }
  
  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.universityForm.patchValue({ logo: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }
  
  removeCoverImage() {
    this.universityForm.patchValue({ 
      coverImage: null,
      coverImageUrl: '' 
    });
    this.coverImagePreview = null;
    if (this.coverImageInput) {
      this.coverImageInput.nativeElement.value = '';
    }
  }
  
  removeThumbnailImage() {
    this.universityForm.patchValue({ 
      thumbnailImage: null,
      thumbnailImageUrl: '' 
    });
    this.thumbnailImagePreview = null;
    if (this.thumbnailImageInput) {
      this.thumbnailImageInput.nativeElement.value = '';
    }
  }
  
  removeLogo() {
    this.universityForm.patchValue({ 
      logo: null,
      logoUrl: '' 
    });
    this.logoPreview = null;
    if (this.logoInput) {
      this.logoInput.nativeElement.value = '';
    }
  }
  
  // Form submission methods
  saveUniversityForm() {
    this.saveUniversity();
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

  loadUniversity(id: number): void {
    this.universityService.getUniversity(id).subscribe(
      (data: any) => {
        // Update form with university data
        this.universityForm.patchValue({
          name: data.name,
          slug: data.slug,
          description: data.description,
          coverImageUrl: data.coverImageUrl,
          thumbnailImageUrl: data.thumbnailImageUrl,
          cityId: data.cityId,
          type: data.type,
          logoUrl: data.logoUrl,
          studentCount: data.studentCount,
          internationalStudentCount: data.internationalStudentCount,
          professorCount: data.professorCount,
          associateProfessorCount: data.associateProfessorCount,
          assistantProfessorCount: data.assistantProfessorCount,
          lecturerCount: data.lecturerCount,
          researchAssistantCount: data.researchAssistantCount,
          vocationalSchoolCount: data.vocationalSchoolCount,
          foundedYear: data.foundedYear,
          scholarshipPercentage: data.scholarshipPercentage,
          turkeyRanking: data.turkeyRanking,
          urapRanking: data.urapRanking,
          averageTuition: data.averageTuition,
          whatsapp1: data.whatsapp1,
          whatsapp2: data.whatsapp2,
          whatsapp3: data.whatsapp3,
          whatsapp4: data.whatsapp4,
          hasErasmus: data.hasErasmus,
          isResearchUniversity: data.isResearchUniversity,
          isActive: data.isActive,
          isImportant: data.isImportant,
          isPopular: data.isPopular
        });
      },
      (error) => {
        console.error('Error loading university:', error);
      }
    );
  }

  saveUniversity(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.universityForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    const formData = new FormData();
    
    // Append all form values to FormData
    Object.keys(this.universityForm.value).forEach(key => {
      // Skip file fields that need special handling
      if (key !== 'coverImage' && key !== 'thumbnailImage' && key !== 'logo' && 
          !key.endsWith('Url')) {
        formData.append(key, this.universityForm.value[key]);
      }
    });
    
    // Append files if they exist
    if (this.universityForm.value.coverImage) {
      formData.append('coverImage', this.universityForm.value.coverImage);
    }
    
    if (this.universityForm.value.thumbnailImage) {
      formData.append('thumbnailImage', this.universityForm.value.thumbnailImage);
    }
    
    if (this.universityForm.value.logo) {
      formData.append('logo', this.universityForm.value.logo);
    }
    
    if (this.isEditMode && this.universityId) {
      // Update existing university
      this.universityService.updateUniversity(this.universityId, formData).subscribe(
        () => {
          this.router.navigate(['/admin/universities']);
        },
        (error) => {
          console.error('Error updating university:', error);
          this.submitting = false;
        }
      );
    } else {
      // Create new university
      this.universityService.createUniversity(formData).subscribe(
        () => {
          this.router.navigate(['/admin/universities']);
        },
        (error) => {
          console.error('Error creating university:', error);
          this.submitting = false;
        }
      );
    }
  }
}