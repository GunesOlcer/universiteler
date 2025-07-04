// src/app/features/countries/country-detail/components/travel-info/travel-info.component.ts
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
  selector: 'app-country-travel-info',
  templateUrl: './travel-info.component.html',
  styleUrls: ['./travel-info.component.scss']
})
export class CountryTravelInfoComponent implements OnInit {
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