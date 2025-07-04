// src/app/features/countries/country-detail/country-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Country } from '../../../core/models/country.model';
import { CountryService } from '../../../core/services/country.service';
import { getStatusName } from '../../../core/models/base.model';

interface BreadcrumbItem {
  label: string;
  url?: string;
  active: boolean;
}

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  country: Country | null = null;
  isLoading = false;
  error: string | null = null;
  breadcrumbPath: BreadcrumbItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    console.log('🌍 [CountryDetailComponent] Component initialized');
    
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id = params.get('id');
      console.log('🆔 [CountryDetailComponent] Country ID from route:', id);
      
      if (id && !isNaN(+id)) {
        this.loadCountry(parseInt(id, 10));
      } else {
        console.error('❌ [CountryDetailComponent] Invalid country ID:', id);
        this.error = 'Geçersiz ülke ID\'si';
        this.router.navigate(['/ulkeler']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCountry(id: number): void {
    this.isLoading = true;
    this.error = null;
    
    console.log('🔄 [CountryDetailComponent] Loading country with ID:', id);
    
    this.countryService.getById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (country) => {
        console.log('✅ [CountryDetailComponent] Country loaded:', country);
        this.country = country;
        this.setupBreadcrumb();
        this.updatePageMetadata();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [CountryDetailComponent] Error loading country:', error);
        this.error = 'Ülke bulunamadı veya yüklenirken bir hata oluştu';
        this.isLoading = false;
        
        // Redirect to countries list after error
        setTimeout(() => {
          this.router.navigate(['/ulkeler']);
        }, 3000);
      }
    });
  }

  private setupBreadcrumb(): void {
    if (this.country) {
      this.breadcrumbPath = [
        { label: 'Ana Sayfa', url: '/', active: false },
        { label: 'Ülkeler', url: '/ulkeler', active: false },
        { label: this.country.name, active: true }
      ];
    }
  }

  private updatePageMetadata(): void {
    if (this.country) {
      document.title = `${this.country.name} | Üniversiteler.net`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${this.country.name} (${this.country.code}) hakkında detaylı bilgi.`
        );
      }
    }
  }

  getStatusName(status: number): string {
    return getStatusName(status);
  }

  navigateBack(): void {
    this.router.navigate(['/ulkeler']);
  }

  navigateToCities(): void {
    this.router.navigate(['/sehirler'], { 
      queryParams: { countryName: this.country?.name } 
    });
  }

  navigateToUniversities(): void {
    this.router.navigate(['/universiteler'], { 
      queryParams: { countryName: this.country?.name } 
    });
  }
}