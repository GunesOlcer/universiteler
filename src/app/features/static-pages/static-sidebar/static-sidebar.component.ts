// src/app/features/static-pages/static-sidebar/static-sidebar.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-static-sidebar',
  templateUrl: './static-sidebar.component.html',
  styleUrls: ['./static-sidebar.component.scss']
})
export class StaticSidebarComponent {
  @Input() currentPage: string = '';

  staticPages = [
    { name: 'Hakkımızda', path: '/hakkimizda', icon: 'fa-info-circle' },
    { name: 'Sık Sorulan Sorular', path: '/sss', icon: 'fa-question-circle' },
    { name: 'Gizlilik Politikası', path: '/gizlilik-politikasi', icon: 'fa-user-shield' },
    { name: 'Kullanım Koşulları', path: '/kullanim-kosullari', icon: 'fa-file-contract' },
    { name: 'Çerez Politikası', path: '/cerez-politikasi', icon: 'fa-cookie-bite' },
    { name: 'İletişim', path: '/iletisim', icon: 'fa-envelope' }
  ];
}