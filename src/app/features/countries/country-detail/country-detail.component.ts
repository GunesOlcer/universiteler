// src/app/features/countries/country-detail/country-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Country } from '../../../core/models/country.model';
import { CountryService } from '../../../core/services/country.service';
import { MenuService } from '../../../core/services/menu.service';

// Country menu tipini import et (menu.model.ts'den)
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
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  country: Country | undefined;
  countryMenus: CountryMenu[] = [];
  isLoading = false;
  activeSection = 'general-info';
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private menuService: MenuService
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
        this.updatePageMetadata();
        this.loadCountryMenus(id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [CountryDetailComponent] Error loading country:', error);
        this.error = error.message || 'Ülke yüklenirken bir hata oluştu';
        this.isLoading = false;
        
        // If country not found, redirect to countries list
        if (error.status === 404) {
          setTimeout(() => {
            this.router.navigate(['/ulkeler']);
          }, 2000);
        }
      }
    });
  }

  private loadCountryMenus(countryId: number): void {
    console.log('📋 [CountryDetailComponent] Loading country menus for ID:', countryId);
    
    // Not: MenuService'te getCountryMenus metodu olmayabilir, o zaman geçici olarak boş array kullan
    if (this.menuService.getCountryMenus) {
      this.menuService.getCountryMenus(countryId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (menus) => {
          console.log('✅ [CountryDetailComponent] Country menus loaded:', menus.length);
          this.countryMenus = menus;
        },
        error: (error) => {
          console.error('❌ [CountryDetailComponent] Error loading country menus:', error);
          // Don't show error for menus, just log it
          this.countryMenus = [];
        }
      });
    } else {
      console.warn('⚠️ [CountryDetailComponent] getCountryMenus method not available');
      this.countryMenus = [];
    }
  }

  private updatePageMetadata(): void {
    if (this.country) {
      document.title = `${this.country.name} | Üniversiteler.net`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${this.country.name} hakkında detaylı bilgi. ${this.country.description || ''}`
        );
      }
    }
  }

  onSectionChange(sectionId: string): void {
    console.log('📄 [CountryDetailComponent] Section changed to:', sectionId);
    this.activeSection = sectionId;
    
    // Smooth scroll to top of content
    const contentElement = document.querySelector('.main-content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getMenuContentForSection(sectionId: string): CountryMenu | undefined {
    return this.countryMenus.find(menu => 
      menu.title.toLowerCase().includes(sectionId.replace('-', ' ')) ||
      menu.title.toLowerCase().includes(this.getSectionTitle(sectionId).toLowerCase())
    );
  }

  private getSectionTitle(sectionId: string): string {
    const sectionTitles: { [key: string]: string } = {
      'general-info': 'genel bilgi',
      'cities': 'şehir',
      'universities': 'üniversite',
      'education-system': 'eğitim sistem',
      'culture': 'kültür',
      'travel-info': 'seyahat'
    };
    
    return sectionTitles[sectionId] || sectionId;
  }
}