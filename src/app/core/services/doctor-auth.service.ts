import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthDoctorLogin,
  AuthDoctorRequest,
  AuthDoctorResponse,
} from '../../models/auth-doctor-interface';
import { environment } from '../../environments/environment';
import { AuthStatusService } from './auth-status.service';

@Injectable({
  providedIn: 'root',
})
export class DoctorAuthService {
  private http = inject(HttpClient);
  private apiUrlForRegistration = environment.apiUrl + environment.auth.doctorRegister;
  private apiUrlForLogin = environment.apiUrl + environment.auth.login; // Unified login endpoint
  private tokenKey = 'authToken';
  private doctorKey = 'doctorData';
  
  private authStatus = inject(AuthStatusService); 

  register(registerRequest: AuthDoctorRequest): Observable<AuthDoctorResponse> {
    const requestWithRole = { ...registerRequest, roleName: 'DOCTOR' }; // Match DTO
    
    return this.http
      .post<AuthDoctorResponse>(`${this.apiUrlForRegistration}`, requestWithRole)
      .pipe(
        tap((response) => {
          // Assuming successful registration may return a token for immediate login
          this.setAuthData(response);
          this.authStatus.updateStatus(true, 'DOCTOR');
        })
      );
  }

  login(loginRequest: AuthDoctorLogin): Observable<AuthDoctorResponse> {
    const requestWithRole = { ...loginRequest, role: 'DOCTOR' };

    return this.http.post<AuthDoctorResponse>(`${this.apiUrlForLogin}`, requestWithRole).pipe(
      tap((response) => {
        this.setAuthData(response);
        this.authStatus.updateStatus(true, 'DOCTOR');
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.doctorKey);
    this.authStatus.updateStatus(false);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setAuthData(response: AuthDoctorResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.doctorKey, JSON.stringify(response));
  }
}