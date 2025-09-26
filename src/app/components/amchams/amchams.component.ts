import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';
import { CardStateComponent } from "../card-state/card-state.component";

interface Amcham {
  id: number;
  nom: string;
  pays: string;
  email: string;
  telephone: string;
  date: string;
  logo?: string;
  adresse?: string;
  siteWeb?: string;
  president?: string;
  description?: string;
}

@Component({
  selector: 'app-amchams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderAdminComponent, CardStateComponent],
  templateUrl: './amchams.component.html',
  styleUrls: ['./amchams.component.css']
})
export class AmchamsComponent implements OnInit, OnDestroy {
  showAddAmchamModal = false;
  amchamForm!: FormGroup;
  amchams: Amcham[] = [
    {
      id: 1,
      nom: 'Amcham Sénégal',
      pays: 'Sénégal',
      email: 'contact@amchamsenegal.org',
      telephone: '+221 33 849 05 00',
      date: '12/05/2025',
      adresse: 'Dakar, Sénégal',
      siteWeb: 'https://amchamsenegal.org',
      president: 'Mamadou Diallo',
      description: 'Chambre de Commerce Américaine au Sénégal'
    },
    {
      id: 2,
      nom: 'Amcham États-Unis',
      pays: 'États-Unis',
      email: 'contact@amchamsenegal.us',
      telephone: '+1 323 123 1334',
      date: '15/05/2025',
      adresse: 'New York, États-Unis',
      siteWeb: 'https://amchamusa.org',
      president: 'John Smith',
      description: 'Chambre de Commerce Américaine aux États-Unis'
    },
    {
      id: 3,
      nom: 'Amcham Maroc',
      pays: 'Maroc',
      email: 'amcham@amcham-morocco.com',
      telephone: '(212) 522 25 07',
      date: '10/04/2025',
      adresse: 'Casablanca, Maroc',
      siteWeb: 'https://amcham-morocco.com',
      president: 'Ahmed Benali',
      description: 'Chambre de Commerce Américaine au Maroc'
    }
  ];

  filteredAmchams: Amcham[] = [...this.amchams];
  searchTerm = '';
  currentRoute: string;
  private langSubscription!: Subscription;
  currentLang = 'fr';

  // Statistiques calculées
  get stats() {
    const totalAmchams = this.amchams.length;
    const lastMonthAmchams = this.amchams.filter(a => {
      const amchamDate = new Date(a.date.split('/').reverse().join('-'));
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return amchamDate > lastMonth;
    }).length;
    
    const searches = 1243;
    const lastWeekSearches = Math.floor(searches * 0.05);
    
    const adClicks = 348;
    const lastMonthClicks = Math.floor(adClicks * 0.18);

    return {
      totalAmchams,
      lastMonthAmchams,
      amchamGrowth: totalAmchams > 0 ? Math.round((lastMonthAmchams / totalAmchams) * 100) : 0,
      searches,
      lastWeekSearches,
      searchGrowth: 5,
      adClicks,
      lastMonthClicks,
      clickGrowth: 18
    };
  }

