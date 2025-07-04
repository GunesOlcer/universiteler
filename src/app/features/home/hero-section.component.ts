// src/app/features/home/hero-section.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  searchTerm = '';
  searchType = 'universities';
  
  searchOptions = [
    { label: 'Üniversite', value: 'universities', routerLink: '/universiteler', placeholder: 'Üniversite ara...' },
    { label: 'Bölüm', value: 'departments', routerLink: '/bolumler', placeholder: 'Bölüm ara...' },
    { label: 'Şehir', value: 'cities', routerLink: '/sehirler', placeholder: 'Şehir ara...' },
    { label: 'Yurt', value: 'dormitories', routerLink: '/yurtlar', placeholder: 'Yurt ara...' }
  ];
  
  constructor(private router: Router) {}
  
  setSearchType(type: string) {
    this.searchType = type;
  }
  
  get currentSearchOption() {
    return this.searchOptions.find(option => option.value === this.searchType);
  }
  
  onSearch() {
    if (this.searchTerm.trim()) {
      const option = this.currentSearchOption;
      if (option) {
        this.router.navigate([option.routerLink], { queryParams: { search: this.searchTerm } });
      }
    }
  }
}