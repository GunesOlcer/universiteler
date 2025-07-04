import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { City } from '../../../../../core/models/city.model';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.scss']
})
export class UniversitiesComponent implements OnInit, OnDestroy {
  @Input() city: City | undefined;
  @Input() menuContent: CityMenu | undefined;
  
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasContent(): boolean {
    return !!(this.menuContent?.content || this.city?.universityCount);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }

  navigateToUniversities(): void {
    if (this.city) {
      this.router.navigate(['/universities'], { 
        queryParams: { cityId: this.city.id } 
      });
    }
  }
}