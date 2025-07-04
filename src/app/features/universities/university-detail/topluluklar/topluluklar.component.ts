import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-topluluklar',
  templateUrl: './topluluklar.component.html',
  styleUrls: ['./topluluklar.component.scss']
})
export class TopluluklarComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }

  getClubCategories() {
    return [
      {
        category: 'Akademik Kulüpler',
        icon: 'fas fa-graduation-cap',
        clubs: [
          'Bilgisayar Mühendisliği Kulübü',
          'İktisat Kulübü',
          'Hukuk Kulübü',
          'Tıp Öğrencileri Derneği',
          'Mimar Öğrenciler Topluluğu'
        ]
      },
      {
        category: 'Sanat ve Kültür',
        icon: 'fas fa-palette',
        clubs: [
          'Müzik Kulübü',
          'Dans Topluluğu',
          'Tiyatro Kulübü',
          'Fotoğrafçılık Kulübü',
          'Edebiyat Kulübü'
        ]
      },
      {
        category: 'Spor Kulüpleri',
        icon: 'fas fa-running',
        clubs: [
          'Basketbol Takımı',
          'Futbol Kulübü',
          'Voleybol Takımı',
          'Tenis Kulübü',
          'Yüzme Kulübü'
        ]
      },
      {
        category: 'Sosyal Sorumluluk',
        icon: 'fas fa-heart',
        clubs: [
          'Çevre Kulübü',
          'Gönüllülük Platformu',
          'Hayvan Hakları Derneği',
          'Sosyal Hizmet Kulübü',
          'Eğitim Gönüllüleri'
        ]
      }
    ];
  }
}