// src/app/features/countries/country-detail/components/cities/cities.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Country } from '../../../../../core/models/country.model';
import { City } from '../../../../../core/models/city.model';
import { CityService } from '../../../../../core/services/city.service';

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
  selector: 'app-country-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CountryCitiesComponent implements OnInit, OnDestroy {
  @Input() country!: Country;
  @Input() menuContent: CountryMenu | undefined;
  
  cities: City[] = [];
  isLoading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private cityService: CityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCountryCities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasContent(): boolean {
    return !!(this.menuContent?.content || this.cities.length > 0);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }

  private loadCountryCities(): void {
    this.isLoading = true;
    this.error = null;

    this.cityService.getAll().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (allCities) => {
        this.cities = allCities.filter(city => 
          city.countryName === this.country.name
        ).slice(0, 6); // İlk 6 şehri göster
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.error = 'Şehirler yüklenirken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  navigateToCities(): void {
    this.router.navigate(['/sehirler'], { 
      queryParams: { countryName: this.country.name } 
    });
  }

  navigateToCityDetail(city: City): void {
    this.router.navigate(['/sehirler', city.id]);
  }

  trackByCityId(index: number, city: City): number {
    return city.id;
  }
}