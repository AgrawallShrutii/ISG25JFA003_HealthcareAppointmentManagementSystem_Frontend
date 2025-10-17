// src/app/core/services/admin.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { DoctorResponseDTO } from '../../models/auth-doctor-interface'; // Re-use the DTO

// Assuming a Patient DTO exists or a minimal interface for Admin view
export interface PatientResponseDTO {
    patientId: number;
    patientName: string;
    email: string;
    contactNumber: string;
    address: string;
    gender: string;
    dateOfBirth: string;
    bloodGroup : string
    // ... add other relevant patient fields
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Assuming backend returns an array of DoctorResponseDTO
  getAllDoctors(): Observable<DoctorResponseDTO[]> {
    // You should define the actual admin API path if different from /patients/all-doctors
    const url = `${this.baseUrl}${environment.admin.getAllDoctors}`;
    
    // Add sorting/limit query parameters if your backend supports it (e.g., ?sortBy=doctorId&sortDir=desc)
    // For now, we assume the backend returns all and we sort/limit in the component.
    return this.http.get<DoctorResponseDTO[]>(url);
  }

  // Assuming backend returns an array of PatientResponseDTO
  getAllPatients(): Observable<PatientResponseDTO[]> {
    const url = `${this.baseUrl}${environment.admin.getAllPatients}`;
    return this.http.get<PatientResponseDTO[]>(url);
  }
}