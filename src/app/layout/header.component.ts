// src/app/layout/header.component.ts
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  name: string;
  routerLink: string;
  isHighlighted?: boolean;
  hasDropdown?: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  hoveredIndex = -1;
  hoverTimeout: any;
  currentRoute = '';
  
  navItems: NavItem[] = [
    { name: 'Ana Sayfa', routerLink: '/' },
    { name: 'Üniversiteler', routerLink: '/universiteler', hasDropdown: true },
    { name: 'Bölümler', routerLink: '/bolumler', hasDropdown: true },
    { name: 'Şehirler', routerLink: '/sehirler', hasDropdown: true },
    { name: 'Yurtlar', routerLink: '/yurtlar', hasDropdown: true },
    { name: 'Makaleler', routerLink: '/makaleler', hasDropdown: true },
    { name: 'Tercih Botu', routerLink: '/tercih-botu', isHighlighted: true },
    { name: 'İletişim', routerLink: '/iletisim', hasDropdown:true }
  ];
  
  constructor(
    private router: Router,
    private renderer: Renderer2
  ) {}
  
  ngOnInit(): void {
    // Track current route for active state
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
    
    // Set initial scroll state based on page load position
    this.isScrolled = window.scrollY > 20;
    
    // Prevent scrolling when mobile menu is open
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobileMenu();
      });
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }
  
  onItemHover(index: number): void {
    // Clear any existing hover timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    
    // Set the hovered index immediately
    this.hoveredIndex = index;
  }
  
  onItemLeave(): void {
    // Add a slight delay before closing the dropdown
    this.hoverTimeout = setTimeout(() => {
      this.hoveredIndex = -1;
    }, 100);
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    if (this.isMobileMenuOpen) {
      this.renderer.addClass(document.body, 'mobile-menu-open');
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeClass(document.body, 'mobile-menu-open');
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }
  
  closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.renderer.removeClass(document.body, 'mobile-menu-open');
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }
  
  isActiveRoute(route: string): boolean {
    if (route === '/') {
      return this.currentRoute === '/';
    }
    return this.currentRoute.startsWith(route);
  }
  
  getHighlightedItem(): NavItem | undefined {
    return this.navItems.find(item => item.isHighlighted);
  }
  
  // For keyboard accessibility
  @HostListener('keydown.escape', ['$event'])
  onKeydownHandler(): void {
    this.hoveredIndex = -1;
    this.closeMobileMenu();
  }
}