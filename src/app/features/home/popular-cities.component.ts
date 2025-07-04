import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { City } from '../../core/models/city.model';
import { CityService } from '../../core/services/city.service';

@Component({
  selector: 'app-popular-cities',
  templateUrl: './popular-cities.component.html',
  styleUrls: ['./popular-cities.component.scss']
})
export class PopularCitiesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('citiesGrid') citiesGrid!: ElementRef;
  
  private destroy$ = new Subject<void>();
  
  cities: City[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor(private cityService: CityService) {}
  
  ngOnInit(): void {
    this.loadPopularCities();
  }
  
  ngAfterViewInit(): void {
    if (this.isMobile() && this.citiesGrid) {
      this.citiesGrid.nativeElement.addEventListener('scroll', () => {
        // Scroll behavior optimization for mobile
      }, { passive: true });
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadPopularCities(): void {
    this.isLoading = true;
    this.error = null;
    
    this.cityService.getPopular(8).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (cities) => {
        this.cities = cities;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading popular cities:', error);
        this.error = error.message || 'Şehirler yüklenirken bir hata oluştu';
        this.isLoading = false;
        this.cities = [];
      }
    });
  }
  
  retryLoad(): void {
    this.loadPopularCities();
  }
  
  trackByCity(index: number, city: City): number {
    return city.id;
  }
  
  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}