// src/app/layout/footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  quickLinks = [
    { name: 'Üniversiteler', routerLink: '/universiteler' },
    { name: 'Bölümler', routerLink: '/bolumler' },
    { name: 'Şehirler', routerLink: '/sehirler' },
    { name: 'Yurtlar', routerLink: '/yurtlar' },
    { name: 'Makaleler', routerLink: '/makaleler' },
    { name: 'Tercih Botu', routerLink: '/tercih-botu' }
  ];
  
  categories = [
    { name: 'Devlet Üniversiteleri', routerLink: '/universiteler/devlet' },
    { name: 'Vakıf Üniversiteleri', routerLink: '/universiteler/vakif' },
    { name: 'KKTC Üniversiteleri', routerLink: '/universiteler/kktc' },
    { name: 'Mühendislik Bölümleri', routerLink: '/bolumler/muhendislik' },
    { name: 'Sağlık Bilimleri', routerLink: '/bolumler/saglik' },
    { name: 'Sosyal Bilimler', routerLink: '/bolumler/sosyal' }
  ];
  
  support = [
    { name: 'Hakkımızda', routerLink: '/hakkimizda' },
    { name: 'İletişim', routerLink: '/iletisim' },
    { name: 'SSS', routerLink: '/sss' },
    { name: 'Gizlilik Politikası', routerLink: '/gizlilik-politikasi' },
    { name: 'Kullanım Koşulları', routerLink: '/kullanim-kosullari' },
    { name: 'Çerez Politikası', routerLink: '/cerez-politikasi' }
  ];
}