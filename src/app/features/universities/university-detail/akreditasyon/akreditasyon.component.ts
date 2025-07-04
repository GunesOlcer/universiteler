import { Component, Input, OnInit } from '@angular/core';
import { University, UniversityType } from '../../../../core/models/university.model';

@Component({
  selector: 'app-akreditasyon',
  templateUrl: './akreditasyon.component.html',
  styleUrls: ['./akreditasyon.component.scss']
})
export class AkreditasyonComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }

  getAccreditationInfo(): any[] {
    const accreditations = [
      {
        name: 'YÖK',
        fullName: 'Yükseköğretim Kurulu',
        description: 'Türkiye\'de tüm üniversiteler YÖK tarafından akredite edilir',
        type: 'national',
        required: true
      },
      {
        name: 'Bologna',
        fullName: 'Bologna Süreci',
        description: 'Avrupa Yükseköğretim Alanı uyum süreci',
        type: 'international',
        required: false
      }
    ];

    if (this.university?.type === UniversityType.Private || this.university?.type === UniversityType.Foundation) {
      accreditations.push({
        name: 'MÜDEK',
        fullName: 'Mühendislik Eğitim Programları Değerlendirme ve Akreditasyon Derneği',
        description: 'Mühendislik programları için kalite güvencesi',
        type: 'professional',
        required: false
      });
    }

    return accreditations;
  }
}