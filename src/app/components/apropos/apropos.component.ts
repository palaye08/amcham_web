import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderMembreComponent } from "../header-membre/header-membre.component";
import { LanguageService } from '../../../services/language.service';
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

  // Textes dynamiques
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
      fileReadError: 'Erreur lors de la lecture du fichier.'
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
      fileReadError: 'Error reading file.'
    };
  }

  // Pays avec traductions
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

  // Secteurs avec traductions
  get sectors() {
    return this.currentLang === 'fr' ? [
      'Technologie',
      'Finance',
      'Santé',
      'Éducation',
      'Commerce',
      'Industrie',
      'Services',
      'Agriculture',
      'Transport',
      'Énergie',
      'Immobilier',
      'Tourisme'
    ] : [
      'Technology',
      'Finance',
      'Health',
      'Education',
      'Commerce',
      'Industry',
      'Services',
      'Agriculture',
      'Transport',
      'Energy',
      'Real Estate',
      'Tourism'
    ];
  }

  // Données de l'entreprise avec traductions
  get companyData() {
    return this.currentLang === 'fr' ? {
      name: 'Global Tech Solutions',
      sector: 'Finance',
      description: 'Global Tech Solutions est une entreprise leader dans le domaine des solutions technologiques innovantes. Nous aidons les entreprises à transformer leurs opérations grâce à des technologies de pointe et des services de conseil stratégique.',
      country: 'États-Unis',
      city: 'Boston',
      address: '123 Innovation Street, Boston, MA 02110',
      email: 'contact@globaltechsolutions.com',
      phone: '+1 555-123-4567',
      website: 'https://example.com'
    } : {
      name: 'Global Tech Solutions',
      sector: 'Finance',
      description: 'Global Tech Solutions is a leader in innovative technology solutions. We help businesses transform their operations through cutting-edge technologies and strategic consulting services.',
      country: 'United States',
      city: 'Boston',
      address: '123 Innovation Street, Boston, MA 02110',
      email: 'contact@globaltechsolutions.com',
      phone: '+1 555-123-4567',
      website: 'https://example.com'
    };
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.initializeForm();
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    // S'abonner aux changements de langue
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateFormWithTranslatedData();
    });
    
    // Initialiser la langue
    this.currentLang = this.languageService.getCurrentLanguage();
    this.updateFormWithTranslatedData();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.companyForm = this.fb.group({
      companyName: [this.companyData.name, [Validators.required, Validators.minLength(2)]],
      sector: [this.companyData.sector, [Validators.required]],
      description: [
        this.companyData.description,
        [Validators.required, Validators.minLength(50), Validators.maxLength(500)]
      ],
      country: [this.companyData.country, [Validators.required]],
      city: [this.companyData.city, [Validators.required, Validators.minLength(2)]],
      address: [this.companyData.address, [Validators.required, Validators.minLength(10)]],
      email: [this.companyData.email, [Validators.required, Validators.email]],
      phone: [this.companyData.phone, [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]],
      website: [this.companyData.website, [Validators.required, this.urlValidator]]
    });
  }

  private updateFormWithTranslatedData(): void {
    if (this.companyForm) {
      this.companyForm.patchValue({
        companyName: this.companyData.name,
        sector: this.companyData.sector,
        description: this.companyData.description,
        country: this.companyData.country,
        city: this.companyData.city,
        address: this.companyData.address,
        email: this.companyData.email,
        phone: this.companyData.phone,
        website: this.companyData.website
      });
    }
  }

  // Validateur personnalisé pour les URLs
  private urlValidator(control: any) {
    if (!control.value) {
      return null;
    }
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (!urlPattern.test(control.value)) {
      return { invalidUrl: true };
    }
    
    return null;
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    // Validation du type de fichier
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert(this.texts.fileTypeError);
      this.resetFileInput(event);
      return;
    }

    // Validation de la taille (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(this.texts.fileSizeError);
      this.resetFileInput(event);
      return;
    }

    this.logoFile = file;
    
    // Créer un aperçu de l'image
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
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private resetFileInput(event: any): void {
    if (event.target) {
      event.target.value = '';
    }
  }

  onCountryChange(event: any): void {
    const selectedCountryName = event.target.value;
    this.selectedCountry = selectedCountryName;
    console.log('Pays sélectionné:', selectedCountryName);
  }

  getSelectedCountryFlag(): string {
    const country = this.countries.find(c => c.name === this.selectedCountry);
    return country ? country.flag : '🌍';
  }

  // Getter pour faciliter l'accès aux contrôles du formulaire
  get formControls() {
    return this.companyForm.controls;
  }

  // Méthodes utilitaires pour la validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.companyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.companyForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return this.texts.requiredField;
    }
    if (errors['email']) {
      return this.texts.invalidEmail;
    }
    if (errors['minlength']) {
      return this.texts.minLength.replace('{length}', errors['minlength'].requiredLength);
    }
    if (errors['maxlength']) {
      return this.texts.maxLength.replace('{length}', errors['maxlength'].requiredLength);
    }
    if (errors['pattern']) {
      return this.texts.invalidPhone;
    }
    if (errors['invalidUrl']) {
      return this.texts.invalidUrl;
    }

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

    if (this.companyForm.valid) {
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
  }

  resetForm(): void {
    this.companyForm.reset();
    this.onLogoDelete();
    this.initializeForm();
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