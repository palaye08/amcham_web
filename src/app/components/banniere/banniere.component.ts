import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';
import { CardStateComponent } from "../card-state/card-state.component";

interface Banniere {
  id: number;
  titre: string;
  description: string;
  lien: string;
  statut: 'Actif' | 'Expiré' | 'En attente' | 'Active' | 'Expired' | 'Pending';
  dateDebut: string;
  dateFin: string;
  imageWeb: string;
  imageMobile: string;
  permanent: boolean;
}

@Component({
  selector: 'app-banniere',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderAdminComponent, CardStateComponent],
  templateUrl: './banniere.component.html',
  styleUrls: ['./banniere.component.css']
})
export class BanniereComponent implements OnInit, OnDestroy {
  showAddBanniereModal = false;
  banniereForm!: FormGroup;
  bannieres: Banniere[] = [
    {
      id: 1,
      titre: 'Sélectionnées d\'investissement',
      description: 'Conférence annuelle AmCham',
      lien: 'https://example.com/investissement',
      statut: 'Actif',
      dateDebut: '01/01/2024',
      dateFin: '31/12/2024',
      imageWeb: 'banniere-web-1.jpg',
      imageMobile: 'banniere-mobile-1.jpg',
      permanent: false
    },
    {
      id: 2,
      titre: 'Programme de partenariat',
      description: 'Opportunités de collaboration',
      lien: 'https://example.com/partenariat',
      statut: 'Actif',
      dateDebut: '15/02/2024',
      dateFin: '15/08/2024',
      imageWeb: 'banniere-web-2.jpg',
      imageMobile: 'banniere-mobile-2.jpg',
      permanent: false
    },
    {
      id: 3,
      titre: 'Événement spécial',
      description: 'Networking et business',
      lien: 'https://example.com/evenement',
      statut: 'Expiré',
      dateDebut: '01/03/2024',
      dateFin: '30/04/2024',
      imageWeb: 'banniere-web-3.jpg',
      imageMobile: 'banniere-mobile-3.jpg',
      permanent: false
    }
  ];

  filteredBannieres: Banniere[] = [...this.bannieres];
  selectedStatus = 'all';
  searchTerm = '';
  currentRoute: string;
  private langSubscription!: Subscription;
  currentLang = 'fr';

