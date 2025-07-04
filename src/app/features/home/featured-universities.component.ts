import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { University, UniversityType } from '../../core/models/university.model';
import { UniversityService } from '../../core/services/university.service';

@Component({
  selector: 'app-featured-universities',
  templateUrl: './featured-universities.component.html',
  styleUrls: ['./featured-universities.component.scss']
})
export class FeaturedUniversitiesComponent implements OnInit, AfterViewInit {
  @ViewChild('universitiesGrid') universitiesGrid!: ElementRef;
  
  universities: University[] = [];
  activeFilter: 'all' | 'state' | 'foundation' | 'kktc' = 'all';
  isLoading = false;
  scrollIndicators: number[] = [];
  currentScrollIndex = 0;
  isMobile = false;
  
  constructor(private universityService: UniversityService) {}
  
  ngOnInit(): void {
    this.loadUniversities();
    this.checkScreenSize();
  }
  
  ngAfterViewInit(): void {
    this.initScrollIndicators();
    
    // Add scroll event listener to update active indicator
    if (this.universitiesGrid && this.isMobile) {
      this.universitiesGrid.nativeElement.addEventListener('scroll', () => {
        this.updateActiveScrollIndicator();
      }, { passive: true });
    }
  }
  
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
    this.initScrollIndicators();
  }
  
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }
  
  loadUniversities(): void {
    this.isLoading = true;
    this.universityService.getTopUniversities(8)
      .subscribe({
        next: (data) => {
          this.universities = data;
          this.isLoading = false;
          // Initialize scroll indicators after data is loaded
          setTimeout(() => this.initScrollIndicators(), 0);
        },
        error: (error) => {
          console.error('Error loading universities', error);
          this.isLoading = false;
        }
      });
  }
  
  applyFilter(filter: 'all' | 'state' | 'foundation' | 'kktc'): void {
    this.activeFilter = filter;
    // Reset scroll position when filter changes
    if (this.universitiesGrid && this.isMobile) {
      setTimeout(() => {
        this.universitiesGrid.nativeElement.scrollLeft = 0;
        this.initScrollIndicators();
      }, 0);
    }
  }
  
  get filteredUniversities(): University[] {
    if (this.activeFilter === 'all') {
      return this.universities;
    } else if (this.activeFilter === 'kktc') {
      return this.universities.filter(u => u.country === 'KKTC');
    } else if (this.activeFilter === 'state') {
      return this.universities.filter(u => u.type === UniversityType.State);
    } else if (this.activeFilter === 'foundation') {
      return this.universities.filter(u => u.type === UniversityType.Foundation);
    }
    return this.universities;
  }
  
  initScrollIndicators(): void {
    if (!this.universitiesGrid || !this.isMobile) return;
    
    // Wait for the grid to be rendered
    setTimeout(() => {
      const grid = this.universitiesGrid.nativeElement;
      
      if (this.filteredUniversities.length > 0) {
        // Calculate how many indicators we need
        const cardElement = grid.querySelector('app-university-card');
        if (!cardElement) return;
        
        const cardWidth = cardElement.offsetWidth;
        const containerWidth = grid.offsetWidth;
        
        if (!cardWidth) return;
        
        const visibleCards = Math.floor(containerWidth / cardWidth);
        const totalCards = this.filteredUniversities.length;
        
        // Create an array with the number of indicators needed
        const indicatorsNeeded = Math.ceil(totalCards / visibleCards);
        this.scrollIndicators = Array(indicatorsNeeded).fill(0).map((_, i) => i);
        
        // Initialize with first indicator active
        this.currentScrollIndex = 0;
      } else {
        this.scrollIndicators = [];
      }
    }, 100);
  }
  
  updateActiveScrollIndicator(): void {
    if (!this.universitiesGrid || !this.isMobile || this.scrollIndicators.length === 0) return;
    
    const grid = this.universitiesGrid.nativeElement;
    const scrollLeft = grid.scrollLeft;
    const cardElement = grid.querySelector('app-university-card');
    if (!cardElement) return;
    
    const cardWidth = cardElement.offsetWidth;
    const scrollWidth = grid.scrollWidth - grid.clientWidth;
    
    if (!cardWidth || scrollWidth === 0) return;
    
    // Calculate which indicator should be active based on scroll position
    const scrollPercentage = scrollLeft / scrollWidth;
    const index = Math.min(
      Math.floor(scrollPercentage * this.scrollIndicators.length),
      this.scrollIndicators.length - 1
    );
    
    if (this.currentScrollIndex !== index) {
      this.currentScrollIndex = index;
    }
  }
  
  scrollToIndex(index: number): void {
    if (!this.universitiesGrid || !this.isMobile) return;
    
    const grid = this.universitiesGrid.nativeElement;
    const cardElement = grid.querySelector('app-university-card');
    if (!cardElement) return;
    
    const cardWidth = cardElement.offsetWidth;
    const scrollWidth = grid.scrollWidth - grid.clientWidth;
    const scrollPercentage = index / (this.scrollIndicators.length - 1);
    const scrollTo = scrollPercentage * scrollWidth;
    
    grid.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
    
    this.currentScrollIndex = index;
  }
}