import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { City } from '../../../../../core/models/city.model';
import { CityMenu } from '../../../../../core/models/menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() city: City | undefined;
  @Input() cityMenus: CityMenu[] = [];
  @Input() activeMenuId: number | null = null;
  @Output() menuSelect = new EventEmitter<number>();

  ngOnInit(): void {}

  selectMenu(menuId: number): void {
    this.menuSelect.emit(menuId);
  }

  isMenuActive(menuId: number): boolean {
    return this.activeMenuId === menuId;
  }
}