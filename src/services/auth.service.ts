// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  telephone: string;
  profil: string;
  countryAmchamId: number | null;
  companyId: number | null;
}
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
  refreshToken: string;
}

export interface AuthResult {
  isSuccess: boolean;
  token?: string;
  refreshToken?: string;
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
 * CORRECTION: Toujours appeler getMe() pour avoir les données complètes
 */
private initializeAuthState(): void {
  const token = this.getToken();
  const userData = localStorage.getItem('user_data');
  
  if (token && this.isTokenValid(token)) {
    if (userData) {
      // Utiliser les données du localStorage
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      console.log('🔄 Utilisateur restauré depuis localStorage:', user);
    } else {
      // Pas de données en cache, on appelle l'API
      console.log('⚠️ Pas de user_data en cache, appel à getMe()');
      this.getMe().subscribe({
        next: (fullUser) => {
          console.log('✅ Données utilisateur récupérées depuis l\'API:', fullUser);
          this.currentUserSubject.next(fullUser);
          this.isAuthenticatedSubject.next(true);
        },
        error: (err) => {
          console.error('❌ Erreur getMe() au démarrage, fallback sur JWT:', err);
          // Fallback sur les données du token (même si incomplètes)
          const user = this.getUserFromToken(token);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      });
    }
  } else if (token) {
    // Token invalide, on nettoie
    console.warn('⚠️ Token invalide détecté, nettoyage');
    this.clearAuthData();
  }
}
/**
 * Récupérer les informations complètes de l'utilisateur connecté
 * GET /api/user/me
 * IMPORTANT: Nécessite l'en-tête Authorization avec le token Bearer
 */
getMe(): Observable<User> {
  const headers = this.getAuthHeaders();
  
  console.log('🔑 [getMe] Headers envoyés:', headers.get('Authorization'));
  console.log('🔍 [getMe] Tous les headers:', {
    Authorization: headers.get('Authorization'),
    ContentType: headers.get('Content-Type'),
    withCredentials: true
  });
  console.log('🌐 [getMe] URL complète:', `${this.baseUrl}/api/user/me`);
  
  return this.http.get<User>(`${this.baseUrl}/api/v1/user/me`, {responseType: 'json'  , withCredentials: true } )
    .pipe(
      tap(user => {
        console.log('✅ Données utilisateur complètes (getMe):', user);
        // Mettre à jour le localStorage avec les données complètes
        localStorage.setItem('user_data', JSON.stringify(user));
        // Mettre à jour le BehaviorSubject
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        console.error('❌ [getMe] Erreur complète:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
          headers: error.headers
        });
        return this.handleError(error);
      })
    );
}


