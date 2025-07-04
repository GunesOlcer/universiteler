import { Component, Input, OnInit } from '@angular/core';
import { City } from '../../../../../core/models/city.model';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.scss']
})
export class TransportationComponent implements OnInit {
  @Input() city: City | undefined;
  @Input() menuContent: CityMenu | undefined;

  ngOnInit(): void {}

  hasContent(): boolean {
    return !!(this.menuContent?.content || this.hasTransportationFeatures());
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }

  hasTransportationFeatures(): boolean {
    if (!this.city) return false;
    return this.city.hasAirport || this.city.hasTrainStation || this.city.hasHighSpeedTrain;
  }
}