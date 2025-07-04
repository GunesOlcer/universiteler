// src/app/admin/pages/universities/program-quotas/program-quotas.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';

@Component({
  selector: 'app-program-quotas',
  templateUrl: './program-quotas.component.html',
  styleUrls: ['./program-quotas.component.scss']
})
export class ProgramQuotasComponent implements OnInit {
  programId: number;
  program: any = {};
  quotas: any[] = [
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
    },
    {
      id: 3,
      year: 2021,
      generalQuota: { quota: 90, placed: 90, minScore: 345.10, maxScore: 440.80 },
      schoolFirstQuota: { quota: 9, placed: 9, minScore: 340.25, maxScore: 400.45 },
      earthquakeVictimQuota: { quota: 5, placed: 3, minScore: 315.40, maxScore: 370.30 },
      womenAbove34Quota: { quota: 3, placed: 2, minScore: 310.15, maxScore: 345.20 },
      martyrFamilyQuota: { quota: 2, placed: 1, minScore: 305.30, maxScore: 330.60 }
    }
  ];
  
  showConfirmDialog = false;
  quotaToDelete: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.programId = +this.route.snapshot.paramMap.get('id');
    this.loadProgram();
    // In a real app, you would also load quotas from a service
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

  addQuota(): void {
    this.router.navigate(['/admin/programs/quotas/add', this.programId]);
  }

  editQuota(quota: any): void {
    this.router.navigate(['/admin/programs/quotas/edit', this.programId, quota.id]);
  }

  confirmDeleteQuota(quota: any): void {
    this.quotaToDelete = quota;
    this.showConfirmDialog = true;
  }

  deleteQuota(): void {
    if (this.quotaToDelete) {
      // In a real app, you would call a service to delete the quota
      this.quotas = this.quotas.filter(q => q.id !== this.quotaToDelete.id);
      this.showConfirmDialog = false;
      this.quotaToDelete = null;
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.quotaToDelete = null;
  }
}