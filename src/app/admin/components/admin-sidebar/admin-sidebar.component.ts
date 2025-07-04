import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  openMenus: string[] = [];
  activeRoute: string = '';
  isMobile = false;

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Ana Sayfa',
      icon: 'fas fa-home',
      route: '/admin/dashboard'
    },
    {
      id: 'universities',
      title: 'Üniversite Yönetimi',
      icon: 'fas fa-university',
      children: [
        {
          id: 'university-list',
          title: 'Üniversite Listesi',
          icon: 'fas fa-list',
          route: '/admin/universities'
        },
        {
          id: 'faculties',
          title: 'Fakülte ve Yüksekokul',
          icon: 'fas fa-building',
          route: '/admin/faculties'
        },
        {
          id: 'departments',
          title: 'Bölüm Listesi',
          icon: 'fas fa-graduation-cap',
          route: '/admin/departments'
        },
        {
          id: 'programs',
          title: 'Program Listesi',
          icon: 'fas fa-clipboard-list',
          route: '/admin/programs'
        }
      ]
    },
    {
      id: 'regions',
      title: 'Bölge Yönetimi',
      icon: 'fas fa-map-marked-alt',
      children: [
        {
          id: 'countries',
          title: 'Ülkeler',
          icon: 'fas fa-globe',
          route: '/admin/countries'
        },
        {
          id: 'cities',
          title: 'Şehirler',
          icon: 'fas fa-city',
          route: '/admin/cities'
        }
      ]
    },
    {
      id: 'dormitories',
      title: 'Yurt Yönetimi',
      icon: 'fas fa-bed',
      children: [
        {
          id: 'dormitory-list',
          title: 'Yurt Listesi',
          icon: 'fas fa-list',
          route: '/admin/dormitories'
        },
        {
          id: 'dormitory-features',
          title: 'Yurt Özellikleri',
          icon: 'fas fa-list-ul',
          route: '/admin/dormitory-features'
        }
      ]
    },
    {
      id: 'content',
      title: 'İçerik Yönetimi',
      icon: 'fas fa-newspaper',
      children: [
        {
          id: 'news',
          title: 'Haberler',
          icon: 'fas fa-newspaper',
          route: '/admin/news'
        },
        {
          id: 'articles',
          title: 'Makaleler',
          icon: 'fas fa-file-alt',
          route: '/admin/articles'
        },
        {
          id: 'pages',
          title: 'Sayfalar',
          icon: 'fas fa-file',
          route: '/admin/pages'
        },
        {
          id: 'dynamic-menus',
          title: 'Dinamik Menüler',
          icon: 'fas fa-list',
          route: '/admin/dynamic-menus'
        },
        {
          id: 'module-menus',
          title: 'Modül Menüleri',
          icon: 'fas fa-th',
          route: '/admin/module-menus'
        },
        {
          id: 'help-topics',
          title: 'Yardım Konuları',
          icon: 'fas fa-question-circle',
          route: '/admin/help-topics'
        }
      ]
    },
    {
      id: 'users',
      title: 'Kullanıcı Yönetimi',
      icon: 'fas fa-users',
      children: [
        {
          id: 'user-list',
          title: 'Kullanıcılar',
          icon: 'fas fa-user',
          route: '/admin/users'
        },
        {
          id: 'online-users',
          title: 'Online Kullanıcılar',
          icon: 'fas fa-user-clock',
          route: '/admin/online-users'
        }
      ]
    },
    {
      id: 'site',
      title: 'Site Yönetimi',
      icon: 'fas fa-cog',
      children: [
        {
          id: 'admin-users',
          title: 'Yöneticiler',
          icon: 'fas fa-user-shield',
          route: '/admin/admins'
        },
        {
          id: 'site-settings',
          title: 'Site Ayarları',
          icon: 'fas fa-sliders-h',
          route: '/admin/site-settings'
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.setActiveRoute();
    this.expandActiveMenus();

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setActiveRoute();
      this.expandActiveMenus();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private setActiveRoute(): void {
    this.activeRoute = this.router.url;
  }

  private expandActiveMenus(): void {
    this.menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          child.route && this.activeRoute.startsWith(child.route)
        );
        if (hasActiveChild && !this.openMenus.includes(item.id)) {
          this.openMenus.push(item.id);
        }
      }
    });
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  toggleMenu(menuId: string): void {
    if (this.collapsed && !this.isMobile) {
      return; // Don't allow menu expansion when sidebar is collapsed on desktop
    }

    const index = this.openMenus.indexOf(menuId);
    if (index > -1) {
      this.openMenus.splice(index, 1);
    } else {
      this.openMenus.push(menuId);
    }
  }

  isMenuOpen(menuId: string): boolean {
    if (this.collapsed && !this.isMobile) {
      return false;
    }
    return this.openMenus.includes(menuId);
  }

  isRouteActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }

  hasActiveChild(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => 
      child.route && this.isRouteActive(child.route)
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    
    // Close sidebar on mobile after navigation
    if (this.isMobile) {
      this.toggleSidebar();
    }
  }

  logout(): void {
    // Implement logout logic
    localStorage.removeItem('admin_sidebar_collapsed');
    this.router.navigate(['/admin/login']);
  }
}