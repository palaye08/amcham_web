// apropos.component.ts - VERSION CORRIGÉE
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderMembreComponent } from "../header-membre/header-membre.component";
import { LanguageService } from '../../../services/language.service';
import { AuthService, User } from '../../../services/auth.service';
import { CompanyService, Company } from '../../../services/company.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apropos',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule, HeaderMembreComponent],
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.css']
})
export class AproposComponent implements OnInit, OnDestroy {
  companyForm!: FormGroup;
  selectedCountry = 'États-Unis';
  logoFile: File | null = null;
  logoPreview: string | null = null;
  currentRoute: string = '/apropos';
  private langSubscription!: Subscription;
  currentLang = 'fr';
  isLoading = true;
  errorMessage = '';
  
  companyData: Company | null = null;
  currentUser: User | null = null;

  get texts() {
    return this.currentLang === 'fr' ? {
      companyLogo: 'Logo de l\'entreprise',
      changeLogo: 'Changer de logo',
      delete: 'Supprimer',
      fileFormat: 'Format recommandé: PNG, JPG. Taille maximale: 2MB.',
      companyInfo: 'Informations de l\'entreprise',
      companyName: 'Nom de l\'entreprise',
      sector: 'Secteur d\'activité',
      description: 'Description de l\'entreprise',
      descriptionHint: 'Cette description apparaîtra sur votre profil public.',
      location: 'Localisation',
      country: 'Pays',
      city: 'Ville',
      address: 'Adresse complète',
      contact: 'Contact',
      email: 'Email',
      phone: 'Téléphone',
      website: 'Site web',
      save: 'Enregistrer les modifications',
      preview: 'Aperçu du profil public',
      requiredField: 'Ce champ est obligatoire.',
      invalidEmail: 'Veuillez saisir une adresse email valide.',
      minLength: 'Minimum {length} caractères requis.',
      maxLength: 'Maximum {length} caractères autorisés.',
      invalidPhone: 'Format de téléphone invalide.',
      invalidUrl: 'Veuillez saisir une URL valide.',
      invalidField: 'Champ invalide.',
      saveSuccess: 'Les informations de l\'entreprise ont été sauvegardées avec succès !',
      formErrors: 'Veuillez corriger les erreurs dans le formulaire.',
      previewFeature: 'Fonctionnalité de prévisualisation à implémenter.',
      fillRequired: 'Veuillez remplir correctement tous les champs obligatoires.',
      fileTypeError: 'Seuls les fichiers PNG et JPG sont autorisés.',
      fileSizeError: 'La taille du fichier ne doit pas dépasser 2MB.',
      fileReadError: 'Erreur lors de la lecture du fichier.',
      loading: 'Chargement des informations...',
      errorLoading: 'Erreur lors du chargement des informations de l\'entreprise',
      noCompany: 'Aucune entreprise associée à votre compte'
    } : {
      companyLogo: 'Company Logo',
      changeLogo: 'Change logo',
      delete: 'Delete',
      fileFormat: 'Recommended format: PNG, JPG. Maximum size: 2MB.',
      companyInfo: 'Company Information',
      companyName: 'Company Name',
      sector: 'Business Sector',
      description: 'Company Description',
      descriptionHint: 'This description will appear on your public profile.',
      location: 'Location',
      country: 'Country',
      city: 'City',
      address: 'Full Address',
      contact: 'Contact',
      email: 'Email',
      phone: 'Phone',
      website: 'Website',
      save: 'Save Changes',
      preview: 'Public Profile Preview',
      requiredField: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      minLength: 'Minimum {length} characters required.',
      maxLength: 'Maximum {length} characters allowed.',
      invalidPhone: 'Invalid phone format.',
      invalidUrl: 'Please enter a valid URL.',
      invalidField: 'Invalid field.',
      saveSuccess: 'Company information has been successfully saved!',
      formErrors: 'Please correct the errors in the form.',
      previewFeature: 'Preview feature to be implemented.',
      fillRequired: 'Please fill all required fields correctly.',
      fileTypeError: 'Only PNG and JPG files are allowed.',
      fileSizeError: 'File size must not exceed 2MB.',
      fileReadError: 'Error reading file.',
      loading: 'Loading company information...',
      errorLoading: 'Error loading company information',
      noCompany: 'No company associated with your account'
    };
  }