  // Textes dynamiques
  get texts() {
    return this.currentLang === 'fr' ? {
      amchamsManagement: 'Gestion des Amchams',
      totalAmchams: 'Amchams totaux',
      sinceLastMonth: 'depuis le mois dernier',
      searches: 'Recherches',
      sinceLastWeek: 'depuis la semaine dernière',
      adClicks: 'Clics sur publicités',
      searchPlaceholder: 'Rechercher ici...',
      allCountries: 'Tous les pays',
      addAmcham: 'Ajouter un pays',
      name: 'Nom',
      country: 'Pays',
      email: 'Email',
      phone: 'Téléphone',
      date: 'Date',
      actions: 'Actions',
      newAmcham: 'Nouveau Amcham',
      amchamName: 'Nom de l\'Amcham',
      amchamCountry: 'Pays de l\'Amcham',
      amchamAddress: 'Adresse de l\'Amcham',
      amchamPhone: 'Téléphone de l\'Amcham',
      amchamEmail: 'Email de l\'Amcham',
      website: 'Site Web',
      president: 'Président',
      description: 'Description',
      logo: 'Logo',
      chooseFile: 'Choisir un fichier',
      noFileChosen: 'Aucun fichier choisi',
      save: 'Enregistrer',
      cancel: 'Annuler',
      enter: 'Saisir',
      select: 'Sélectionner',
      senegal: 'Sénégal',
      unitedStates: 'États-Unis',
      morocco: 'Maroc',
      france: 'France',
      canada: 'Canada',
      unitedKingdom: 'Royaume-Uni',
      view: 'Voir',
      edit: 'Modifier',
      delete: 'Supprimer'
    } : {
      amchamsManagement: 'Amchams Management',
      totalAmchams: 'Total Amchams',
      sinceLastMonth: 'since last month',
      searches: 'Searches',
      sinceLastWeek: 'since last week',
      adClicks: 'Ad Clicks',
      searchPlaceholder: 'Search here...',
      allCountries: 'All countries',
      addAmcham: 'Add Country',
      name: 'Name',
      country: 'Country',
      email: 'Email',
      phone: 'Phone',
      date: 'Date',
      actions: 'Actions',
      newAmcham: 'New Amcham',
      amchamName: 'Amcham Name',
      amchamCountry: 'Amcham Country',
      amchamAddress: 'Amcham Address',
      amchamPhone: 'Amcham Phone',
      amchamEmail: 'Amcham Email',
      website: 'Website',
      president: 'President',
      description: 'Description',
      logo: 'Logo',
      chooseFile: 'Choose File',
      noFileChosen: 'No file chosen',
      save: 'Save',
      cancel: 'Cancel',
      enter: 'Enter',
      select: 'Select',
      senegal: 'Senegal',
      unitedStates: 'United States',
      morocco: 'Morocco',
      france: 'France',
      canada: 'Canada',
      unitedKingdom: 'United Kingdom',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete'
    };
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.currentRoute = this.router.url;
    this.initializeForm();
  }

  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateAmchamsLanguage();
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
    this.updateAmchamsLanguage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.amchamForm = this.fb.group({
      nom: ['', [Validators.required]],
      pays: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      siteWeb: [''],
      president: [''],
      description: [''],
      logo: ['']
    });
  }

  private updateAmchamsLanguage(): void {
    this.amchams = this.amchams.map(amcham => ({
      ...amcham,
      pays: this.translateCountry(amcham.pays)
    }));
    this.filterAmchams();
  }

  private translateCountry(country: string): string {
    const countryMap = this.currentLang === 'fr' ? {
      'Senegal': 'Sénégal',
      'United States': 'États-Unis',
      'Morocco': 'Maroc',
      'France': 'France',
      'Canada': 'Canada',
      'United Kingdom': 'Royaume-Uni'
    } : {
      'Sénégal': 'Senegal',
      'États-Unis': 'United States',
      'Maroc': 'Morocco',
      'France': 'France',
      'Canada': 'Canada',
      'Royaume-Uni': 'United Kingdom'
    };
    return countryMap[country as keyof typeof countryMap] || country;
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterAmchams();
  }

  private filterAmchams(): void {
    this.filteredAmchams = this.amchams.filter(amcham => {
      return amcham.nom.toLowerCase().includes(this.searchTerm) ||
             amcham.pays.toLowerCase().includes(this.searchTerm) ||
             amcham.email.toLowerCase().includes(this.searchTerm);
    });
  }

  openAddAmchamModal(): void {
    this.showAddAmchamModal = true;
    this.amchamForm.reset();
  }

  closeAddAmchamModal(): void {
    this.showAddAmchamModal = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
    }
  }

  onSubmit(): void {
    if (this.amchamForm.valid) {
      const newAmcham: Amcham = {
        id: this.amchams.length + 1,
        nom: this.amchamForm.get('nom')?.value,
        pays: this.amchamForm.get('pays')?.value || 'Sénégal',
        email: this.amchamForm.get('email')?.value,
        telephone: this.amchamForm.get('telephone')?.value,
        date: new Date().toLocaleDateString('fr-FR'),
        adresse: this.amchamForm.get('adresse')?.value,
        siteWeb: this.amchamForm.get('siteWeb')?.value,
        president: this.amchamForm.get('president')?.value,
        description: this.amchamForm.get('description')?.value
      };

      this.amchams.push(newAmcham);
      this.filterAmchams();
      this.closeAddAmchamModal();
    }
  }

  getCountryFlag(pays: string): string {
    const flags: { [key: string]: string } = {
      'Sénégal': '🇸🇳',
      'États-Unis': '🇺🇸',
      'Maroc': '🇲🇦',
      'Senegal': '🇸🇳',
      'United States': '🇺🇸',
      'Morocco': '🇲🇦',
      'France': '🇫🇷',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'Royaume-Uni': '🇬🇧'
    };
    return flags[pays] || '🌍';
  }

  viewAmcham(amcham: Amcham): void {
    console.log('View amcham:', amcham);
  }

  editAmcham(amcham: Amcham): void {
    console.log('Edit amcham:', amcham);
  }

  deleteAmcham(amcham: Amcham): void {
    const index = this.amchams.findIndex(a => a.id === amcham.id);
    if (index > -1) {
      this.amchams.splice(index, 1);
      this.filterAmchams();
    }
  }
}