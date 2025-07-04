// src/app/features/countries/country-detail/components/sidebar/sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Country } from '../../../../../core/models/country.model';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-country-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class CountrySidebarComponent {
  @Input() country!: Country;
  @Input() activeSection = 'general-info';
  @Output() sectionChange = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    {
      id: 'general-info',
      title: 'Genel Bilgiler',
      icon: 'fas fa-info-circle',
      description: 'Ülke hakkında temel bilgiler'
    },
    {
      id: 'cities',
      title: 'Şehirler',
      icon: 'fas fa-city',
      description: 'Ülkedeki başlıca şehirler'
    },
    {
      id: 'universities',
      title: 'Üniversiteler',
      icon: 'fas fa-university',
      description: 'Ülkedeki üniversiteler'
    },
    {
      id: 'education-system',
      title: 'Eğitim Sistemi',
      icon: 'fas fa-graduation-cap',
      description: 'Eğitim sistemi ve yapısı'
    },
    {
      id: 'culture',
      title: 'Kültür',
      icon: 'fas fa-globe-europe',
      description: 'Kültürel özellikler'
    },
    {
      id: 'travel-info',
      title: 'Seyahat Bilgileri',
      icon: 'fas fa-plane',
      description: 'Vize ve seyahat bilgileri'
    }
  ];

  onMenuClick(sectionId: string): void {
    console.log('🔗 [CountrySidebar] Menu clicked:', sectionId);
    this.sectionChange.emit(sectionId);
  }
}