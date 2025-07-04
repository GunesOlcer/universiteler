import { Component, Input, OnInit } from '@angular/core';
import { University, UniversityType } from '../../../../core/models/university.model';
import { UniversityService } from '../../../../core/services/university.service';

@Component({
  selector: 'app-nearby-universities',
  templateUrl: './nearby-universities.component.html',
  styleUrls: ['./nearby-universities.component.scss']
})
export class NearbyUniversitiesComponent implements OnInit {
  @Input() university: University | undefined;
  nearbyUniversities: University[] = [];
  isLoading = false;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.loadNearbyUniversities();
  }

  loadNearbyUniversities(): void {
    if (!this.university) return;

    this.isLoading = true;
    
    const filterRequest = {
      pagination: { pageNumber: 1, pageSize: 5 },
      cityId: this.university.cityId
    };

    this.universityService.filter(filterRequest).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.nearbyUniversities = response.data.data
            .filter(u => u.id !== this.university?.id)
            .slice(0, 3);
        } else {
          this.nearbyUniversities = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading nearby universities:', error);
        this.nearbyUniversities = [];
        this.isLoading = false;
      }
    });
  }

  getImageUrl(university: University): string {
    return university.thumbnailPath || university.logoPath || 'assets/images/universities/default-university.jpg';
  }

  getTypeLabel(type: UniversityType): string {
    switch(type) {
      case UniversityType.State: return 'Devlet';
      case UniversityType.Foundation: return 'Vakıf';
      case UniversityType.Private: return 'Özel';
      case UniversityType.KKTC: return 'KKTC';
      default: return 'Diğer';
    }
  }
}