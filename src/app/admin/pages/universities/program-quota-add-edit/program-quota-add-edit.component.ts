// src/app/admin/pages/universities/program-quota-add-edit/program-quota-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';

@Component({
  selector: 'app-program-quota-add-edit',
  templateUrl: './program-quota-add-edit.component.html',
  styleUrls: ['./program-quota-add-edit.component.scss']
})
export class ProgramQuotaAddEditComponent implements OnInit {
  programId: number;
  quotaId: number | null = null;
  program: any = {};
  quotaForm: FormGroup;
  isEditMode = false;
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) {
    this.quotaForm = this.createForm();
  }

  ngOnInit(): void {
    this.programId = +this.route.snapshot.paramMap.get('programId');
    const quotaId = this.route.snapshot.paramMap.get('quotaId');
    
    if (quotaId) {
      this.isEditMode = true;
      this.quotaId = +quotaId;
      this.loadQuota();
    }
    
    this.loadProgram();
  }

  createForm(): FormGroup {
    return this.fb.group({
      year: ['', [Validators.required, Validators.min(2000), Validators.max(2100)]],
      generalQuota: this.fb.group({
        quota: [0, [Validators.required, Validators.min(0)]],
        placed: [0, [Validators.required, Validators.min(0)]],
        minScore: [0, [Validators.required, Validators.min(0)]],
        maxScore: [0, [Validators.required, Validators.min(0)]]
      }),
      schoolFirstQuota: this.fb.group({
        quota: [0, [Validators.required, Validators.min(0)]],
        placed: [0, [Validators.required, Validators.min(0)]],
        minScore: [0, [Validators.required, Validators.min(0)]],
        maxScore: [0, [Validators.required, Validators.min(0)]]
      }),
      earthquakeVictimQuota: this.fb.group({
        quota: [0, [Validators.required, Validators.min(0)]],
        placed: [0, [Validators.required, Validators.min(0)]],
        minScore: [0, [Validators.required, Validators.min(0)]],
        maxScore: [0, [Validators.required, Validators.min(0)]]
      }),
      womenAbove34Quota: this.fb.group({
        quota: [0, [Validators.required, Validators.min(0)]],
        placed: [0, [Validators.required, Validators.min(0)]],
        minScore: [0, [Validators.required, Validators.min(0)]],
        maxScore: [0, [Validators.required, Validators.min(0)]]
      }),
      martyrFamilyQuota: this.fb.group({
        quota: [0, [Validators.required, Validators.min(0)]],
        placed: [0, [Validators.required, Validators.min(0)]],
        minScore: [0, [Validators.required, Validators.min(0)]],
        maxScore: [0, [Validators.required, Validators.min(0)]]
      })
    });
  }

  loadProgram(): void {
    this.programService.getProgram(this.programId).subscribe(
      (data: any) => {
        this.program = data;
      },
      (error) => {
        console.error('Error loading program:', error);
      }
    );
  }

  loadQuota(): void {
    if (this.quotaId) {
      // In a real app, you would call a service to get the quota
      // For now, we'll use mock data
      const mockQuotas = [
        {
          id: 1,
          year: 2023,
          generalQuota: { quota: 100, placed: 100, minScore: 350.45, maxScore: 450.32 },
          schoolFirstQuota: { quota: 10, placed: 10, minScore: 345.12, maxScore: 410.25 },
          earthquakeVictimQuota: { quota: 5, placed: 5, minScore: 320.18, maxScore: 380.42 },
          womenAbove34Quota: { quota: 3, placed: 3, minScore: 315.75, maxScore: 355.40 },
          martyrFamilyQuota: { quota: 2, placed: 2, minScore: 310.60, maxScore: 340.80 }
        },
        {
          id: 2,
          year: 2022,
          generalQuota: { quota: 95, placed: 95, minScore: 348.30, maxScore: 445.20 },
          schoolFirstQuota: { quota: 10, placed: 10, minScore: 342.15, maxScore: 405.35 },
          earthquakeVictimQuota: { quota: 5, placed: 4, minScore: 318.20, maxScore: 375.50 },
          womenAbove34Quota: { quota: 3, placed: 3, minScore: 312.80, maxScore: 350.60 },
          martyrFamilyQuota: { quota: 2, placed: 2, minScore: 308.40, maxScore: 335.75 }
        }
      ];
      
      const quota = mockQuotas.find(q => q.id === this.quotaId);
      
      if (quota) {
        this.quotaForm.patchValue(quota);
      }
    }
  }

  // Helper to access form controls easily in the template
  get f() {
    return this.quotaForm.controls;
  }

  get generalQuota() {
    return this.quotaForm.get('generalQuota') as FormGroup;
  }

  get schoolFirstQuota() {
    return this.quotaForm.get('schoolFirstQuota') as FormGroup;
  }

  get earthquakeVictimQuota() {
    return this.quotaForm.get('earthquakeVictimQuota') as FormGroup;
  }

  get womenAbove34Quota() {
    return this.quotaForm.get('womenAbove34Quota') as FormGroup;
  }

  get martyrFamilyQuota() {
    return this.quotaForm.get('martyrFamilyQuota') as FormGroup;
  }

  saveQuota(): void {
    this.submitted = true;
    
    if (this.quotaForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    // In a real app, you would call a service to save the changes
    setTimeout(() => {
      this.submitting = false;
      this.router.navigate(['/admin/programs/quotas', this.programId]);
    }, 1000);
  }
}