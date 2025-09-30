import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Endpoints publics qui ne nécessitent pas d'authentification
  const publicUrls = ['/api/auth/signin', '/api/auth/signup', '/api/auth/refresh', '/api/auth/password/reset'];
  const isPublic = publicUrls.some(url => req.url.includes(url));

  // Ajouter le token si disponible et que ce n'est pas une URL publique
  if (token && !isPublic) {
    console.log('🔐 [Interceptor] Ajout du token Bearer à la requête:', req.url);
    console.log('🔑 [Interceptor] Token:', token.substring(0, 20) + '...');
    
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } else if (!token && !isPublic) {
    console.warn('⚠️ [Interceptor] Pas de token pour une requête protégée:', req.url);
  }

  // Gérer les erreurs HTTP
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ [Interceptor] Erreur HTTP:', error.status, error.url);

      // Erreur 401 : Token invalide ou expiré
      if (error.status === 401) {
        console.warn('⚠️ [Interceptor] 401 Unauthorized - Token expiré ou invalide');
        authService.logout().subscribe(() => {
          router.navigate(['/login']);
        });
      }

      // Erreur 403 : Accès refusé (permissions insuffisantes)
      if (error.status === 403) {
        console.error('❌ [Interceptor] 403 Forbidden - Accès refusé');
        console.error('📋 [Interceptor] Détails:', {
          url: error.url,
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 50) + '...' : 'none'
        });
        
        // Si 403 sur /api/user/me, c'est probablement un problème de token
        if (error.url?.includes('/api/user/me')) {
          console.error('💡 [Interceptor] Conseil: Vérifiez que le token est valide côté serveur');
          console.error('💡 [Interceptor] Essayez de vous reconnecter pour obtenir un nouveau token');
        }
      }

      // Propager l'erreur
      return throwError(() => error);
    })
  );
};