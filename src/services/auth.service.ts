// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Interfaces
export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  profil: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  email: string;
  password: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user?: any;
}

export interface AuthResult {
  isSuccess: boolean;
  token?: string;
  user?: any;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://wakana.online/annuaire-amcham';
  
  // BehaviorSubjects pour gérer l'état d'authentification
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  /**
   * Initialise l'état d'authentification au démarrage
   */
  private initializeAuthState(): void {
    const token = this.getToken();
    const userData = localStorage.getItem('user_data');
    
    if (token && this.isTokenValid(token) && userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Authentification - POST /api/auth/signin
   */
  authenticate(email: string, password: string): Observable<AuthResult> {
    const authRequest: AuthRequest = { email, password };

    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/signin`, authRequest)
      .pipe(
        tap(response => console.log('Réponse authentification:', response)),
        map(response => {
          if (response?.token) {
            const user = this.getUserFromToken(response.token);
            this.storeAuthData(response.token, user);
            
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            
            return {
              isSuccess: true,
              token: response.token,
              user: user
            };
          }
          
          return {
            isSuccess: false,
            errorMessage: 'Réponse invalide du serveur'
          };
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Création d'utilisateur - POST /api/auth/signup
   */
  createUser(userData: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/signup`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Réinitialisation du mot de passe - POST /api/auth/password/reset
   */
  resetPassword(passwordData: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/password/reset`, passwordData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Changement de mot de passe - POST /api/auth/password/change/{id}
   */
  changePassword(id: number, passwordData: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/password/change/${id}`, passwordData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Déconnexion - GET /api/auth/logout
   */
  logout(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/auth/logout`)
      .pipe(
        tap(() => {
          this.clearAuthData();
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = this.getErrorMessage(error.status);
    }
    
    console.error('Erreur AuthService:', error);
    return throwError(() => ({
      isSuccess: false,
      errorMessage: errorMessage,
      httpError: error
    }));
  }

  /**
   * Messages d'erreur selon le statut HTTP
   */
  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Requête invalide';
      case 401:
        return 'Email ou mot de passe incorrect';
      case 403:
        return 'Accès non autorisé';
      case 404:
        return 'Service non trouvé';
      case 500:
        return 'Erreur interne du serveur';
      default:
        return 'Erreur de connexion';
    }
  }

  /**
   * Stockage des données d'authentification
   */
  private storeAuthData(token: string, user: any): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Nettoyage des données d'authentification
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  /**
   * Récupération du token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Vérification de la validité du token (basique)
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  /**
   * Extraction des informations utilisateur depuis le token JWT
   */
  private getUserFromToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        telephone: payload.telephone,
        profil: payload.profil
      };
    } catch {
      return null;
    }
  }

  /**
   * Méthodes utilitaires pour les composants
   */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Méthode pour forcer le refresh de l'état d'authentification
  checkAuthStatus(): void {
    const token = this.getToken();
    const hasValidToken = token && this.isTokenValid(token);
    
    if (!hasValidToken) {
      this.clearAuthData();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }
}