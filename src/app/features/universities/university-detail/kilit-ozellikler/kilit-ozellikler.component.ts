import { Component, Input, OnInit } from '@angular/core';
import { University, UniversityType } from '../../../../core/models/university.model';

@Component({
  selector: 'app-kilit-ozellikler',
  templateUrl: './kilit-ozellikler.component.html',
  styleUrls: ['./kilit-ozellikler.component.scss']
})
export class KilitOzelliklerComponent implements OnInit {
  @Input() university: University | undefined;
  features: string[] = [];

  ngOnInit(): void {
    this.processKeyFeatures();
  }

  private processKeyFeatures(): void {
    this.features = [];
    
    if (this.university) {
      if (this.university.hasLibrary) {
        this.features.push('Modern kütüphane ve çalışma alanları');
      }
      if (this.university.hasSportsFacility) {
        this.features.push('Spor tesisleri ve aktivite alanları');
      }
      if (this.university.hasDormitory) {
        this.features.push('Öğrenci yurtları ve konaklama imkanları');
      }
      if (this.university.hasInternationalPrograms) {
        this.features.push('Uluslararası değişim programları');
      }
      if (this.university.hasScholarship) {
        this.features.push('Burs ve finansal destek programları');
      }

      switch (this.university.type) {
        case UniversityType.State: 
          this.features.push('Devlet üniversitesi avantajları');
          this.features.push('Uygun maliyetli eğitim');
          break;
        case UniversityType.Foundation: 
          this.features.push('Vakıf üniversitesi kalitesi');
          this.features.push('Sektörle güçlü bağlantılar');
          break;
        case UniversityType.Private: 
          this.features.push('Özel eğitim kalitesi');
          this.features.push('Küçük sınıf mevcutları');
          break;
        case UniversityType.KKTC:
          this.features.push('KKTC eğitim sistemi avantajları');
          this.features.push('Uluslararası tanınırlık');
          break;
      }

      if (this.university.ranking && this.university.ranking <= 100) {
        this.features.push('Türkiye\'nin en iyi üniversiteleri arasında');
      }

      if (this.university.studentCount && this.university.studentCount > 20000) {
        this.features.push('Geniş öğrenci topluluğu ve sosyal çevre');
      }
    }
  }
}