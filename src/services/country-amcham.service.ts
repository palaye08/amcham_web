// country-amcham.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces
export interface CountryAmcham {
  id?: number;
  countryId: number;
  name: string;
  address: string;
  telephone: string;
  email: string;
  website: string;
  logoFile?: File;
}

export interface CountryAmchamResponse {
  id: number;
  countryId: number;
  name: string;
  address: string;
  telephone: string;
  email: string;
  website: string;
  logoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryAmchamService {
  private readonly baseUrl = 'https://wakana.online/annuaire-amcham';

  constructor(private http: HttpClient) {}

  /**
   * Sauvegarder un pays AMCHAM - POST /api/country-amchams/save
   */
  saveCountryAmcham(countryAmchamData: CountryAmcham): Observable<CountryAmchamResponse> {
    const formData = this.createFormData(countryAmchamData);
    
    return this.http.post<CountryAmchamResponse>(`${this.baseUrl}/api/country-amchams/save`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtenir tous les pays AMCHAM - GET /api/country-amchams
   */
  getAllCountryAmchams(): Observable<CountryAmchamResponse[]> {
    return this.http.get<CountryAmchamResponse[]>(`${this.baseUrl}/api/country-amchams`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtenir un pays AMCHAM par son ID - GET /api/country-amchams/{id}
   */
  getCountryAmchamById(id: number): Observable<CountryAmchamResponse> {
    return this.http.get<CountryAmchamResponse>(`${this.baseUrl}/api/country-amchams/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Mettre à jour un pays AMCHAM - PUT /api/country-amchams/{id}
   */
  updateCountryAmcham(id: number, countryAmchamData: CountryAmcham): Observable<CountryAmchamResponse> {
    const formData = this.createFormData(countryAmchamData);
    
    return this.http.put<CountryAmchamResponse>(`${this.baseUrl}/api/country-amchams/${id}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Supprimer un pays AMCHAM - DELETE /api/country-amchams/{id}
   */
  deleteCountryAmcham(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/country-amchams/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Rechercher des pays AMCHAM - GET /api/country-amchams/search
   */
  searchCountryAmchams(query: string): Observable<CountryAmchamResponse[]> {
    return this.http.get<CountryAmchamResponse[]>(`${this.baseUrl}/api/country-amchams/search`, {
      params: { query }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Créer FormData pour l'upload de fichiers
   */
  private createFormData(countryAmchamData: CountryAmcham): FormData {
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('countryId', countryAmchamData.countryId?.toString() || '');
    formData.append('name', countryAmchamData.name || '');
    formData.append('address', countryAmchamData.address || '');
    formData.append('telephone', countryAmchamData.telephone || '');
    formData.append('email', countryAmchamData.email || '');
    formData.append('website', countryAmchamData.website || '');
    
    // Ajouter le fichier logo si présent
    if (countryAmchamData.logoFile) {
      formData.append('logoFile', countryAmchamData.logoFile);
    }

    return formData;
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
    
    console.error('Erreur CountryAmchamService:', error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }

  /**
   * Messages d'erreur selon le statut HTTP
   */
  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Données invalides';
      case 401:
        return 'Non autorisé';
      case 403:
        return 'Accès interdit';
      case 404:
        return 'Ressource non trouvée';
      case 409:
        return 'Un pays AMCHAM avec ce nom existe déjà';
      case 413:
        return 'Fichier trop volumineux';
      case 500:
        return 'Erreur interne du serveur';
      default:
        return 'Erreur de connexion';
    }
  }
}