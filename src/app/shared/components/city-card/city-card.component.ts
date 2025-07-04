//src\app\shared\components\city-card\city-card.component.ts
import { Component, Input } from '@angular/core';
import { City, getRegionName } from '../../../core/models/city.model';

@Component({
  selector: 'app-city-card',
  templateUrl: './city-card.component.html',
  styleUrls: ['./city-card.component.scss']
})
export class CityCardComponent {
  @Input() city!: City;
  
  getRegion(): string {
    if (this.city.region) {
      return getRegionName(this.city.region);
    }
    return 'Belirtilmemiş';
  }

  getImageUrl(): string {
    // First check imageUrl, then imagePath, then default
    if (this.city.imageUrl) {
      return this.city.imageUrl;
    }
    if (this.city.imagePath) {
      return this.city.imagePath.startsWith('http') 
        ? this.city.imagePath 
        : `/assets/uploads/${this.city.imagePath}`;
    }
    return '/assets/images/cities/default-city.jpg';
  }

  onImageError(event: any): void {
    // Fallback to default image if image fails to load
    event.target.src = '/assets/images/cities/default-city.jpg';
  }
}