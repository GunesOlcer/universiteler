import { Component, Input, OnInit } from '@angular/core';
import { University, UniversityType } from '../../../../core/models/university.model';

@Component({
  selector: 'app-genel-bilgi',
  templateUrl: './genel-bilgi.component.html',
  styleUrls: ['./genel-bilgi.component.scss']
})
export class GenelBilgiComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }

  getFormattedDescription(): string {
    if (!this.university?.description) return '';
    return this.university.description.replace(/\n/g, '<br>');
  }

  getTypeDisplayName(): string {
    if (!this.university) return '';
    
    switch(this.university.type) {
      case UniversityType.State: return 'Devlet Üniversitesi';
      case UniversityType.Foundation: return 'Vakıf Üniversitesi';
      case UniversityType.Private: return 'Özel Üniversite';
      case UniversityType.KKTC: return 'KKTC Üniversitesi';
      default: return this.university.typeName || 'Diğer';
    }
  }
}