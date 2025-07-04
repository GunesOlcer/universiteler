// src/app/features/countries/country-detail/components/culture/culture.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Country } from '../../../../../core/models/country.model';

interface CountryMenu {
  id: number;
  countryId: number;
  title: string;
  content: string;
  order: number;
  isVisible: boolean;
  status: number;
  createdDate: Date;
  updatedDate?: Date;
}

@Component({
  selector: 'app-country-culture',
  templateUrl: './culture.component.html',
  styleUrls: ['./culture.component.scss']
})
export class CountryCultureComponent implements OnInit {
  @Input() country!: Country;
  @Input() menuContent: CountryMenu | undefined;

  ngOnInit(): void {}

  hasContent(): boolean {
    return !!(this.menuContent?.content);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }
}