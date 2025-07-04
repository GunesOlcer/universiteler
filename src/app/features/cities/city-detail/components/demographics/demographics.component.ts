import { Component, Input, OnInit } from '@angular/core';
import { City } from '../../../../../core/models/city.model';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.scss']
})
export class DemographicsComponent implements OnInit {
  @Input() city: City | undefined;
  @Input() menuContent: CityMenu | undefined;

  ngOnInit(): void {}

  hasContent(): boolean {
    return !!(this.menuContent?.content || this.city?.population);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }
}