// src/app/features/static-pages/privacy/privacy.component.ts
import { Component, OnInit } from '@angular/core';

// Update each component to include the shared styles
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['../static-pages-shared.scss', '../static-pages-shared.scss', './privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Sayfa başlığını güncelle
    document.title = 'Gizlilik Politikası | Üniversite Rehberi';
  }
}