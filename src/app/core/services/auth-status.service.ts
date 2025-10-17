import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | null;

@Injectable({
  providedIn: 'root',
})
export class AuthStatusService {
  private tokenKey = 'authToken';
  private roleKey = 'userRole'; // Key to store the user's role

  // Initialize status based on whether a token exists upon app load
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Updates the global authentication status and saves the user's role.
   */
  updateStatus(isAuthenticated: boolean, role: UserRole = this.getRole()): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
    if (isAuthenticated && role) {
      localStorage.setItem(this.roleKey, role);
    } else {
      localStorage.removeItem(this.roleKey);
    }
  }

  /**
   * Retrieves the currently authenticated user's role from storage.
   */
  getRole(): UserRole {
    const role = localStorage.getItem(this.roleKey);
    // Note: In a production app, this should be read from the decoded JWT payload.
    return (role as UserRole) || null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}