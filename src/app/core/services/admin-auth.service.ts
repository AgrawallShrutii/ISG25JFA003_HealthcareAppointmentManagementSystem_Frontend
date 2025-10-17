import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthAdminLogin,
  AuthAdminResponse,
} from '../../models/auth-admin-interface';
import { environment } from '../../environments/environment';
import { AuthStatusService } from './auth-status.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private http = inject(HttpClient);
  private apiUrlForLogin = environment.apiUrl + environment.auth.login; // Unified login endpoint
  private tokenKey = 'authToken';
  private adminKey = 'adminData';
  
  private authStatus = inject(AuthStatusService); 

  login(loginRequest: AuthAdminLogin): Observable<AuthAdminResponse> {
    const requestWithRole = { ...loginRequest, role: 'ADMIN' };

    return this.http.post<AuthAdminResponse>(`${this.apiUrlForLogin}`, requestWithRole).pipe(
      tap((response) => {
        this.setAuthData(response);
        this.authStatus.updateStatus(true, 'ADMIN');
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
    this.authStatus.updateStatus(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setAuthData(response: AuthAdminResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.adminKey, JSON.stringify(response));
  }
}