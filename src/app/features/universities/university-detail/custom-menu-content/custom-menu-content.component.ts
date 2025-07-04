import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';
import { UniversityMenu } from '../../../../core/models/menu.model';

@Component({
  selector: 'app-custom-menu-content',
  templateUrl: './custom-menu-content.component.html',
  styleUrls: ['./custom-menu-content.component.scss']
})
export class CustomMenuContentComponent implements OnInit {
  @Input() menuContent: UniversityMenu | undefined;
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }

  getFormattedContent(): string {
    if (!this.menuContent?.content) return '';
    return this.menuContent.content.replace(/\n/g, '<br>');
  }
}