 /**
 * Authentification - POST /api/auth/signin
 * CORRECTION: S'assurer que getMe() est toujours appelé
 */
authenticate(email: string, password: string): Observable<AuthResult> {
  const authRequest: AuthRequest = { email, password };

  return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/signin`, authRequest)
    .pipe(
      tap(response => console.log('📥 Réponse authentification:', response)),
      switchMap(response => {
        if (response?.token && response?.refreshToken) {
          // Stocker les tokens
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('refresh_token', response.refreshToken);
          
          console.log('🔍 Appel à getMe() pour récupérer les données complètes...');
          
          // Récupérer les données complètes de l'utilisateur
          return this.getMe().pipe(
            map(user => {
              console.log('✅ Données utilisateur complètes reçues:', user);
              console.log('📌 CompanyId:', user.companyId);
              
              // Mettre à jour avec les données complètes
              this.currentUserSubject.next(user);
              this.isAuthenticatedSubject.next(true);
              
              return {
                isSuccess: true,
                token: response.token,
                refreshToken: response.refreshToken,
                user: user
              };
            }),
            catchError(error => {
              console.error('❌ Erreur getMe() après connexion:', error);
              console.warn('⚠️ Utilisation des données du token JWT (incomplètes)');
              
              // En cas d'erreur getMe, utiliser les données du token
              const userFromToken = this.getUserFromToken(response.token);
              this.storeAuthData(response.token, response.refreshToken, userFromToken);
              this.currentUserSubject.next(userFromToken);
              this.isAuthenticatedSubject.next(true);
              
              return of({
                isSuccess: true,
                token: response.token,
                refreshToken: response.refreshToken,
                user: userFromToken,
                warning: 'Données utilisateur incomplètes (getMe failed)'
              });
            })
          );
        }
        
        return of({
          isSuccess: false,
          errorMessage: 'Réponse invalide du serveur - tokens manquants'
        });
      }),
      catchError((error) => this.handleError(error))
    );
}


  /**
   * Rafraîchir le token - POST /api/auth/refresh
   */
  refreshToken(): Observable<AuthResult> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => ({
        isSuccess: false,
        errorMessage: 'Aucun refresh token disponible'
      }));
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/refresh`, { refreshToken })
      .pipe(
        map(response => {
          if (response?.token && response?.refreshToken) {
            const user = this.getUserFromToken(response.token);
            this.storeAuthData(response.token, response.refreshToken, user);
            
            return {
              isSuccess: true,
              token: response.token,
              refreshToken: response.refreshToken,
              user: user
            };
          }
          
          return {
            isSuccess: false,
            errorMessage: 'Échec du rafraîchissement du token'
          };
        }),
        catchError(error => {
          // En cas d'erreur de rafraîchissement, déconnecter l'utilisateur
          this.clearAuthData();
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          
          return throwError(() => ({
            isSuccess: false,
            errorMessage: 'Session expirée, veuillez vous reconnecter'
          }));
        })
      );
  }

  /**
   * Création d'utilisateur - POST /api/auth/signup
   */
  createUser(userData: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/signup`, userData)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Réinitialisation du mot de passe - POST /api/auth/password/reset
   */
  resetPassword(passwordData: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/password/reset`, passwordData)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Changement de mot de passe - POST /api/auth/password/change/{id}
   */
  changePassword(id: number, passwordData: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/password/change/${id}`, passwordData)
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }



  /**
   * Déconnexion - GET /api/auth/logout
   */
  logout(): Observable<any> {
    const token = this.getToken();
    
    // Appel API de déconnexion si token disponible
    if (token) {
      return this.http.get(`${this.baseUrl}/api/auth/logout`)
        .pipe(
          tap(() => {
            this.clearAuthData();
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
          }),
          catchError(error => {
            // Même en cas d'erreur API, on déconnecte localement
            this.clearAuthData();
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
            return throwError(() => error);
          })
        );
    } else {
      // Déconnexion locale seulement
      this.clearAuthData();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      return new Observable(subscriber => {
        subscriber.next({ success: true });
        subscriber.complete();
      });
    }
  }

  /**
   * Gestion des erreurs HTTP
   * CORRECTION: Utiliser une arrow function pour préserver le contexte 'this'
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = this.getErrorMessage(error.status, error.error);
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
  private getErrorMessage(status: number, error?: any): string {
    switch (status) {
      case 400:
        if (error?.message) {
          return error.message;
        }
        return 'Requête invalide';
      case 401:
        return 'Email ou mot de passe incorrect';
      case 403:
        return 'Accès non autorisé. Veuillez vous reconnecter.';
      case 404:
        return 'Service non trouvé';
      case 409:
        return 'Un utilisateur avec cet email existe déjà';
      case 500:
        return 'Erreur interne du serveur';
      case 0:
        return 'Erreur de connexion au serveur';
      default:
        return 'Erreur inconnue';
    }
  }

  /**
   * Stockage des données d'authentification
   */
  private storeAuthData(token: string, refreshToken: string, user: any): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Nettoyage des données d'authentification
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  /**
   * Récupération du token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Récupération du refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
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
      console.log('Payload JWT complet:', payload);
      
      return {
        id: payload.userId || payload.id,
        userId: payload.userId || payload.id,
        name: payload.name || payload.username,
        email: payload.email || payload.sub,
        telephone: payload.telephone || payload.phone || payload.sub,
        profil: payload.profil || payload.role,
        companyId: payload.companyId || null,
        countryAmchamId: payload.countryAmchamId || null,
        sub: payload.sub,
        iat: payload.iat,
        exp: payload.exp
      };
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return {
        id: null,
        userId: null,
        name: 'unknown',
        email: 'unknown',
        profil: 'unknown',
        companyId: null,
        countryAmchamId: null,
        sub: 'unknown'
      };
    }
  }

  /**
   * Vérifier si le token est sur le point d'expirer (dans les 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - now;
      
      // Considérer comme bientôt expiré si moins de 5 minutes
      return timeUntilExpiry < 300;
    } catch {
      return true;
    }
  }



/**
 * Méthodes utilitaires pour les composants
 * CORRECTION: Ajouter une méthode pour forcer le refresh
 */
getCurrentUser(): any {
  const user = this.currentUserSubject.value;
  console.log('🔍 getCurrentUser() appelé, valeur actuelle:', user);
  return user;
}

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  /**
   * Vérifier le profil de l'utilisateur
   */
  getUserProfil(): string {
    const user = this.getCurrentUser();
    return user?.profil || 'unknown';
  }

  /**
   * Vérifier si l'utilisateur a un profil spécifique
   */
  hasProfil(profil: string): boolean {
    return this.getUserProfil() === profil;
  }
/**
 * Forcer le refresh des données utilisateur depuis l'API
 */
refreshUserData(): Observable<User> {
  console.log('🔄 Refresh forcé des données utilisateur');
  return this.getMe();
}

/**
 * Vérifier si les données utilisateur sont complètes
 */
hasCompleteUserData(): boolean {
  const user = this.getCurrentUser();
  const isComplete = user && 
                     user.id && 
                     user.email && 
                     (user.companyId !== undefined || user.countryAmchamId !== undefined);
  
  console.log('🔍 Données utilisateur complètes?', isComplete, user);
  return isComplete;
}
  /**
   * Méthode pour forcer le refresh de l'état d'authentification
   */
  checkAuthStatus(): void {
    const token = this.getToken();
    const hasValidToken = token && this.isTokenValid(token);
    
    if (hasValidToken) {
      const user = this.getUserFromToken(token);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearAuthData();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }


/**
 * Créer les headers d'authentification (simplifié)
 */
getAuthHeaders(): HttpHeaders {
  const token = this.getToken();
  if (!token) {
    return new HttpHeaders();
  }
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
}
}