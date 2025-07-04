import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dormitory } from '../../../core/models/dormitory.model';
import { DormitoryService } from '../../../core/services/dormitory.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dormitory-detail',
  templateUrl: './dormitory-detail.component.html',
  styleUrls: ['./dormitory-detail.component.scss']
})
export class DormitoryDetailComponent implements OnInit {
  dormitory: Dormitory | null = null;
  isLoading = false;
  activeSection = 'genel-bilgi';

  constructor(
    private route: ActivatedRoute,
    private dormitoryService: DormitoryService
  ) {}

  ngOnInit(): void {
    this.loadDormitory();
  }

  loadDormitory(): void {
    this.isLoading = true;
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    
    this.dormitoryService.getById(id)
      .subscribe({
        next: (data) => {
          this.dormitory = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dormitory', error);
          this.dormitory = null;
          this.isLoading = false;
        }
      });
  }

  onSectionChange(sectionId: string): void {
    this.activeSection = sectionId;
  }

  getImageUrl(): string {
    if (this.dormitory?.imagePath) {
      if (this.dormitory.imagePath.startsWith('http')) {
        return this.dormitory.imagePath;
      }
      return `${environment.apiUrl}/${this.dormitory.imagePath}`;
    }
    return 'assets/images/dormitories/default.jpg';
  }
}