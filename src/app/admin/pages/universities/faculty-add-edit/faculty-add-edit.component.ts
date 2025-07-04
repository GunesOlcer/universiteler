// src/app/admin/pages/universities/faculty-add-edit/faculty-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../../../services/faculty.service';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-faculty-add-edit',
  templateUrl: './faculty-add-edit.component.html',
  styleUrls: ['./faculty-add-edit.component.scss']
})
export class FacultyAddEditComponent implements OnInit {
  facultyForm: FormGroup;
  isEditMode = false;
  facultyId: number | null = null;
  submitted = false;
  submitting = false;
  universities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private facultyService: FacultyService,
    private universityService: UniversityService
  ) {
    this.facultyForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUniversities();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.facultyId = +id;
      this.loadFaculty(this.facultyId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      universityId: ['', Validators.required],
      type: ['faculty', Validators.required],
      isActive: [true]
    });
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

  loadFaculty(id: number): void {
    this.facultyService.getFaculty(id).subscribe(
      (data: any) => {
        // Update form with faculty data
        this.facultyForm.patchValue({
          name: data.name,
          universityId: data.universityId,
          type: data.type,
          isActive: data.isActive
        });
      },
      (error) => {
        console.error('Error loading faculty:', error);
      }
    );
  }

  // Helper to access form controls easily in the template
  get f() { 
    return this.facultyForm.controls; 
  }

  saveFaculty(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.facultyForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    if (this.isEditMode && this.facultyId) {
      // Update existing faculty
      this.facultyService.updateFaculty(this.facultyId, this.facultyForm.value).subscribe(
        () => {
          this.router.navigate(['/admin/faculties']);
        },
        (error) => {
          console.error('Error updating faculty:', error);
          this.submitting = false;
        }
      );
    } else {
      // Create new faculty
      this.facultyService.createFaculty(this.facultyForm.value).subscribe(
        () => {
          this.router.navigate(['/admin/faculties']);
        },
        (error) => {
          console.error('Error creating faculty:', error);
          this.submitting = false;
        }
      );
    }
  }
}