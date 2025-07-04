// src/app/features/static-pages/about/about.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../static-pages-shared.scss', './about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Sayfa başlığını güncelle
    document.title = 'Hakkımızda | Üniversite Rehberi';
  }
}