import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        console.log('🛡️ [AuthGuard] Checking authentication:', { isAuthenticated, url });
        
        if (isAuthenticated) {
          console.log('✅ [AuthGuard] Authentication check passed');
          return true;
        }
        
        console.log('❌ [AuthGuard] Authentication failed, redirecting to login');
        this.router.navigate(['/admin/login'], { 
          queryParams: { returnUrl: url }
        });
        return false;
      })
    );
  }
}