import { Component, Input, OnInit } from '@angular/core';
import { City } from '../../../../../core/models/city.model';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-culture-art',
  templateUrl: './culture-art.component.html',
  styleUrls: ['./culture-art.component.scss']
})
export class CultureArtComponent implements OnInit {
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