// src/app/features/dormitories/dormitory-detail/sidebar/sidebar.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Dormitory } from '../../../../core/models/dormitory.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() dormitory: Dormitory | undefined;
  @Input() activeSection: string = 'genel-bilgi';
  @Output() sectionChange = new EventEmitter<string>();
  
  expandedMenus: string[] = [];
  
  constructor() {}
  
  ngOnInit(): void {
    // Eğer aktif bölüm bir alt menüdeyse, o menüyü genişlet
    this.setInitialExpandedMenu();
  }
  
  private setInitialExpandedMenu(): void {
    // For this component, we don't need expandable menus since we have few items
    // But keeping the logic in case we add more sections in the future
  }
  
  selectSection(sectionId: string): void {
    this.sectionChange.emit(sectionId);
  }
}