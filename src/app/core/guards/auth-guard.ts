import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStatusService } from '../services/auth-status.service'; // NEW IMPORT
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authStatus = inject(AuthStatusService);
  const router = inject(Router);

  return authStatus.isAuthenticated$().pipe(
    take(1),
    map((isAuthenticated) => {
      // 1. Authentication Check
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
        return false;
      }
      
      // 2. Authorization (Role) Check
      const requiredRole = route.data?.['role'];
      const userRole = authStatus.getRole();
      
      if (requiredRole && userRole !== requiredRole) {
         // Redirect to their own dashboard or a forbidden page
         const redirectPath = userRole ? `/${userRole.toLowerCase()}/dashboard` : '/';
         router.navigate([redirectPath]); 
         console.warn(`Access denied. Required role: ${requiredRole}, User role: ${userRole}`);
         return false;
      }
      
      return true;
    })
  );
};