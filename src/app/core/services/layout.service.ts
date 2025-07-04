import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private isAdminLayoutSubject = new BehaviorSubject<boolean>(false);
  public readonly isAdminLayout$: Observable<boolean> = this.isAdminLayoutSubject.asObservable();

  setAdminLayout(isAdmin: boolean): void {
    this.isAdminLayoutSubject.next(isAdmin);
  }

  getAdminLayout(): boolean {
    return this.isAdminLayoutSubject.value;
  }

  isAdminLayoutActive(): boolean {
    return this.isAdminLayoutSubject.value;
  }
}