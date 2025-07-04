import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.scss']
})
export class OnlineUsersComponent implements OnInit {
  onlineUsers: any[] = [];
  isLoading = true;
  
  refreshInterval: any = null;
  lastRefreshed: Date = new Date();
  
  // View mode toggle
  viewMode: 'grid' | 'table' = 'grid';

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadOnlineUsers();
    
    // Set up auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadOnlineUsers();
    }, 30000);
  }

  ngOnDestroy(): void {
    // Clear the interval when component is destroyed
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadOnlineUsers(): void {
    this.isLoading = true;
    
    this.userService.getOnlineUsers().subscribe(
      (data: any) => {
        this.onlineUsers = data;
        this.isLoading = false;
        this.lastRefreshed = new Date();
      },
      (error) => {
        console.error('Error loading online users:', error);
        this.isLoading = false;
      }
    );
  }

  refreshUsers(): void {
    this.loadOnlineUsers();
  }
  
  // Toggle view mode
  setViewMode(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }
  
  // Get user initials for avatar
  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  }
}