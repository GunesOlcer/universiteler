// src/app/features/countries/country-detail/components/general-info/general-info.component.ts
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
  selector: 'app-country-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class CountryGeneralInfoComponent implements OnInit {
  @Input() country!: Country;
  @Input() menuContent: CountryMenu | undefined;

  ngOnInit(): void {}

  hasContent(): boolean {
    return !!(this.country?.description || this.menuContent?.content);
  }

  getContent(): string {
    if (this.menuContent?.content) {
      return this.menuContent.content;
    }
    return this.country?.description || '';
  }
}