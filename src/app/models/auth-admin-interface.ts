export interface AuthAdminLogin {
  username: string;
  password: string;
}

export interface AuthAdminResponse {
  token: string;
  id: number;
  username: string;
  role: 'ADMIN';
  email: string;
  name: string;
  // ... other admin-specific fields
}