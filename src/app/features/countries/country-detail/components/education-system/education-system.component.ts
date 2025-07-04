// src/app/features/countries/country-detail/components/education-system/education-system.component.ts
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
  selector: 'app-country-education-system',
  templateUrl: './education-system.component.html',
  styleUrls: ['./education-system.component.scss']
})
export class CountryEducationSystemComponent implements OnInit {
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