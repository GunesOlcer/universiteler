// src/app/features/departments/department-detail/content/genel-bilgi/genel-bilgi.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Department } from '../../../../../core/models/department.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-genel-bilgi',
  templateUrl: './genel-bilgi.component.html',
  styleUrls: ['./genel-bilgi.component.scss']
})
export class GenelBilgiComponent implements OnInit {
  @Input() department: Department | null = null;
  formattedDescription: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.formatContent();
  }

  private formatContent(): void {
    if (this.department?.description) {
      let formatted = this.department.description
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
      
      formatted = '<p>' + formatted + '</p>';
      
      // Format headers
      formatted = formatted.replace(/([A-Za-zğüşıöçĞÜŞİÖÇ\s]{5,50}):(\s|<\/p>|<br>)/g, '<h3>$1:</h3>');
      
      // Format lists
      formatted = formatted.replace(/<p>(\s*[-*•]\s*)(.*?)<\/p>/g, '<ul><li>$2</li></ul>');
      formatted = formatted.replace(/<\/ul>\s*<ul>/g, '');
      
      this.formattedDescription = this.sanitizer.bypassSecurityTrustHtml(formatted);
    }
  }

  formatSalary(salary?: number): string {
    if (!salary) return '';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(salary);
  }
}