import { Component, Input, OnInit } from '@angular/core';
import { University, UniversityType } from '../../../../core/models/university.model';

@Component({
  selector: 'app-is-staj',
  templateUrl: './is-staj.component.html',
  styleUrls: ['./is-staj.component.scss']
})
export class IsStajComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }

  getUniversityTypeAdvantages(): string[] {
    if (!this.university) return [];

    switch(this.university.type) {
      case UniversityType.State:
        return [
          'Kamu kurumlarında staj ve iş imkanları',
          'Geniş mezun ağı ve bağlantılar',
          'Devlet kurumlarında öncelikli istihdam'
        ];
      case UniversityType.Foundation:
        return [
          'Sektörle güçlü bağlantılar',
          'Özel şirketlerde staj imkanları',
          'Endüstri-üniversite işbirlikleri'
        ];
      case UniversityType.Private:
        return [
          'Bireysel kariyer rehberliği',
          'Özel sektörle yakın ilişkiler',
          'Küçük sınıf avantajı ile mentörlük'
        ];
      case UniversityType.KKTC:
        return [
          'Uluslararası iş imkanları',
          'Çok kültürlü çalışma ortamı',
          'Avrupa ve Orta Doğu pazarlarına erişim'
        ];
      default:
        return [];
    }
  }
}