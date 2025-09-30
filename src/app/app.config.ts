import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '../interceptors/auth.interceptor'; // ✅ Décommenté
import { routes } from './app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNoopAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor]) // ✅ Décommenté
    )
  ]
};