  // Statistiques calculées
  get stats() {
    const totalBannieres = this.bannieres.length;
    const activeBannieres = this.bannieres.filter(b => b.statut === 'Actif' || b.statut === 'Active').length;
    
    const searches = 1243;
    const lastWeekSearches = Math.floor(searches * 0.05);
    
    const adClicks = 348;
    const lastMonthClicks = Math.floor(adClicks * 0.18);

    return {
      totalBannieres,
      activeBannieres,
      banniereGrowth: totalBannieres > 0 ? Math.round((activeBannieres / totalBannieres) * 100) : 0,
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
      bannerManagement: 'Gestion des bannières publicitaires',
      totalBanners: 'Bannières totales',
      activeBanners: 'Bannières actives',
      sinceLastMonth: 'depuis le mois dernier',
      searches: 'Recherches',
      sinceLastWeek: 'depuis la semaine dernière',
      adClicks: 'Clics sur publicités',
      searchPlaceholder: 'Rechercher ici...',
      allStatuses: 'Tous les statuts',
      addBanner: 'Ajouter une bannière',
      title: 'Titre',
      description: 'Description',
      link: 'Lien',
      create:'Enregistrer',
      status: 'Statut',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      actions: 'Actions',
      active: 'Actif',
      expired: 'Expiré',
      pending: 'En attente',
      newBanner: 'Nouvelle bannière publicitaire',
      bannerTitle: 'Titre',
      bannerDescription: 'Description',
      websiteLink: 'Lien vers un site web',
      permanent: 'Permanent',
      startDateRequired: 'Date de début',
      endDateRequired: 'Date de fin',
      webImage: 'Image (WEB)',
      mobileImage: 'Image (Mobile)',
      chooseFile: 'Choisir un fichier',
      noFileChosen: 'Aucun fichier choisi',
      save: 'Enregistrer',
      cancel: 'Annuler',
      enter: 'Saisir',
      writeDescription: 'Écrivez une description',
      exampleTitle: 'Ex: Opportunités d\'investissement',
      exampleLink: 'Ex: https://example.com',
      dateFormat: 'jj/mm/aaaa',
      view: 'Voir',
      edit: 'Modifier',
      partnership: 'Partenariat',
      investmentSelection: 'Sélectionnées d\'investissement',
      annualConference: 'Conférence annuelle AmCham',
      partnershipProgram: 'Programme de partenariat'
    } : {
      bannerManagement: 'Banner Management',
      totalBanners: 'Total Banners',
      activeBanners: 'Active Banners',
      sinceLastMonth: 'since last month',
      searches: 'Searches',
      sinceLastWeek: 'since last week',
      adClicks: 'Ad Clicks',
      searchPlaceholder: 'Search here...',
      allStatuses: 'All statuses',
      addBanner: 'Add Banner',
      title: 'Title',
      description: 'Description',
      link: 'Link',
      status: 'Status',
      startDate: 'Start Date',
      endDate: 'End Date',
      actions: 'Actions',
      active: 'Active',
      create:'Saved', 
      expired: 'Expired',
      pending: 'Pending',
      newBanner: 'New Banner',
      bannerTitle: 'Title',
      bannerDescription: 'Description',
      websiteLink: 'Website Link',
      permanent: 'Permanent',
      startDateRequired: 'Start Date',
      endDateRequired: 'End Date',
      webImage: 'Image (WEB)',
      mobileImage: 'Image (Mobile)',
      chooseFile: 'Choose File',
      noFileChosen: 'No file chosen',
      save: 'Save',
      cancel: 'Cancel',
      enter: 'Enter',
      writeDescription: 'Write a description',
      exampleTitle: 'Ex: Investment Opportunities',
      exampleLink: 'Ex: https://example.com',
      dateFormat: 'dd/mm/yyyy',
      view: 'View',
      edit: 'Edit',
      partnership: 'Partnership',
      investmentSelection: 'Investment Selection',
      annualConference: 'Annual AmCham Conference',
      partnershipProgram: 'Partnership Program'
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
      this.updateBannieresLanguage();
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
    this.updateBannieresLanguage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.banniereForm = this.fb.group({
      titre: ['', [Validators.required]],
      description: [''],
      lien: ['', [Validators.required]],
      permanent: [false],
      dateDebut: ['', [Validators.required]],
      dateFin: [''],
      imageWeb: [''],
      imageMobile: ['']
    });
  }

  private updateBannieresLanguage(): void {
    this.bannieres = this.bannieres.map(banniere => ({
      ...banniere,
      statut: this.translateStatus(banniere.statut)
    }));
    this.filterBannieres();
  }

  private translateStatus(status: string): any {
    const statusMap = this.currentLang === 'fr' ? {
      'Active': 'Actif',
      'Expired': 'Expiré',
      'Pending': 'En attente'
    } : {
      'Actif': 'Active',
      'Expiré': 'Expired',
      'En attente': 'Pending'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterBannieres();
  }

  onStatusFilter(event: any): void {
    this.selectedStatus = event.target.value;
    this.filterBannieres();
  }

  private filterBannieres(): void {
    this.filteredBannieres = this.bannieres.filter(banniere => {
      const matchesSearch = banniere.titre.toLowerCase().includes(this.searchTerm) ||
                          banniere.description.toLowerCase().includes(this.searchTerm) ||
                          banniere.lien.toLowerCase().includes(this.searchTerm);
      
      const matchesStatus = this.selectedStatus === 'all' || banniere.statut === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  openAddBanniereModal(): void {
    this.showAddBanniereModal = true;
    this.banniereForm.reset({ permanent: false });
  }

  closeAddBanniereModal(): void {
    this.showAddBanniereModal = false;
  }

  onWebImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Web image selected:', file);
      this.banniereForm.patchValue({ imageWeb: file.name });
    }
  }

  onMobileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Mobile image selected:', file);
      this.banniereForm.patchValue({ imageMobile: file.name });
    }
  }

  onSubmit(): void {
    if (this.banniereForm.valid) {
      const newBanniere: Banniere = {
        id: this.bannieres.length + 1,
        titre: this.banniereForm.get('titre')?.value,
        description: this.banniereForm.get('description')?.value,
        lien: this.banniereForm.get('lien')?.value,
        permanent: this.banniereForm.get('permanent')?.value,
        dateDebut: this.banniereForm.get('dateDebut')?.value,
        dateFin: this.banniereForm.get('dateFin')?.value || '',
        imageWeb: this.banniereForm.get('imageWeb')?.value || 'default-web.jpg',
        imageMobile: this.banniereForm.get('imageMobile')?.value || 'default-mobile.jpg',
        statut: 'En attente'
      };

      this.bannieres.push(newBanniere);
      this.filterBannieres();
      this.closeAddBanniereModal();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Actif':
      case 'Active':
        return 'text-green-600';
      case 'Expiré':
      case 'Expired':
        return 'text-red-600';
      case 'En attente':
      case 'Pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  }

  viewBanniere(banniere: Banniere): void {
    console.log('View banniere:', banniere);
  }

  editBanniere(banniere: Banniere): void {
    console.log('Edit banniere:', banniere);
  }

  toggleBanniereStatus(banniere: Banniere): void {
    if (banniere.statut === 'Actif' || banniere.statut === 'Active') {
      banniere.statut = this.currentLang === 'fr' ? 'Expiré' : 'Expired';
    } else {
      banniere.statut = this.currentLang === 'fr' ? 'Actif' : 'Active';
    }
  }

  onPermanentChange(): void {
    const permanent = this.banniereForm.get('permanent')?.value;
    if (permanent) {
      this.banniereForm.get('dateFin')?.clearValidators();
    } else {
      this.banniereForm.get('dateFin')?.setValidators([Validators.required]);
    }
    this.banniereForm.get('dateFin')?.updateValueAndValidity();
  }
}