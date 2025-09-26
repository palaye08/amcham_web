import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderMembreComponent } from "../header-membre/header-membre.component";
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-horaire',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule, HeaderMembreComponent],
  templateUrl: './horaire.component.html',
  styleUrls: ['./horaire.component.css']
})
export class HoraireComponent implements OnInit, OnDestroy {
  horaireForm!: FormGroup;
  currentRoute: string;
  private langSubscription!: Subscription;
  currentLang = 'fr';

  joursSemaine = [
    { nom: 'Lundi', value: 'lundi', ouvert: true, ouverture: '09:00', fermeture: '18:00' },
    { nom: 'Mardi', value: 'mardi', ouvert: true, ouverture: '09:00', fermeture: '18:00' },
    { nom: 'Mercredi', value: 'mercredi', ouvert: true, ouverture: '09:00', fermeture: '18:00' },
    { nom: 'Jeudi', value: 'jeudi', ouvert: true, ouverture: '09:00', fermeture: '18:00' },
    { nom: 'Vendredi', value: 'vendredi', ouvert: true, ouverture: '09:00', fermeture: '18:00' },
    { nom: 'Samedi', value: 'samedi', ouvert: false, ouverture: '', fermeture: '' },
    { nom: 'Dimanche', value: 'dimanche', ouvert: false, ouverture: '', fermeture: '' }
  ];

  // Textes dynamiques
  get texts() {
    return this.currentLang === 'fr' ? {
      title: 'Horaires d\'ouverture',
      day: 'Jour',
      availability: 'Disponibilité',
      opening: 'Ouverture',
      closing: 'Fermeture',
      open: 'Ouvert',
      closed: 'Fermé',
      cancel: 'Annuler',
      saveButton: 'Enregistrer les modifications',
      saveSuccess: 'Les horaires ont été sauvegardés avec succès !',
      requiredField: 'Ce champ est obligatoire.',
      invalidTimeFormat: 'Format horaire invalide (HH:MM).',
      invalidField: 'Champ invalide.',
      formError: 'Veuillez corriger les erreurs dans le formulaire.',
      companyName: 'Global Tech Solutions',
      companySector: 'Finance',
      companyAddress: '123 Innovation Street, Boston, MA 02110',
      companyPhone: '+1 555-123-4567',
      companyWebsite: 'www.exemple.us',
      profilePreview: 'Aperçu du profil public',
      profileWarning: 'Votre profil n\'est pas encore visible par le public. Complétez vos informations pour activer votre profil.'
    } : {
      title: 'Opening Hours',
      day: 'Day',
      availability: 'Availability',
      opening: 'Opening',
      closing: 'Closing',
      open: 'Open',
      closed: 'Closed',
      cancel: 'Cancel',
      saveButton: 'Save changes',
      saveSuccess: 'Opening hours have been saved successfully!',
      requiredField: 'This field is required.',
      invalidTimeFormat: 'Invalid time format (HH:MM).',
      invalidField: 'Invalid field.',
      formError: 'Please correct the errors in the form.',
      companyName: 'Global Tech Solutions',
      companySector: 'Finance',
      companyAddress: '123 Innovation Street, Boston, MA 02110',
      companyPhone: '+1 555-123-4567',
      companyWebsite: 'www.example.us',
      profilePreview: 'Public profile preview',
      profileWarning: 'Your profile is not yet visible to the public. Complete your information to activate your profile.'
    };
  }

  // Données de l'entreprise avec traductions
  get companyData() {
    return this.currentLang === 'fr' ? {
      name: 'Global Tech Solutions',
      sector: 'Finance',
      address: '123 Innovation Street, Boston, MA 02110',
      phone: '+1 555-123-4567',
      website: 'www.exemple.us'
    } : {
      name: 'Global Tech Solutions',
      sector: 'Finance',
      address: '123 Innovation Street, Boston, MA 02110',
      phone: '+1 555-123-4567',
      website: 'www.example.us'
    };
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    // S'abonner aux changements de langue
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    
    // Initialiser la langue
    this.currentLang = this.languageService.getCurrentLanguage();
    
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    const formControls: any = {};

    this.joursSemaine.forEach(jour => {
      formControls[`${jour.value}_ouvert`] = [jour.ouvert, Validators.required];
      formControls[`${jour.value}_ouverture`] = [jour.ouverture, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)];
      formControls[`${jour.value}_fermeture`] = [jour.fermeture, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)];
    });

    this.horaireForm = this.fb.group(formControls);
  }

  toggleJour(jourValue: string): void {
    const ouvertControl = this.horaireForm.get(`${jourValue}_ouvert`);
    const ouvertureControl = this.horaireForm.get(`${jourValue}_ouverture`);
    const fermetureControl = this.horaireForm.get(`${jourValue}_fermeture`);

    if (ouvertControl) {
      const nouvelEtat = !ouvertControl.value;
      ouvertControl.setValue(nouvelEtat);

      if (nouvelEtat) {
        // Si on ouvre, on met des valeurs par défaut
        ouvertureControl?.setValue('09:00');
        fermetureControl?.setValue('18:00');
        ouvertureControl?.setValidators([Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]);
        fermetureControl?.setValidators([Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]);
      } else {
        // Si on ferme, on vide les champs
        ouvertureControl?.setValue('');
        fermetureControl?.setValue('');
        ouvertureControl?.clearValidators();
        fermetureControl?.clearValidators();
      }

      ouvertureControl?.updateValueAndValidity();
      fermetureControl?.updateValueAndValidity();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.horaireForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.horaireForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return this.texts.requiredField;
    }
    if (errors['pattern']) {
      return this.texts.invalidTimeFormat;
    }

    return this.texts.invalidField;
  }

  onSubmit(): void {
    if (this.horaireForm.invalid) {
      Object.keys(this.horaireForm.controls).forEach(key => {
        this.horaireForm.get(key)?.markAsTouched();
      });
      
      alert(this.texts.formError);
      return;
    }

    if (this.horaireForm.valid) {
      const horaires = this.joursSemaine.map(jour => {
        const ouvert = this.horaireForm.get(`${jour.value}_ouvert`)?.value;
        const ouverture = this.horaireForm.get(`${jour.value}_ouverture`)?.value;
        const fermeture = this.horaireForm.get(`${jour.value}_fermeture`)?.value;

        return {
          jour: jour.nom,
          ouvert: ouvert,
          ouverture: ouvert ? ouverture : '',
          fermeture: ouvert ? fermeture : ''
        };
      });

      console.log('Horaires sauvegardés:', horaires);
      alert(this.texts.saveSuccess);
    }
  }

  resetForm(): void {
    this.initializeForm();
  }
}