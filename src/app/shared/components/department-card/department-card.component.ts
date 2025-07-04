// src/app/shared/components/department-card/department-card.component.ts
import { Component, Input } from '@angular/core';
import { Department } from '../../../core/models/department.model';
import { DepartmentService } from '../../../core/services/department.service';
import { Status, getStatusName } from '../../../core/models/base.model';

@Component({
  selector: 'app-department-card',
  templateUrl: './department-card.component.html',
  styleUrls: ['./department-card.component.scss']
})
export class DepartmentCardComponent {
  @Input() department!: Department;

  constructor(private departmentService: DepartmentService) {}

  getDepartmentImageUrl(): string {
    return this.departmentService.getDepartmentImageUrl(this.department.imagePath);
  }

  formatSalary(salary?: number): string {
    if (!salary) return '';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(salary);
  }

  getStatusName(status: Status): string {
    return getStatusName(status);
  }

  formatNumber(num?: number): string {
    if (!num) return '';
    return new Intl.NumberFormat('tr-TR').format(num);
  }

  truncateText(text: string, maxLength: number = 120): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getEducationYearsText(years?: number): string {
    if (!years) return '';
    return `${years} ${years === 1 ? 'Yıl' : 'Yıl'}`;
  }

  hasBasicInfo(): boolean {
    return !!(this.department.averageEducationYears || 
              this.department.averageSalary || 
              this.department.hasEnglishProgram);
  }

  getCardClasses(): string {
    const classes = ['department-card'];
    
    if (this.department.status === Status.Active) {
      classes.push('status-active');
    } else if (this.department.status === Status.Passive) {
      classes.push('status-inactive');
    } else if (this.department.status === Status.Pending) {
      classes.push('status-pending');
    }

    return classes.join(' ');
  }
}