import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Notification {
  id: number;
  type: 'message' | 'alert' | 'update';
  title: string;
  text: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  isFullscreen = false;
  showUserDropdown = false;
  showNotifications = false;
  currentDateTime: string = '';
  unreadCount = 0;

  notifications: Notification[] = [
    { 
      id: 1, 
      type: 'message', 
      title: 'Yeni Mesaj', 
      text: 'Merhaba, yeni özellikler hakkında görüşmek istiyorum.', 
      time: '10 dk önce',
      read: false
    },
    { 
      id: 2, 
      type: 'alert', 
      title: 'Sistem Bildirimi', 
      text: 'Sistem bakımı 22:00\'da başlayacak.', 
      time: '1 saat önce',
      read: false
    },
    { 
      id: 3, 
      type: 'update', 
      title: 'Güncelleme Tamamlandı', 
      text: 'Sistem başarıyla güncellendi.', 
      time: '2 gün önce',
      read: true
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateUnreadCount();
    this.updateDateTime();
    
    // Update time every minute
    setInterval(() => {
      this.updateDateTime();
    }, 60000);

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      this.onDocumentClick(event);
    });
  }

  updateDateTime(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    this.currentDateTime = now.toLocaleDateString('tr-TR', options);
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Exit fullscreen error:', err);
        });
      }
    }
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserDropdown = false;
    }
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateUnreadCount();
  }

  logout(): void {
    // Clear any stored data
    localStorage.removeItem('admin_sidebar_collapsed');
    this.router.navigate(['/admin/login']);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Close user dropdown if clicked outside
    if (!target.closest('.user-dropdown') && !target.closest('.user-avatar-wrapper')) {
      this.showUserDropdown = false;
    }
    
    // Close notifications if clicked outside
    if (!target.closest('.notification-dropdown') && !target.closest('.notification-toggle')) {
      this.showNotifications = false;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'message': return 'fa-envelope';
      case 'alert': return 'fa-exclamation-circle';
      case 'update': return 'fa-sync-alt';
      default: return 'fa-bell';
    }
  }
}