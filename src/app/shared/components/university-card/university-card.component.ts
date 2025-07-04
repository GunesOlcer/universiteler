import { Component, Input } from '@angular/core';
import { University, UniversityType } from '../../../core/models/university.model';

@Component({
  selector: 'app-university-card',
  templateUrl: './university-card.component.html',
  styleUrls: ['./university-card.component.scss']
})
export class UniversityCardComponent {
  @Input() university!: University;

  getImageUrl(): string {
    return this.university.thumbnailPath || 
           this.university.coverImagePath || 
           this.university.logoPath || 
           'assets/images/universities/default-university.jpg';
  }

  getTypeLabel(): string {
    switch(this.university.type) {
      case UniversityType.State: return 'Devlet';
      case UniversityType.Foundation: return 'Vakıf';
      case UniversityType.Private: return 'Özel';
      case UniversityType.KKTC: return 'KKTC';
      default: return this.university.typeName || 'Diğer';
    }
  }

  getTypeCssClass(): string {
    switch(this.university.type) {
      case UniversityType.State: return 'state';
      case UniversityType.Foundation: return 'foundation';
      case UniversityType.Private: return 'private';
      case UniversityType.KKTC: return 'kktc';
      default: return 'other';
    }
  }
}