// src/app/features/static-pages/terms/terms.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['../static-pages-shared.scss', './terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Sayfa başlığını güncelle
    document.title = 'Kullanım Koşulları | Üniversite Rehberi';
  }
}