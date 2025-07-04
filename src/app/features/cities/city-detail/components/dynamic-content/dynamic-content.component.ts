import { Component, Input, OnInit } from '@angular/core';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.scss']
})
export class DynamicContentComponent implements OnInit {
  @Input() menuContent: CityMenu | undefined;
  @Input() menuTitle: string = '';

  ngOnInit(): void {}

  hasContent(): boolean {
    return !!(this.menuContent?.content);
  }

  getContent(): string {
    return this.menuContent?.content || '';
  }
}