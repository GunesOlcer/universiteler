import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAdminAccess(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAdminAccess(state.url);
  }

  private checkAdminAccess(url: string): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        console.log('🛡️ [AdminGuard] Checking admin access:', { user, hasRoles: user && 'roles' in user });
        
        if (user && 'roles' in user && user.roles?.includes('Admin')) {
          console.log('✅ [AdminGuard] Admin access granted');
          return true;
        }
        
        console.log('❌ [AdminGuard] Admin access denied, redirecting to login');
        this.router.navigate(['/admin/login']);
        return false;
      })
    );
  }
}