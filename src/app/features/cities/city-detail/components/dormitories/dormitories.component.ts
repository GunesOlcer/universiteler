import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { City } from '../../../../../core/models/city.model';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-dormitories',
  templateUrl: './dormitories.component.html',
  styleUrls: ['./dormitories.component.scss']
})
export class DormitoriesComponent implements OnInit {
  @Input() city: City | undefined;
  @Input() menuContent: CityMenu | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  hasContent(): boolean {
    return !!(this.menuContent?.content);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }

  navigateToDormitories(): void {
    if (this.city) {
      this.router.navigate(['/dormitories'], { 
        queryParams: { cityId: this.city.id } 
      });
    }
  }
}