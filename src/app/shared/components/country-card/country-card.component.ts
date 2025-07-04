// src/app/shared/components/country-card/country-card.component.ts
import { Component, Input } from '@angular/core';
import { Country } from '../../../core/models/country.model';

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.scss']
})
export class CountryCardComponent {
  @Input() country!: Country;

  getFlagUrl(): string {
    // Use country code for flag
    return `https://flagcdn.com/w320/${this.country.code.toLowerCase()}.png`;
  }

  onFlagError(event: any): void {
    // Fallback to default flag if country flag fails to load
    event.target.src = '/assets/images/flags/default-flag.svg';
  }

  onCountryClick(): void {
    console.log('🌍 [CountryCard] Country clicked:', this.country.name, 'ID:', this.country.id);
    console.log('🔗 [CountryCard] Navigating to:', `/ulkeler/${this.country.id}`);
  }
}