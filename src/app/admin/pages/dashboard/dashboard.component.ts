import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { AdminUserResponse, CurrentUserResponse } from '../../../core/models';

interface DashboardStats {
  onlineUsers: number;
  newMembers: number;
  totalUniversities: number;
  totalDormitories: number;
  totalMembers: number;
  totalDepartments: number;
  totalFaculties: number;
  totalCities: number;
  totalArticles: number;
  totalPages: number;
}

interface RecentUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: AdminUserResponse | CurrentUserResponse | null = null;
  stats: DashboardStats = {
    onlineUsers: 0,
    newMembers: 0,
    totalUniversities: 0,
    totalDormitories: 0,
    totalMembers: 0,
    totalDepartments: 0,
    totalFaculties: 0,
    totalCities: 0,
    totalArticles: 0,
    totalPages: 0
  };
  
  recentUsers: RecentUser[] = [];
  loading = true;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('📊 [Dashboard] Initializing dashboard');
    this.loadCurrentUser();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        console.log('📊 [Dashboard] Current user loaded:', {
          hasUser: !!user,
          isAdmin: user && 'roles' in user ? user.roles?.includes('Admin') : false
        });
      });
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    console.log('📊 [Dashboard] Loading dashboard data...');

    // Check authentication first
    if (!this.authService.isAuthenticated()) {
      console.error('❌ [Dashboard] User not authenticated');
      this.error = 'Kimlik doğrulama gerekli';
      this.loading = false;
      this.logout();
      return;
    }

    // Load available data
    this.userService.getAll().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('✅ [Dashboard] User data loaded successfully:', response);
        this.processDashboardData(response);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [Dashboard] Error loading data:', error);
        this.error = 'Dashboard verileri yüklenirken hata oluştu: ' + error.message;
        this.loading = false;
        this.loadMockData(); // Fallback to mock data
      }
    });
  }

  private processDashboardData(data: any): void {
    console.log('📊 [Dashboard] Processing dashboard data');
    
    // Process real data from API
    if (data && data.success && data.data) {
      const users = data.data;
      this.stats.totalMembers = users.length;
      
      console.log('📊 [Dashboard] Processing users:', users.length);
      
      // Extract recent users
      this.recentUsers = users
        .sort((a: any, b: any) => new Date(b.createdDate || b.createdAt || 0).getTime() - new Date(a.createdDate || a.createdAt || 0).getTime())
        .slice(0, 5)
        .map((user: any) => ({
          id: user.id,
          username: user.userName || user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: new Date(user.createdDate || user.createdAt || Date.now())
        }));

      // Calculate new members (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      this.stats.newMembers = users.filter((user: any) => 
        new Date(user.createdDate || user.createdAt || 0) > thirtyDaysAgo
      ).length;

      console.log('📊 [Dashboard] Stats calculated:', {
        totalMembers: this.stats.totalMembers,
        newMembers: this.stats.newMembers,
        recentUsers: this.recentUsers.length
      });
    } else {
      console.warn('⚠️ [Dashboard] No user data available');
    }

    // Mock data for other stats (implement these APIs later)
    this.stats.onlineUsers = Math.floor(Math.random() * 50) + 10;
    this.stats.totalUniversities = 273;
    this.stats.totalDormitories = 1482;
    this.stats.totalDepartments = 879;
    this.stats.totalFaculties = 1245;
    this.stats.totalCities = 81;
    this.stats.totalArticles = 234;
    this.stats.totalPages = 56;
  }

  private loadMockData(): void {
    console.log('📊 [Dashboard] Loading mock data as fallback');
    
    // Fallback mock data when API fails
    this.stats = {
      onlineUsers: 35,
      newMembers: 127,
      totalUniversities: 273,
      totalDormitories: 1482,
      totalMembers: 4562,
      totalDepartments: 879,
      totalFaculties: 1245,
      totalCities: 81,
      totalArticles: 234,
      totalPages: 56
    };

    this.recentUsers = [
      {
        id: 1,
        username: 'ahmet.yilmaz',
        email: 'ahmet.yilmaz@example.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        createdAt: new Date('2023-04-28T14:32:00')
      },
      {
        id: 2,
        username: 'zeynep_kaya',
        email: 'zeynep.kaya@example.com',
        firstName: 'Zeynep',
        lastName: 'Kaya',
        createdAt: new Date('2023-04-27T09:15:00')
      },
      {
        id: 3,
        username: 'mehmet.demir',
        email: 'mehmet.demir@example.com',
        firstName: 'Mehmet',
        lastName: 'Demir',
        createdAt: new Date('2023-04-26T18:42:00')
      },
      {
        id: 4,
        username: 'ayse_uzun',
        email: 'ayse.uzun@example.com',
        firstName: 'Ayşe',
        lastName: 'Uzun',
        createdAt: new Date('2023-04-26T11:23:00')
      },
      {
        id: 5,
        username: 'mustafa.celik',
        email: 'mustafa.celik@example.com',
        firstName: 'Mustafa',
        lastName: 'Çelik',
        createdAt: new Date('2023-04-25T15:55:00')
      }
    ];
  }

  refreshData(): void {
    console.log('🔄 [Dashboard] Refreshing dashboard data');
    this.loadDashboardData();
  }

  logout(): void {
    console.log('🚪 [Dashboard] Logout initiated from dashboard');
    this.authService.logout().subscribe({
      next: () => {
        console.log('✅ [Dashboard] Logout successful');
        this.router.navigate(['/admin/login']);
      },
      error: (error) => {
        console.error('❌ [Dashboard] Logout error:', error);
        this.router.navigate(['/admin/login']);
      }
    });
  }

  getUserDisplayName(user: RecentUser): string {
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.username;
  }

  getUserInitials(user: RecentUser): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return user.username.charAt(0).toUpperCase();
  }

  trackByUserId(index: number, user: RecentUser): number {
    return user.id;
  }
}