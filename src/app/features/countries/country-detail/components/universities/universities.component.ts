// src/app/features/countries/country-detail/components/universities/universities.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Country } from '../../../../../core/models/country.model';
import { University } from '../../../../../core/models/university.model';
import { UniversityService } from '../../../../../core/services/university.service';

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
  selector: 'app-country-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class CountryUniversitiesComponent implements OnInit, OnDestroy {
  @Input() country!: Country;
  @Input() menuContent: CountryMenu | undefined;
  
  universities: University[] = [];
  isLoading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private universityService: UniversityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCountryUniversities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasContent(): boolean {
    return !!(this.menuContent?.content || this.universities.length > 0);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }

  private loadCountryUniversities(): void {
    this.isLoading = true;
    this.error = null;

    this.universityService.getAll().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (allUniversities) => {
        this.universities = allUniversities.filter(university => 
          university.countryName === this.country.name
        ).slice(0, 3); // İlk 3 üniversiteyi göster
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading universities:', error);
        this.error = 'Üniversiteler yüklenirken hata oluştu';
        this.isLoading = false;
      }
    });
  }

  navigateToUniversities(): void {
    this.router.navigate(['/universiteler'], { 
      queryParams: { countryName: this.country.name } 
    });
  }

  navigateToUniversityDetail(university: University): void {
    this.router.navigate(['/universiteler', university.id]);
  }

  trackByUniversityId(index: number, university: University): number {
    return university.id;
  }
}