// src/app/admin/pages/universities/program-rankings/program-rankings.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';

@Component({
  selector: 'app-program-rankings',
  templateUrl: './program-rankings.component.html',
  styleUrls: ['./program-rankings.component.scss']
})
export class ProgramRankingsComponent implements OnInit {
  programId: number;
  program: any = {};
  rankings: any[] = [
    { id: 1, year: 2023, rank: 15000, minScore: 410.25, maxScore: 450.75 },
    { id: 2, year: 2022, rank: 17500, minScore: 400.80, maxScore: 445.60 },
    { id: 3, year: 2021, rank: 20000, minScore: 395.50, maxScore: 440.25 }
  ];
  
  showConfirmDialog = false;
  rankingToDelete: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.programId = +this.route.snapshot.paramMap.get('id');
    this.loadProgram();
    this.loadRankings();
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

  loadRankings(): void {
    // In a real app, you would call a service to get the rankings
    // For now, we'll use the mock data defined above
    console.log('Loading rankings for program ID:', this.programId);
  }
  
  addRanking(): void {
    this.router.navigate(['/admin/programs/rankings/add', this.programId]);
  }
  
  editRanking(ranking: any): void {
    this.router.navigate(['/admin/programs/rankings/edit', this.programId, ranking.id]);
  }
  
  confirmDeleteRanking(ranking: any): void {
    this.rankingToDelete = ranking;
    this.showConfirmDialog = true;
  }
  
  deleteRanking(): void {
    if (this.rankingToDelete) {
      // In a real app, you would call a service to delete the ranking
      this.rankings = this.rankings.filter(r => r.id !== this.rankingToDelete.id);
      this.showConfirmDialog = false;
      this.rankingToDelete = null;
    }
  }
  
  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.rankingToDelete = null;
  }
}