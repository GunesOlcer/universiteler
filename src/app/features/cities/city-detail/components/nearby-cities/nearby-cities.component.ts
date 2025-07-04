import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { City, RegionType } from '../../../../../core/models/city.model';
import { CityService } from '../../../../../core/services/city.service';

@Component({
  selector: 'app-nearby-cities',
  templateUrl: './nearby-cities.component.html',
  styleUrls: ['./nearby-cities.component.scss']
})
export class NearbyCitiesComponent implements OnInit, OnDestroy {
  @Input() city: City | undefined;
  
  private destroy$ = new Subject<void>();
  nearbyCities: City[] = [];
  isLoading = false;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.loadNearbyCities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNearbyCities(): void {
    if (!this.city) return;

    this.isLoading = true;
    
    // Try to get cities from the same region first
    if (this.city.region) {
      this.cityService.getByRegion(this.city.region).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (cities) => {
          this.nearbyCities = cities
            .filter(c => c.id !== this.city?.id)
            .slice(0, 3);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading nearby cities:', error);
          this.loadFallbackCities();
        }
      });
    } else {
      this.loadFallbackCities();
    }
  }

  private loadFallbackCities(): void {
    // Fallback: get popular cities
    this.cityService.getPopular(6).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (cities) => {
        this.nearbyCities = cities
          .filter(c => c.id !== this.city?.id)
          .slice(0, 3);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading fallback cities:', error);
        this.isLoading = false;
      }
    });
  }
}