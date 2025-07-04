import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';
import { UniversityMenu } from '../../../../core/models/menu.model';

interface MenuItemStructure {
  id: string;
  title: string;
  isDefault: boolean;
  isExpandable?: boolean;
  customMenu?: UniversityMenu;
  children?: Array<{
    id: string;
    title: string;
    customMenu?: UniversityMenu;
  }>;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() university: University | undefined;
  @Input() universityMenus: UniversityMenu[] = [];
  @Input() activeSection: string = 'genel-bilgi';
  @Output() sectionChange = new EventEmitter<string>();

  expandedMenus: string[] = [];
  defaultMenuItems: MenuItemStructure[] = [
    {
      id: 'genel-bilgi',
      title: 'Genel Bilgi',
      isDefault: true
    },
    {
      id: 'universite',
      title: 'Üniversite',
      isDefault: true,
      isExpandable: true,
      children: [
        { id: 'kilit-ozellikler', title: 'Kilit Özellikler' },
        { id: 'kampusler', title: 'Kampüsler' },
        { id: 'burslar', title: 'Burslar' },
        { id: 'is-staj', title: 'İş ve Staj' },
        { id: 'erasmus', title: 'Erasmus' }
      ]
    },
    {
      id: 'egitim',
      title: 'Eğitim',
      isDefault: true,
      isExpandable: true,
      children: [
        { id: 'egitim-sistemi', title: 'Eğitim Sistemi' },
        { id: 'hazirlik-egitimi', title: 'Hazırlık Eğitimi' },
        { id: 'cift-ana-dal', title: 'Çift Ana Dal - Yan Dal' },
        { id: 'uzaktan-egitim', title: 'Uzaktan Eğitim' },
        { id: 'akreditasyon', title: 'Akreditasyon' }
      ]
    },
    {
      id: 'taban-puanlar',
      title: 'Taban Puanlar',
      isDefault: true
    },
    {
      id: 'kampus',
      title: 'Kampüs',
      isDefault: true,
      isExpandable: true,
      children: [
        { id: 'ulasim', title: 'Ulaşım' },
        { id: 'kampus-yasam', title: 'Yaşam' },
        { id: 'topluluklar', title: 'Topluluklar' },
        { id: 'kutuphane', title: 'Kütüphane' },
        { id: 'saglik-olanaklari', title: 'Sağlık Olanakları' },
        { id: 'yeme-icme', title: 'Yeme İçme' }
      ]
    },
    {
      id: 'uluslararasi',
      title: 'Uluslararası',
      isDefault: true
    },
    {
      id: 'yurtlar',
      title: 'Yurtlar',
      isDefault: true
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.setInitialExpandedMenu();
  }

  private setInitialExpandedMenu(): void {
    for (const menuItem of this.defaultMenuItems) {
      if (menuItem.isExpandable && menuItem.children) {
        const hasActiveChild = menuItem.children.some(child => child.id === this.activeSection);
        if (hasActiveChild) {
          this.expandedMenus.push(menuItem.id);
        }
      }
    }
  }

  toggleMenu(menuName: string): void {
    const index = this.expandedMenus.indexOf(menuName);
    if (index === -1) {
      this.expandedMenus.push(menuName);
    } else {
      this.expandedMenus.splice(index, 1);
    }
  }

  isMenuExpanded(menuName: string): boolean {
    return this.expandedMenus.includes(menuName);
  }

  selectSection(sectionId: string): void {
    this.sectionChange.emit(sectionId);
  }

  isMenuItemActive(itemId: string): boolean {
    if (itemId === this.activeSection) {
      return true;
    }
    
    const menuItem = this.defaultMenuItems.find(item => item.id === itemId);
    if (menuItem?.children) {
      return menuItem.children.some(child => child.id === this.activeSection);
    }
    
    return false;
  }

  isChildActive(childId: string): boolean {
    return this.activeSection === childId;
  }

  getMenuStructure(): MenuItemStructure[] {
    const structure = [...this.defaultMenuItems];
    
    if (this.universityMenus.length > 0) {
      const parentMenus = this.universityMenus.filter(menu => !menu.parentId);
      
      for (const parentMenu of parentMenus) {
        const children = this.universityMenus.filter(menu => menu.parentId === parentMenu.id);
        
        structure.push({
          id: `custom-${parentMenu.id}`,
          title: parentMenu.title,
          isDefault: false,
          isExpandable: children.length > 0,
          customMenu: parentMenu,
          children: children.map(child => ({
            id: `custom-${child.id}`,
            title: child.title,
            customMenu: child
          }))
        });
      }
    }
    
    return structure;
  }

  getMenuContent(sectionId: string): UniversityMenu | undefined {
    if (sectionId.startsWith('custom-')) {
      const menuId = parseInt(sectionId.replace('custom-', ''));
      return this.universityMenus.find(menu => menu.id === menuId);
    }
    return undefined;
  }
}