import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  loginError = '';
  returnUrl: string = '/admin/dashboard';
  
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.getReturnUrl();
    this.checkExistingAuth();
  }

  private getReturnUrl(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    console.log('🔗 [Login] Return URL set to:', this.returnUrl);
  }

  private checkExistingAuth(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          console.log('✅ [Login] User already authenticated, redirecting to:', this.returnUrl);
          this.navigateToReturnUrl();
        }
      });
  }

  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';

    console.log('📝 [Login] Form submission initiated');

    if (this.loginForm.invalid) {
      console.log('❌ [Login] Form is invalid');
      this.markFormGroupTouched();
      return;
    }

    this.performLogin();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private performLogin(): void {
    this.setLoadingState(true);
    
    const loginRequest: LoginRequest = {
      userName: this.f['username'].value.trim(),
      password: this.f['password'].value,
      rememberMe: this.f['rememberMe'].value
    };

    console.log('🔐 [Login] Attempting admin login for:', loginRequest.userName);

    this.authService.adminLogin(loginRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('📡 [Login] Login response received:', response);
          
          if (response.success) {
            console.log('✅ [Login] Login successful');
            this.handleLoginSuccess();
          } else {
            console.log('❌ [Login] Login failed:', response.message);
            this.handleLoginError(response.message || 'Giriş başarısız');
          }
        },
        error: (error) => {
          console.error('❌ [Login] Login error:', error);
          this.handleLoginError(error.message || 'Giriş sırasında bir hata oluştu');
        }
      });
  }

  private setLoadingState(loading: boolean): void {
    this.loading = loading;
    
    if (loading) {
      this.loginForm.get('username')?.disable();
      this.loginForm.get('password')?.disable();
      this.loginForm.get('rememberMe')?.disable();
    } else {
      this.loginForm.get('username')?.enable();
      this.loginForm.get('password')?.enable();
      this.loginForm.get('rememberMe')?.enable();
    }
  }

  private handleLoginSuccess(): void {
    console.log('🎉 [Login] Login successful, preparing to redirect');
    this.setLoadingState(false);
    this.submitted = false;
    this.loginError = '';
    
    // Small delay to ensure auth state is updated
    setTimeout(() => {
      this.navigateToReturnUrl();
    }, 500);
  }

  private navigateToReturnUrl(): void {
    console.log('🚀 [Login] Navigating to:', this.returnUrl);
    this.router.navigateByUrl(this.returnUrl);
  }

  private handleLoginError(errorMessage: string): void {
    console.error('❌ [Login] Handling login error:', errorMessage);
    this.loginError = errorMessage;
    this.setLoadingState(false);
    this.submitted = false;
    
    // Clear password field on error
    this.loginForm.patchValue({ password: '' });
    
    // Focus on username field
    setTimeout(() => {
      const usernameField = document.getElementById('username');
      usernameField?.focus();
    }, 100);
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched || this.submitted)) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} gereklidir`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} en az ${requiredLength} karakter olmalıdır`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    switch (fieldName) {
      case 'username': return 'Kullanıcı adı';
      case 'password': return 'Şifre';
      default: return fieldName;
    }
  }
}