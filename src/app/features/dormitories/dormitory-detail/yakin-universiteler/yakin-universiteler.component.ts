import { Component, Input, OnInit } from '@angular/core';
import { Dormitory } from '../../../../core/models/dormitory.model';
import { University, UniversityType } from '../../../../core/models/university.model';
import { UniversityService } from '../../../../core/services/university.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-yakin-universiteler',
  templateUrl: './yakin-universiteler.component.html',
  styleUrls: ['./yakin-universiteler.component.scss']
})
export class YakinUniversitelerComponent implements OnInit {
  @Input() dormitory: Dormitory | null = null;
  nearbyUniversities: University[] = [];
  isLoading = false;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.loadNearbyUniversities();
  }

  private loadNearbyUniversities(): void {
    if (!this.dormitory?.cityId) return;

    this.isLoading = true;
    this.universityService.getByCityId(this.dormitory.cityId)
      .subscribe({
        next: (universities) => {
          this.nearbyUniversities = universities;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading nearby universities', error);
          this.isLoading = false;
        }
      });
  }

  getUniversityImageUrl(university: University): string {
    if (university.logoPath) {
      if (university.logoPath.startsWith('http')) {
        return university.logoPath;
      }
      return `${environment.apiUrl}/${university.logoPath}`;
    }
    if (university.coverImagePath) {
      if (university.coverImagePath.startsWith('http')) {
        return university.coverImagePath;
      }
      return `${environment.apiUrl}/${university.coverImagePath}`;
    }
    return 'assets/images/universities/default.jpg';
  }

  getUniversityTypeClass(type: UniversityType): string {
    switch (type) {
      case UniversityType.State: return 'state';
      case UniversityType.Foundation: return 'foundation';
      case UniversityType.Private: return 'private';
      case UniversityType.KKTC: return 'kktc';
      default: return '';
    }
  }

  getUniversityTypeName(type: UniversityType): string {
    switch (type) {
      case UniversityType.State: return 'Devlet';
      case UniversityType.Foundation: return 'Vakıf';
      case UniversityType.Private: return 'Özel';
      case UniversityType.KKTC: return 'KKTC';
      default: return 'Bilinmiyor';
    }
  }
}