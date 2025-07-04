// src/app/admin/pages/universities/program-add-edit/program-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';
import { FacultyService } from '../../../services/faculty.service';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-program-add-edit',
  templateUrl: './program-add-edit.component.html',
  styleUrls: ['./program-add-edit.component.scss']
})
export class ProgramAddEditComponent implements OnInit {
  programForm: FormGroup;
  isEditMode = false;
  programId: number | null = null;
  faculties: any[] = [];
  departments: any[] = [];
  submitted = false;
  submitting = false;
  
  // For section navigation
  currentSection = 'basic';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService,
    private facultyService: FacultyService,
    private departmentService: DepartmentService
  ) {
    this.programForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFaculties();
    this.loadDepartments();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.programId = +id;
      this.loadProgram(this.programId);
    } else {
      // Check if there's a facultyId in query params (for pre-selecting faculty)
      this.route.queryParams.subscribe(params => {
        if (params.facultyId) {
          this.programForm.patchValue({
            facultyId: params.facultyId
          });
        }
      });
    }
    
    // Setup scroll observer to update active section
    this.setupScrollObserver();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      facultyId: ['', Validators.required],
      departmentId: ['', Validators.required],
      language: ['Türkçe', Validators.required],
      fee: [0, [Validators.required, Validators.min(0)]],
      educationType: ['Örgün', Validators.required],
      scoreType: ['', Validators.required],
      duration: [4, [Validators.required, Validators.min(1), Validators.max(8)]],
      quota: [0, [Validators.required, Validators.min(0)]],
      specialConditions: [''],
      isActive: [true]
    });
  }

  // Setup scroll observer to update active section
  setupScrollObserver() {
    const sections = ['basic', 'education', 'other'];
    
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

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe(
      (data: any) => {
        this.faculties = data.items;
      },
      (error) => {
        console.error('Error loading faculties:', error);
      }
    );
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (data: any) => {
        this.departments = data.items;
      },
      (error) => {
        console.error('Error loading departments:', error);
      }
    );
  }

  loadProgram(id: number): void {
    this.programService.getProgram(id).subscribe(
      (data: any) => {
        this.programForm.patchValue({
          name: data.name,
          facultyId: data.facultyId,
          departmentId: data.departmentId,
          language: data.language,
          fee: data.fee,
          educationType: data.educationType,
          scoreType: data.scoreType,
          duration: data.duration,
          quota: data.quota,
          specialConditions: data.specialConditions,
          isActive: data.isActive
        });
      },
      (error) => {
        console.error('Error loading program:', error);
      }
    );
  }

  // Helper to access form controls easily in the template
  get f() { 
    return this.programForm.controls; 
  }

  saveProgram(): void {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.programForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    if (this.isEditMode && this.programId) {
      // Update existing program
      this.programService.updateProgram(this.programId, this.programForm.value).subscribe(
        () => {
          this.router.navigate(['/admin/programs'], {
            queryParams: { facultyId: this.programForm.value.facultyId }
          });
        },
        (error) => {
          console.error('Error updating program:', error);
          this.submitting = false;
        }
      );
    } else {
      // Create new program
      this.programService.createProgram(this.programForm.value).subscribe(
        () => {
          this.router.navigate(['/admin/programs'], {
            queryParams: { facultyId: this.programForm.value.facultyId }
          });
        },
        (error) => {
          console.error('Error creating program:', error);
          this.submitting = false;
        }
      );
    }
  }
}