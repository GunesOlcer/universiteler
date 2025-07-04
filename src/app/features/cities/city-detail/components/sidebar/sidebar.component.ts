import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { City } from '../../../../../core/models/city.model';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() city: City | undefined;
  @Input() activeSection: string = 'general-info';
  @Output() sectionChange = new EventEmitter<string>();

  expandedMenus: string[] = [];
  
  menuItems: MenuItem[] = [
    {
      id: 'basic-info',
      label: 'Temel Bilgiler',
      icon: 'fa-info-circle',
      children: [
        { id: 'general-info', label: 'Genel Bilgi', icon: 'fa-file-alt' },
        { id: 'climate', label: 'İklim', icon: 'fa-cloud-sun' },
        { id: 'demographics', label: 'Demografik Yapı', icon: 'fa-users' }
      ]
    },
    {
      id: 'education',
      label: 'Eğitim',
      icon: 'fa-graduation-cap',
      children: [
        { id: 'universities', label: 'Üniversiteler', icon: 'fa-university' },
        { id: 'dormitories', label: 'Yurtlar', icon: 'fa-bed' }
      ]
    },
    {
      id: 'lifestyle',
      label: 'Yaşam & Kültür',
      icon: 'fa-heart',
      children: [
        { id: 'lifestyle', label: 'Yaşantı', icon: 'fa-home' },
        { id: 'culture-art', label: 'Kültür ve Sanat', icon: 'fa-palette' },
        { id: 'important-places', label: 'Önemli Yerler', icon: 'fa-map-marker-alt' },
        { id: 'food-drink', label: 'Yeme ve İçme', icon: 'fa-utensils' }
      ]
    },
    {
      id: 'city-life',
      label: 'Şehir Yaşamı',
      icon: 'fa-city',
      children: [
        { id: 'economy-work', label: 'Ekonomi ve Çalışma', icon: 'fa-briefcase' },
        { id: 'health-sports', label: 'Sağlık ve Spor', icon: 'fa-heartbeat' },
        { id: 'transportation', label: 'Ulaşım', icon: 'fa-bus' }
      ]
    }
  ];

  ngOnInit(): void {
    this.setInitialExpandedMenu();
  }

  private setInitialExpandedMenu(): void {
    for (const item of this.menuItems) {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.id === this.activeSection);
        if (hasActiveChild) {
          this.expandedMenus.push(item.id);
          break;
        }
      }
    }
  }

  toggleMenu(menuId: string): void {
    const index = this.expandedMenus.indexOf(menuId);
    if (index === -1) {
      this.expandedMenus.push(menuId);
    } else {
      this.expandedMenus.splice(index, 1);
    }
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.includes(menuId);
  }

  selectSection(sectionId: string): void {
    this.sectionChange.emit(sectionId);
  }

  isItemActive(item: MenuItem): boolean {
    if (item.children) {
      return item.children.some(child => child.id === this.activeSection);
    }
    return item.id === this.activeSection;
  }
}