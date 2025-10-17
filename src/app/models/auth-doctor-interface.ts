// Doctor Registration Request - Based on the provided DTO structure
export interface AuthDoctorRequest {
  username: string;
  password: string;
  roleName?: 'DOCTOR'; // Optional in frontend, but useful for clarity/if required by backend
  doctorName: string;
  qualification: string;
  specialization: string;
  clinicAddress: string;
  yearOfExperience: number;
  contactNumber: string;
  email: string;
}

// Doctor Login Request (Standard)
export interface AuthDoctorLogin {
  username: string;
  password: string;
}

// Doctor Login/Registration Response
export interface AuthDoctorResponse {
  token: string;
  id: number;
  username: string;
  role: 'DOCTOR';
  email: string;
  doctorName: string;
  specialization: string;
  // ... other doctor-specific fields returned by the backend
}
export interface DoctorResponseDTO {
  // Optional in frontend, but useful for clarity/if required by backend
  doctorId:number;
  doctorName: string;
  qualification: string;
  specialization: string;
  clinicAddress: string;
  yearOfExperience: number;
  contactNumber: string;
  email: string;
}