  get countries() {
    return this.currentLang === 'fr' ? [
      { name: 'États-Unis', flag: '🇺🇸', code: 'US' },
      { name: 'France', flag: '🇫🇷', code: 'FR' },
      { name: 'Canada', flag: '🇨🇦', code: 'CA' },
      { name: 'Allemagne', flag: '🇩🇪', code: 'DE' },
      { name: 'Royaume-Uni', flag: '🇬🇧', code: 'GB' },
      { name: 'Espagne', flag: '🇪🇸', code: 'ES' },
      { name: 'Italie', flag: '🇮🇹', code: 'IT' },
      { name: 'Brésil', flag: '🇧🇷', code: 'BR' }
    ] : [
      { name: 'United States', flag: '🇺🇸', code: 'US' },
      { name: 'France', flag: '🇫🇷', code: 'FR' },
      { name: 'Canada', flag: '🇨🇦', code: 'CA' },
      { name: 'Germany', flag: '🇩🇪', code: 'DE' },
      { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
      { name: 'Spain', flag: '🇪🇸', code: 'ES' },
      { name: 'Italy', flag: '🇮🇹', code: 'IT' },
      { name: 'Brazil', flag: '🇧🇷', code: 'BR' }
    ];
  }

  get sectors() {
    return this.currentLang === 'fr' ? [
      'Technologie', 'Finance', 'Santé', 'Éducation', 'Commerce',
      'Industrie', 'Services', 'Agriculture', 'Transport', 'Énergie',
      'Immobilier', 'Tourisme'
    ] : [
      'Technology', 'Finance', 'Health', 'Education', 'Commerce',
      'Industry', 'Services', 'Agriculture', 'Transport', 'Energy',
      'Real Estate', 'Tourism'
    ];
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService,
    private authService: AuthService,
    private companyService: CompanyService
  ) {
    this.initializeForm();
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateFormWithCompanyData();
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
    this.loadCompanyData();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  /**
   * ✅ MÉTHODE PRINCIPALE - Chargement des données
   */
  private loadCompanyData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('🔍 [Apropos] Chargement des données entreprise...');

    // ✅ Appel direct à getMe() qui retourne les données complètes
    this.authService.getMe().subscribe({
      next: (user: User) => {
        console.log('✅ [Apropos] Utilisateur récupéré:', user);
        console.log('📌 [Apropos] CompanyId:', user.companyId);
        
        this.currentUser = user;

        // Vérifier si l'utilisateur a une entreprise
        if (!user.companyId) {
          console.warn('⚠️ [Apropos] Aucun companyId pour cet utilisateur');
          this.errorMessage = this.texts.noCompany;
          this.isLoading = false;
          return;
        }

        // Charger les données de l'entreprise
        this.loadCompanyById(user.companyId);
      },
      error: (error) => {
        console.error('❌ [Apropos] Erreur lors du chargement utilisateur:', error);
        this.errorMessage = this.texts.errorLoading;
        this.isLoading = false;
      }
    });
  }

  /**
   * Charger les données de l'entreprise par ID
   */
  private loadCompanyById(companyId: number): void {
    console.log('🔍 [Apropos] Chargement entreprise ID:', companyId);
    
    this.companyService.getCompanyById(companyId).subscribe({
      next: (company: Company) => {
        console.log('✅ [Apropos] Entreprise chargée:', company);
        this.companyData = company;
        this.updateFormWithCompanyData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [Apropos] Erreur chargement entreprise:', error);
        this.errorMessage = this.texts.errorLoading;
        this.isLoading = false;
      }
    });
  }

  private initializeForm(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      sector: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]],
      website: ['', [Validators.required, this.urlValidator]]
    });
  }

  private updateFormWithCompanyData(): void {
    if (this.companyForm && this.companyData) {
      this.companyForm.patchValue({
        companyName: this.companyData.name || '',
        sector: this.companyData.sector || '',
        description: this.companyData.description || '',
        country: this.companyData.country || '',
        city: this.extractCityFromAddress(this.companyData.address) || '',
        address: this.companyData.address || '',
        email: this.companyData.email || '',
        phone: this.companyData.telephone || '',
        website: this.companyData.webLink || ''
      });

      this.selectedCountry = this.companyData.country || 'États-Unis';

      if (this.companyData.pictures && this.companyData.pictures.length > 0) {
        this.logoPreview = this.companyData.pictures[0];
      }
    }
  }

  private extractCityFromAddress(address: string): string {
    if (!address) return '';
    const parts = address.split(',');
    return parts.length > 1 ? parts[parts.length - 2]?.trim() || '' : '';
  }

  private urlValidator(control: any) {
    if (!control.value) return null;
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(control.value) ? null : { invalidUrl: true };
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert(this.texts.fileTypeError);
      this.resetFileInput(event);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(this.texts.fileSizeError);
      this.resetFileInput(event);
      return;
    }

    this.logoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoPreview = e.target?.result as string;
    };
    reader.onerror = () => {
      alert(this.texts.fileReadError);
      this.resetFileInput(event);
    };
    reader.readAsDataURL(file);
  }

  onLogoDelete(): void {
    this.logoFile = null;
    this.logoPreview = null;
    const fileInput = document.getElementById('logoInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  private resetFileInput(event: any): void {
    if (event.target) event.target.value = '';
  }

  onCountryChange(event: any): void {
    this.selectedCountry = event.target.value;
    console.log('Pays sélectionné:', this.selectedCountry);
  }

  getSelectedCountryFlag(): string {
    const country = this.countries.find(c => c.name === this.selectedCountry);
    return country ? country.flag : '🌍';
  }

  get formControls() {
    return this.companyForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.companyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.companyForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) return this.texts.requiredField;
    if (errors['email']) return this.texts.invalidEmail;
    if (errors['minlength']) return this.texts.minLength.replace('{length}', errors['minlength'].requiredLength);
    if (errors['maxlength']) return this.texts.maxLength.replace('{length}', errors['maxlength'].requiredLength);
    if (errors['pattern']) return this.texts.invalidPhone;
    if (errors['invalidUrl']) return this.texts.invalidUrl;
    return this.texts.invalidField;
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      Object.keys(this.companyForm.controls).forEach(key => {
        this.companyForm.get(key)?.markAsTouched();
      });
      alert(this.texts.formErrors);
      return;
    }

    const formData = new FormData();
    Object.keys(this.companyForm.value).forEach(key => {
      formData.append(key, this.companyForm.value[key]);
    });
    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }
    console.log('Company data:', this.companyForm.value);
    console.log('Logo file:', this.logoFile);
    alert(this.texts.saveSuccess);
  }

  resetForm(): void {
    this.companyForm.reset();
    this.onLogoDelete();
    this.updateFormWithCompanyData();
  }

  previewChanges(): void {
    if (this.companyForm.valid) {
      const previewData = {
        ...this.companyForm.value,
        logo: this.logoPreview
      };
      console.log('Preview data:', previewData);
      alert(this.texts.previewFeature);
    } else {
      alert(this.texts.fillRequired);
    }
  }
}