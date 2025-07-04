import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Dormitory } from '../../core/models/dormitory.model';
import { DormitoryService } from '../../core/services/dormitory.service';

@Component({
  selector: 'app-featured-dormitories',
  templateUrl: './featured-dormitories.component.html',
  styleUrls: ['./featured-dormitories.component.scss']
})
export class FeaturedDormitoriesComponent implements OnInit, AfterViewInit {
  @ViewChild('dormitoriesGrid') dormitoriesGrid: ElementRef;
  
  dormitories: Dormitory[] = [];
  isLoading = false;
  
  constructor(private dormitoryService: DormitoryService) {}
  
  ngOnInit(): void {
    this.loadDormitories();
  }
  
  ngAfterViewInit(): void {
    if (this.isMobile() && this.dormitoriesGrid) {
      this.dormitoriesGrid.nativeElement.addEventListener('scroll', () => {
        // Scroll event handling if needed
      }, { passive: true });
    }
  }
  
  loadDormitories(): void {
    this.isLoading = true;
    this.dormitoryService.getFeatured(4)
      .subscribe({
        next: (data) => {
          this.dormitories = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading featured dormitories', error);
          this.isLoading = false;
        }
      });
  }
  
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}