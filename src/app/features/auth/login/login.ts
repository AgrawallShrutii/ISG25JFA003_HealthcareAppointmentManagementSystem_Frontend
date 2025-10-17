import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { PatientAuthService } from '../../../core/services/patient-auth.service';
import { DoctorAuthService } from '../../../core/services/doctor-auth.service'; // NEW IMPORT
import { AdminAuthService } from '../../../core/services/admin-auth.service'; // NEW IMPORT
import { AuthPatientLogin } from '../../../models/auth-patient-interface';
import { Observable } from 'rxjs';
import { DoctorAuthService } from '../../../core/services/doctor-auth.service';
import { AdminAuthService } from '../../../core/services/admin-auth.service';

type LoginMode = 'patient' | 'doctor' | 'admin';

@Component({
  selector: 'app-login',
  standalone: true, 
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ReactiveFormsModule, CommonModule, RouterLink], 
})
export class Login {
  private fb = inject(FormBuilder);
  private patientAuthService = inject(PatientAuthService);
  private doctorAuthService = inject(DoctorAuthService);
  private adminAuthService = inject(AdminAuthService); // Replace with actual AdminAuthService when available
  private router = inject(Router);

  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false; 
  loginMode: LoginMode = 'patient'; // Default mode

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };

      let loginObservable: Observable<any>;
      let redirectPath: string;

      if (this.loginMode === 'patient') {
        loginObservable = this.patientAuthService.login(loginRequest);
        redirectPath = '/patient/dashboard';
      } else if (this.loginMode === 'doctor') {
        loginObservable = this.doctorAuthService.login(loginRequest);
        redirectPath = '/doctor/dashboard';
      } else if (this.loginMode === 'admin') {
        loginObservable = this.adminAuthService.login(loginRequest);
        redirectPath = '/admin/dashboard';
      }
      
      loginObservable.subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate([redirectPath]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error?.error?.message ||
            `Login failed for ${this.loginMode}. Invalid credentials or network error.`;
          console.error('Login error:', error);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isPatientMode: boolean = true;
  loginMode: LoginMode = 'patient';

  toggleLoginMode(mode: LoginMode): void {
    this.loginMode = mode;
    this.errorMessage = '';
    this.loginForm.reset();
  }
}