// src/app/features/static-pages/cookie-policy/cookie-policy.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['../static-pages-shared.scss', './cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Sayfa başlığını güncelle
    document.title = 'Çerez Politikası | Üniversite Rehberi';
  }
}