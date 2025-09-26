  import { CommonModule } from '@angular/common';
  import { Component, OnInit, OnDestroy } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { HeaderAdminComponent } from "../header-admin/header-admin.component";
  import { LanguageService } from '../../../services/language.service';
  import { Subscription } from 'rxjs';
  import { CardStateComponent } from "../card-state/card-state.component";

  interface Membre {
    id: number;
    nom: string;
    secteur: string;
    pays: string; 
    statut: 'Actif' | 'Inactif' | 'En attente'|'Active'|'Inactive';
    date: string;
    logo?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    siteWeb?: string;
  }

  @Component({
    selector: 'app-membres',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HeaderAdminComponent, CardStateComponent],
    templateUrl: './membres.component.html',
    styleUrls: ['./membres.component.css']
  })
  export class MembresComponent implements OnInit, OnDestroy {
    showAddMemberModal = false;
    memberForm!: FormGroup;
    membres: Membre[] = [
      {
        id: 1,
        nom: 'Global Tech Solutions',
        secteur: 'Technologie',
        pays: 'États-Unis',
        statut: 'Actif',
        date: '12/05/2025',
        adresse: '123 Innovation Street, Boston, MA 02110',
        telephone: '+1 555-123-4567',
        email: 'contact@globaltech.com',
        siteWeb: 'https://globaltech.com'
      },
      {
        id: 2,
        nom: 'Finance Partners International',
        secteur: 'Finance',
        pays: 'France',
        statut: 'En attente',
        date: '15/05/2025',
        adresse: '45 Rue de la Finance, Paris 75001',
        telephone: '+33 1 42 86 83 00',
        email: 'info@financepartners.fr',
        siteWeb: 'https://financepartners.fr'
      },
      {
        id: 3,
        nom: 'Health Innovations Corp',
        secteur: 'Santé',
        pays: 'Canada',
        statut: 'Actif',
        date: '10/04/2025',
        adresse: '789 Health Street, Toronto, ON M5V 3A8',
        telephone: '+1 416-555-0123',
        email: 'contact@healthinnovations.ca',
        siteWeb: 'https://healthinnovations.ca'
      },
      {
        id: 4,
        nom: 'EduGlobal Network',
        secteur: 'Éducation',
        pays: 'Royaume-Uni',
        statut: 'Inactif',
        date: '05/03/2025',
        adresse: '12 Education Lane, London SW1A 1AA',
        telephone: '+44 20 7946 0958',
        email: 'hello@eduglobal.co.uk',
        siteWeb: 'https://eduglobal.co.uk'
      }
    ];

    filteredMembres: Membre[] = [...this.membres];
    selectedStatus = 'all';
    searchTerm = '';
    currentRoute: string;
    private langSubscription!: Subscription;
    currentLang = 'fr';


    // Statistiques calculées
    get stats() {
      const totalMembers = this.membres.length;
      const lastMonthMembers = this.membres.filter(m => {
        const memberDate = new Date(m.date.split('/').reverse().join('-'));
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return memberDate > lastMonth;
      }).length;
      
      const searches = 1243;
      const lastWeekSearches = Math.floor(searches * 0.05);
      
      const adClicks = 348;
      const lastMonthClicks = Math.floor(adClicks * 0.18);

      return {
        totalMembers,
        lastMonthMembers,
        memberGrowth: totalMembers > 0 ? Math.round((lastMonthMembers / totalMembers) * 100) : 0,
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
        membersManagement: 'Gestion des membres',
        totalMembers: 'Membres totaux',
        sinceLastMonth: 'depuis le mois dernier',
        searches: 'Recherches',
        sinceLastWeek: 'depuis la semaine dernière',
        adClicks: 'Clics sur publicités',
        searchPlaceholder: 'Rechercher ici...',
        allStatuses: 'Tous les status',
        addMember: 'Ajouter un membre',
        name: 'Nom',
        country: 'Pays',
        status: 'Statut',
        date: 'Date',
        actions: 'Actions',
        active: 'Actif',
        inactive: 'Inactif',
        pending: 'En attente',
        newMember: 'Nouveau Membre',
        companyName: 'Nom de l\'entreprise',
        companyAddress: 'Adresse de l\'entreprise',
        companyPhone: 'Téléphone de l\'entreprise',
        companyEmail: 'Email de l\'entreprise',
        activitySector: 'Secteur d\'activité',
        website: 'Site Web',
        logo: 'Logo',
        chooseFile: 'Choisir un fichier',
        noFileChosen: 'Aucun fichier choisi',
        save: 'Enregistrer',
        cancel: 'Annuler',
        enter: 'Saisir',
        select: 'Sélectionner',
        technology: 'Technologie',
        finance: 'Finance',
        health: 'Santé',
        education: 'Éducation',
        unitedStates: 'États-Unis',
        france: 'France',
        canada: 'Canada',
        unitedKingdom: 'Royaume-Uni',
        view:'next',
        edit:'edit'
      } : {
        membersManagement: 'Members Management',
        totalMembers: 'Total Members',
        sinceLastMonth: 'since last month',
        searches: 'Searches',
        sinceLastWeek: 'since last week',
        adClicks: 'Ad Clicks',
        searchPlaceholder: 'Search here...',
        allStatuses: 'All statuses',
        addMember: 'Add Member',
        name: 'Name',
        country: 'Country',
        status: 'Status',
        date: 'Date',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        newMember: 'New Member',
        companyName: 'Company Name',
        companyAddress: 'Company Address',
        companyPhone: 'Company Phone',
        companyEmail: 'Company Email',
        activitySector: 'Activity Sector',
        website: 'Website',
        logo: 'Logo',
        chooseFile: 'Choose File',
        noFileChosen: 'No file chosen',
        save: 'Save',
        cancel: 'Cancel',
        enter: 'Enter',
        select: 'Select',
        technology: 'Technology',
        finance: 'Finance',
        health: 'Health',
        education: 'Education',
        unitedStates: 'United States',
        france: 'France',
        canada: 'Canada',
        unitedKingdom: 'United Kingdom'
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
        this.updateMembresLanguage();
      });
      
      this.currentLang = this.languageService.getCurrentLanguage();
      this.updateMembresLanguage();
    }

    ngOnDestroy(): void {
      if (this.langSubscription) {
        this.langSubscription.unsubscribe();
      }
    }

    private initializeForm(): void {
      this.memberForm = this.fb.group({
        nom: ['', [Validators.required]],
        secteur: ['', [Validators.required]],
        adresse: ['', [Validators.required]],
        telephone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        siteWeb: [''],
        pays: [''],
        logo: ['']
      });
    }

    private updateMembresLanguage(): void {
      this.membres = this.membres.map(membre => ({
        ...membre,
        secteur: this.translateSector(membre.secteur),
        pays: this.translateCountry(membre.pays),
        statut: this.translateStatus(membre.statut)
      }));
      this.filterMembers();
    }

    private translateSector(sector: string): string {
      const sectorMap = this.currentLang === 'fr' ? {
        'Technology': 'Technologie',
        'Finance': 'Finance',
        'Health': 'Santé',
        'Education': 'Éducation'
      } : {
        'Technologie': 'Technology',
        'Finance': 'Finance',
        'Santé': 'Health',
        'Éducation': 'Education'
      };
      return sectorMap[sector as keyof typeof sectorMap] || sector;
    }

    private translateCountry(country: string): string {
      const countryMap = this.currentLang === 'fr' ? {
        'United States': 'États-Unis',
        'France': 'France',
        'Canada': 'Canada',
        'United Kingdom': 'Royaume-Uni'
      } : {
        'États-Unis': 'United States',
        'France': 'France',
        'Canada': 'Canada',
        'Royaume-Uni': 'United Kingdom'
      };
      return countryMap[country as keyof typeof countryMap] || country;
    }

    private translateStatus(status: string): any {
      const statusMap = this.currentLang === 'fr' ? {
        'Active': 'Actif',
        'Inactive': 'Inactif',
        'Pending': 'En attente'
      } : {
        'Actif': 'Active',
        'Inactif': 'Inactive',
        'En attente': 'Pending'
      };
      return statusMap[status as keyof typeof statusMap] || status;
    }

    onSearch(event: any): void {
      this.searchTerm = event.target.value.toLowerCase();
      this.filterMembers();
    }

    onStatusFilter(event: any): void {
      this.selectedStatus = event.target.value;
      this.filterMembers();
    }

    private filterMembers(): void {
      this.filteredMembres = this.membres.filter(membre => {
        const matchesSearch = membre.nom.toLowerCase().includes(this.searchTerm) ||
                            membre.secteur.toLowerCase().includes(this.searchTerm) ||
                            membre.pays.toLowerCase().includes(this.searchTerm);
        
        const matchesStatus = this.selectedStatus === 'all' || membre.statut === this.selectedStatus;
        
        return matchesSearch && matchesStatus;
      });
    }

    openAddMemberModal(): void {
      this.showAddMemberModal = true;
      this.memberForm.reset();
    }

    closeAddMemberModal(): void {
      this.showAddMemberModal = false;
    }

    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        // Handle file upload logic here
        console.log('File selected:', file);
      }
    }

    onSubmit(): void {
      if (this.memberForm.valid) {
        const newMember: Membre = {
          id: this.membres.length + 1,
          nom: this.memberForm.get('nom')?.value,
          secteur: this.memberForm.get('secteur')?.value,
          pays: this.memberForm.get('pays')?.value || 'France',
          statut: 'En attente',
          date: new Date().toLocaleDateString('fr-FR'),
          adresse: this.memberForm.get('adresse')?.value,
          telephone: this.memberForm.get('telephone')?.value,
          email: this.memberForm.get('email')?.value,
          siteWeb: this.memberForm.get('siteWeb')?.value
        };

        this.membres.push(newMember);
        this.filterMembers();
        this.closeAddMemberModal();
      }
    }

    getStatusClass(status: string): string {
      switch (status) {
        case 'Actif':
        case 'Active':
          return 'text-green-600';
        case 'Inactif':
        case 'Inactive':
          return 'text-red-600';
        case 'En attente':
        case 'Pending':
          return 'text-yellow-600';
        default:
          return 'text-gray-600';
      }
    }

    viewMember(membre: Membre): void {
      console.log('View member:', membre);
    }

    editMember(membre: Membre): void {
      console.log('Edit member:', membre);
    }

    toggleMemberStatus(membre: Membre): void {
      if (membre.statut === 'Actif' || membre.statut === 'Active') {
        membre.statut = this.currentLang === 'fr' ? 'Inactif' : 'Inactive';
      } else {
        membre.statut = this.currentLang === 'fr' ? 'Actif' : 'Active';
      }
    }
  }