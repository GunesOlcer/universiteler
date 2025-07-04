import { Component, Input, OnInit } from '@angular/core';
import { University, UniversityType } from '../../../../core/models/university.model';

@Component({
  selector: 'app-egitim-sistemi',
  templateUrl: './egitim-sistemi.component.html',
  styleUrls: ['./egitim-sistemi.component.scss']
})
export class EgitimSistemiComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }

  getEducationFeatures(): string[] {
    const features = [
      'Bologna sürecine uygun eğitim sistemi',
      'Uluslararası standartlarda müfredat',
      'Teorik ve pratik eğitim dengesi',
      'AKTS (Avrupa Kredi Transfer Sistemi)',
      'Kalite güvence sistemleri'
    ];

    if (this.university?.hasInternationalPrograms) {
      features.push('Uluslararası değişim programları');
    }

    return features;
  }
}