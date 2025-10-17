// src/app/features/admin/admin-dashboard/admin-dashboard.ts

import { Component, OnInit, inject } from '@angular/core'; // Added OnInit
import { RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common'; // Added CommonModule for *ngFor, | slice
import { AdminService, PatientResponseDTO } from '../../../core/services/admin.service'; // NEW IMPORT
import { DoctorResponseDTO } from '../../../models/auth-doctor-interface'; // DTO Import
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [RouterLink, CommonModule], // CommonModule added
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit { // Implements OnInit
    private adminService = inject(AdminService);

    totalDoctors: number = 0;
    totalPatients: number = 0;
    // The list of doctors to display, sorted by ID descending
    recentDoctors: DoctorResponseDTO[] = []; 

    ngOnInit(): void {
        this.fetchDashboardData();
    }

    fetchDashboardData(): void {
        // Fetch all doctors
        this.adminService.getAllDoctors().subscribe({
            next: (doctors) => {
                this.totalDoctors = doctors.length; // Get total count
                // Sort by doctorId descending and take the top 10
                this.recentDoctors = doctors
                    .sort((a, b) => (b.doctorId || 0) - (a.doctorId || 0)) // Assuming doctorId is the creation order proxy
                    .slice(0, 10);
            },
            error: (err) => {
                console.error('Error fetching doctors:', err);
                // Handle error (e.g., show a toast/alert)
            },
        });

        // Fetch all patients
        this.adminService.getAllPatients().subscribe({
            next: (patients) => {
                this.totalPatients = patients.length; // Get total count
            },
            error: (err) => {
                console.error('Error fetching patients:', err);
                // Handle error
            },
        });
    }

    // Example action handlers for table buttons (optional)
    viewDoctor(doctorId: number): void {
        console.log(`Viewing doctor: ${doctorId}`);
        // Navigate to view doctor details page: this.router.navigate(['/admin/doctors', doctorId]);
    }

    // You'd need a specific API in AdminService to handle approval/suspension
    // For now, let's keep the console log to show the intention
    approveDoctor(doctorId: number): void {
        console.log(`Approving doctor: ${doctorId}`);
        // Call adminService.approveDoctor(doctorId) and then re-fetch data
    }

    rejectDoctor(doctorId: number): void {
        console.log(`Rejecting doctor: ${doctorId}`);
    }

    suspendDoctor(doctorId: number): void {
        console.log(`Suspending doctor: ${doctorId}`);
    }
}