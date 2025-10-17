import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { PatientDashboard } from './features/patient/patient-dashboard/patient-dashboard';
import { DoctorDashboard } from './features/doctor/doctor-dashboard/doctor-dashboard';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Login } from './features/auth/login/login';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DoctorAppointments } from './features/doctor/doctor-appointments/doctor-appointments';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { PatientManagement } from './features/doctor/patient-management/patient-management';
import { DoctorAvailability } from './features/doctor/doctor-availability/doctor-availability';
import { PatientRegister } from './features/auth/register/patient-register/patient-register';
import { DoctorRegister } from './features/auth/register/doctor-register/doctor-register'; // NEW IMPORT
import { authGuard } from '../app/core/guards/auth-guard'; // NEW IMPORT

export const routes: Routes = [
  // Public routes (Landing)
  {
    path: '',
    component: PublicLayout,
    children: [{ path: '', component: Landing }],
  },
  
  // Patient Dashboard - PROTECTED
  {
    path: 'patient',
    component: DashboardLayout,
    canActivate: [authGuard], // Guard applied
    data: { role: 'PATIENT' }, // Required role
    children: [
      { path: 'dashboard', component: PatientDashboard },
      { path: '**', component: PatientDashboard },
    ],
  },
  
  // Doctor Dashboard - PROTECTED
  {
    path: 'doctor',
    component: DashboardLayout,
    canActivate: [authGuard], // Guard applied
    data: { role: 'DOCTOR' }, // Required role
    children: [
      { path: 'dashboard', component: DoctorDashboard },
      { path: 'appointments', component: DoctorAppointments },
      { path: 'patients', component: PatientManagement },
      { path: 'availability', component: DoctorAvailability },
    ],
  },

  // Admin Dashboard - PROTECTED
  {
    path: 'admin',
    component: DashboardLayout,
    canActivate: [authGuard], // Guard applied
    data: { role: 'ADMIN' }, // Required role
    children: [
      { path: 'dashboard', component: AdminDashboard },
      // ... other admin management routes
    ],
  },

  // Auth routes (Login, Register) - PUBLIC
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'patient-register', component: PatientRegister },
      { path: 'doctor-register', component: DoctorRegister }, // Doctor Registration route
      // Optional: Redirect /auth/register to the default patient register page
      { path: 'register', redirectTo: 'patient-register', pathMatch: 'full' }, 
    ],
  },
  
  // Wildcard route
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];