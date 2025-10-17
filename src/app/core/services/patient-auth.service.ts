import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthPatientLogin,
  AuthPatientRequest,
  AuthPatientResponse,
} from '../../models/auth-patient-interface';
import { environment } from '../../environments/environment';
import { AuthStatusService } from './auth-status.service'; // NEW IMPORT

@Injectable({
  providedIn: 'root',
})
export class PatientAuthService {
  private http = inject(HttpClient);
  // Assuming explicit registration endpoint is needed for patient role
  private apiUrlForRegistration = environment.apiUrl + environment.auth.register; 
  private apiUrlForLogin = environment.apiUrl + environment.auth.login;
  private tokenKey = 'authToken';
  private patientKey = 'patientData';
  
  private authStatus = inject(AuthStatusService); // Inject the new service

  register(registerRequest: AuthPatientRequest): Observable<AuthPatientResponse> {
    const requestWithRole = { ...registerRequest, roleName: 'PATIENT' }; // Explicitly set role
    
    return this.http
      .post<AuthPatientResponse>(`${this.apiUrlForRegistration}`, requestWithRole, {
        responseType: 'text' as 'json',
      })
      .pipe(
        tap((response) => {
          this.setAuthData(response);
          this.authStatus.updateStatus(true, 'PATIENT'); // Update global state
        })
      );
  }

  login(loginRequest: AuthPatientLogin): Observable<AuthPatientResponse> {
    const requestWithRole = { ...loginRequest, role: 'PATIENT' }; // Explicitly set role
    
    return this.http.post<AuthPatientResponse>(`${this.apiUrlForLogin}`, requestWithRole).pipe(
      tap((response) => {
        this.setAuthData(response);
        this.authStatus.updateStatus(true, 'PATIENT'); // Update global state
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.patientKey);
    this.authStatus.updateStatus(false);
  }
  
  // Use the central status service
  isAuthenticated$(): Observable<boolean> {
    return this.authStatus.isAuthenticated$(); 
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentPatient(): AuthPatientResponse | null {
    const patientData = localStorage.getItem(this.patientKey);
    return patientData ? (JSON.parse(patientData) as AuthPatientResponse) : null;
  }

  private setAuthData(response: AuthPatientResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.patientKey, JSON.stringify(response));
  }
}