import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { PatientAuthService } from '../../../core/services/patient-auth.service';
import { DoctorAuthService } from '../../../core/services/doctor-auth.service'; // NEW IMPORT
import { AdminAuthService } from '../../../core/services/admin-auth.service'; // NEW IMPORT
import { AuthPatientLogin } from '../../../models/auth-patient-interface';
import { AuthDoctorLogin } from '../../../models/auth-doctor-interface'; // NEW IMPORT
import { AuthAdminLogin } from '../../../models/auth-admin-interface'; // NEW IMPORT

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
  // Inject all three services
  private patientAuthService = inject(PatientAuthService);
  private doctorAuthService = inject(DoctorAuthService);
  private adminAuthService = inject(AdminAuthService);
  
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

      // Determine which service to use based on the selected login mode
      switch (this.loginMode) {
        case 'patient':
          loginObservable = this.patientAuthService.login(loginRequest as AuthPatientLogin);
          redirectPath = '/patient/dashboard';
          break;
        case 'doctor':
          loginObservable = this.doctorAuthService.login(loginRequest as AuthDoctorLogin);
          redirectPath = '/doctor/dashboard';
          break;
        case 'admin':
          loginObservable = this.adminAuthService.login(loginRequest as AuthAdminLogin);
          redirectPath = '/admin/dashboard';
          break;
        default:
          this.isLoading = false;
          this.errorMessage = 'Invalid login mode selected.';
          return;
      }
      
      loginObservable.subscribe({
        next: () => {
          this.isLoading = false;
          // Navigate to the role-specific dashboard
          this.router.navigate([redirectPath]);
        },
        error: (error) => {
          this.isLoading = false;
          // Display a user-friendly error message
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

  toggleLoginMode(mode: LoginMode): void {
    this.loginMode = mode;
    this.errorMessage = '';
    this.loginForm.reset(); // Reset form state on mode switch
  }
}