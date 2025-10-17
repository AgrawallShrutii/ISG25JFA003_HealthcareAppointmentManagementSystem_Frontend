export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',

  auth: {
    register: '/auth/register/patient', // Renamed for clarity
    login: '/auth/login', // Unified login endpoint for all roles
    doctorRegister: '/admin/create-user', // New Doctor Register endpoint
    // Admin login usually uses the unified endpoint with a role parameter
  },

  admin: {
    doctorRegister: '/admin/create-user',
    doctorLogin: '/auth/login',
    adminLogin: '/auth/login',
  },

  patient: {
    getAvailableDoctors: '/patients/doctors-availability',
    getMedicalRecords: '/patients/me/medical-records',
    getNotifications: '/patients/me/notifications',
    addAppointments: '/patients/me/appointments',
    getAppointments: '/patients/me/status',
    updateAppointment: '/patients/me/appointments/{appointmentId}',
    cancelAppointment: '/patients/me/appointments/{appointmentId}/cancel',
    getPatient: '/patients/me',
    updatePatient: '/patients/me',
    searchDoctors: '/patients/doctor-name?specialty={specialty}&name={name}',
    getAllDoctors: '/patients/all-doctors',
  },

  doctor: {
    addRecord: '/doctors/me/medical-records',
    getMedicalRecords: '/doctors/me/medical-records',
    getNotifications: '/doctors/me/notifications',
    getDoctor: '/doctors/me',
    addAvailability: '/doctors/me/availability',
    getAvailability: '/doctors/me/availability',
    updateAvailability: '/doctors/{doctorId}/availability/{availabilityId}',
    confirmAppointment: '/doctors/me/appointments/{appointmentId}/confirm',
    rejectAppointment: '/doctors/me/appointments/{appointmentId}/reject',
  },
  admin: { // New section for admin specific APIs
    getAllPatients: '/patients/all', // Assuming this endpoint exists or is needed
    getAllDoctors: '/doctors/all',   // Assuming this endpoint exists, or we use the patient one, for admin view, let's assume a dedicated one for comprehensive doctor data.
  }
};