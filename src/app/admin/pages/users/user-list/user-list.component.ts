// src/app/admin/pages/users/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  
  totalItems = 0;
  activeCount = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  filters = {
    search: '',
    status: ''
  };
  
  filterPanelOpen = true; // Controls the visibility of filter panel
  
  showUserModal = false;
  showConfirmDialog = false;
  
  userForm: FormGroup;
  selectedUserId: number | null = null;
  userToDelete: any = null;
  
  // For use in template calculations
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isActive: [true]
    });
  }

  loadUsers(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      ...this.filters
    };

    this.userService.getUsers(params).subscribe(
      (data: any) => {
        this.users = data.items;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.calculateActiveCount();
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  calculateActiveCount(): void {
    this.activeCount = this.users.filter(u => u.isActive).length;
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get user initials for avatar display
  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      status: ''
    };
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  // User Modal Methods
  openAddUserModal(): void {
    this.selectedUserId = null;
    this.userForm.reset({
      isActive: true
    });
    this.showUserModal = true;
  }

  openEditUserModal(user: any): void {
    this.selectedUserId = user.id;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive
    });
    
    // Remove password validators in edit mode (password change is optional)
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    
    // Restore password validators for next time
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userData = { ...this.userForm.value };
    
    // If password is empty and in edit mode, don't send it
    if (this.selectedUserId && !userData.password) {
      delete userData.password;
    }

    if (this.selectedUserId) {
      // Update existing user
      this.userService.updateUser(this.selectedUserId, userData).subscribe(
        () => {
          // Update local data
          const index = this.users.findIndex(u => u.id === this.selectedUserId);
          if (index !== -1) {
            this.users[index] = {
              ...this.users[index],
              ...userData
            };
          }
          this.closeUserModal();
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      // Create new user
      this.userService.createUser(userData).subscribe(
        (response: any) => {
          // Reload users
          this.loadUsers();
          this.closeUserModal();
        },
        (error) => {
          console.error('Error creating user:', error);
        }
      );
    }
  }

  // Delete Methods
  confirmDelete(user: any): void {
    this.userToDelete = user;
    this.showConfirmDialog = true;
  }

  deleteUser(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe(
        () => {
          // Remove from local data
          this.users = this.users.filter(u => u.id !== this.userToDelete.id);
          this.totalItems--;
          this.calculateActiveCount();
          this.showConfirmDialog = false;
          this.userToDelete = null;
          
          // If current page is empty, go to previous page
          if (this.users.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadUsers();
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.showConfirmDialog = false;
          this.userToDelete = null;
        }
      );
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.userToDelete = null;
  }
}