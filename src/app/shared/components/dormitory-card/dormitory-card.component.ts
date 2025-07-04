import { Component, Input } from '@angular/core';
import { Dormitory, DormitoryType, GenderType } from '../../../core/models/dormitory.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dormitory-card',
  templateUrl: './dormitory-card.component.html',
  styleUrls: ['./dormitory-card.component.scss']
})
export class DormitoryCardComponent {
  @Input() dormitory!: Dormitory;

  getImageUrl(): string {
    if (this.dormitory.imagePath) {
      if (this.dormitory.imagePath.startsWith('http')) {
        return this.dormitory.imagePath;
      }
      return `${environment.apiUrl}/${this.dormitory.imagePath}`;
    }
    return 'assets/images/dormitories/default.jpg';
  }

  getTypeClass(): string {
    switch (this.dormitory.type) {
      case DormitoryType.State: return 'state';
      case DormitoryType.Private: return 'private';
      case DormitoryType.University: return 'university';
      default: return '';
    }
  }

  getGenderClass(): string {
    switch (this.dormitory.gender) {
      case GenderType.Male: return 'male';
      case GenderType.Female: return 'female';
      case GenderType.Mixed: return 'mixed';
      default: return '';
    }
  }

  getFeatureIcon(icon?: string): string {
    if (icon) {
      return icon.startsWith('fa-') ? icon : `fa-${icon}`;
    }
    return 'fa-check';
  }
}