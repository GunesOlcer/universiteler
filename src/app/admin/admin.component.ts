import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService } from '../core/services/layout.service';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  pageTitle = 'Dashboard';
  breadcrumbItems: BreadcrumbItem[] = [];
  sidebarCollapsed = false;
  isMobile = false;
  
  private routerSubscription?: Subscription;
  private readonly SIDEBAR_STATE_KEY = 'admin_sidebar_collapsed';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.layoutService.setAdminLayout(true);
    this.initializeSidebar();
    this.checkScreenSize();
    
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbAndTitle(this.activatedRoute.root);
    });
    
    this.updateBreadcrumbAndTitle(this.activatedRoute.root);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.layoutService.setAdminLayout(false);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private initializeSidebar(): void {
    // Load saved state from localStorage
    const savedState = localStorage.getItem(this.SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      this.sidebarCollapsed = JSON.parse(savedState);
    }
  }

  private checkScreenSize(): void {
    const currentIsMobile = window.innerWidth <= 768;
    if (currentIsMobile !== this.isMobile) {
      this.isMobile = currentIsMobile;
      if (this.isMobile) {
        this.sidebarCollapsed = true;
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    // Save state to localStorage
    localStorage.setItem(this.SIDEBAR_STATE_KEY, JSON.stringify(this.sidebarCollapsed));
    
    // Add body class for styling
    if (this.sidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }

  private updateBreadcrumbAndTitle(
    route: ActivatedRoute, 
    url: string = '', 
    breadcrumbs: BreadcrumbItem[] = []
  ): void {
    const children = route.children;
    if (children.length === 0) {
      this.breadcrumbItems = breadcrumbs;
      return;
    }

    const child = children[0];
    const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
    if (routeURL !== '') {
      url += `/${routeURL}`;
    }

    if (child.snapshot.data && child.snapshot.data['title']) {
      const breadcrumb: BreadcrumbItem = {
        label: child.snapshot.data['title'],
        url: url
      };
      breadcrumbs.push(breadcrumb);
      this.pageTitle = child.snapshot.data['title'];
      this.titleService.setTitle(`Admin - ${this.pageTitle} | Üniversiteler.net`);
    }

    this.updateBreadcrumbAndTitle(child, url, breadcrumbs);
  }
}