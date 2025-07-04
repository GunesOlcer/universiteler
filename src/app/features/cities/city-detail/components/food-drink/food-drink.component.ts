import { Component, Input, OnInit } from '@angular/core';
import { City } from '../../../../../core/models/city.model';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-food-drink',
  templateUrl: './food-drink.component.html',
  styleUrls: ['./food-drink.component.scss']
})
export class FoodDrinkComponent implements OnInit {
  @Input() city: City | undefined;
  @Input() menuContent: CityMenu | undefined;

  ngOnInit(): void {}

  hasContent(): boolean {
    return !!(this.menuContent?.content);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }
}