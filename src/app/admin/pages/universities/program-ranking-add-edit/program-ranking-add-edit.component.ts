// src/app/admin/pages/universities/program-ranking-add-edit/program-ranking-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';

@Component({
  selector: 'app-program-ranking-add-edit',
  templateUrl: './program-ranking-add-edit.component.html',
  styleUrls: ['./program-ranking-add-edit.component.scss']
})
export class ProgramRankingAddEditComponent implements OnInit {
  programId: number;
  rankingId: number | null = null;
  program: any = {};
  rankingForm: FormGroup;
  isEditMode = false;
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) {
    this.rankingForm = this.createForm();
  }

  ngOnInit(): void {
    this.programId = +this.route.snapshot.paramMap.get('programId');
    const rankingId = this.route.snapshot.paramMap.get('rankingId');
    
    if (rankingId) {
      this.isEditMode = true;
      this.rankingId = +rankingId;
      this.loadRanking(this.rankingId);
    }
    
    this.loadProgram();
  }

  createForm(): FormGroup {
    return this.fb.group({
      year: ['', [Validators.required, Validators.min(2000), Validators.max(2100)]],
      rank: ['', [Validators.required, Validators.min(1)]],
      minScore: ['', [Validators.required, Validators.min(0)]],
      maxScore: ['', [Validators.required, Validators.min(0)]]
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

  loadRanking(id: number): void {
    // In a real app, you would call a service to get the ranking data
    // For now, we'll use mock data
    const mockRankings = [
      { id: 1, year: 2023, rank: 15000, minScore: 410.25, maxScore: 450.75 },
      { id: 2, year: 2022, rank: 17500, minScore: 400.80, maxScore: 445.60 },
      { id: 3, year: 2021, rank: 20000, minScore: 395.50, maxScore: 440.25 }
    ];
    
    const ranking = mockRankings.find(r => r.id === id);
    
    if (ranking) {
      this.rankingForm.patchValue({
        year: ranking.year,
        rank: ranking.rank,
        minScore: ranking.minScore,
        maxScore: ranking.maxScore
      });
    }
  }

  // Helper to access form controls easily in the template
  get f() {
    return this.rankingForm.controls;
  }

  saveRanking(): void {
    this.submitted = true;
    
    if (this.rankingForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    // In a real app, you would call a service to save the data
    const formData = this.rankingForm.value;
    
    // Add validation to ensure maxScore is greater than or equal to minScore
    if (formData.maxScore < formData.minScore) {
      this.f.maxScore.setErrors({ lessThanMin: true });
      this.submitting = false;
      return;
    }
    
    setTimeout(() => {
      this.submitting = false;
      this.router.navigate(['/admin/programs/rankings', this.programId]);
    }, 1000);
  }
}