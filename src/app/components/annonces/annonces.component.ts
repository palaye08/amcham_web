import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';
import { CardStateComponent } from "../card-state/card-state.component";

type Categorie = 'Événement' | 'Opportunité' | 'Actualité' | 'Event' | 'Opportunity' | 'News';
type Statut = 'Public' | 'Brouillon' | 'Draft';

interface Annonce {
  id: number;
  titre: string;
  description: string;
  categorie: Categorie;
  statut: Statut;
  date: string;
  datePublication: string;
  contenu: string;
}

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderAdminComponent, CardStateComponent],
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css']
})
export class AnnoncesComponent implements OnInit, OnDestroy {
  showAddAnnouncementModal = false;
  announcementForm!: FormGroup;
  annonces: Annonce[] = [
    {
      id: 1,
      titre: 'Forum économique franco-américain',
      description: 'Appel à candidatures: Programme d\'échange',
      categorie: 'Événement',
      statut: 'Public',
      date: '01/05/2025',
      datePublication: '2025-05-01',
      contenu: 'Le Forum économique franco-américain annonce l\'ouverture des candidatures pour son programme d\'échange 2025. Une opportunité unique pour les entreprises des deux pays.'
    },
    {
      id: 2,
      titre: 'Nouvelles régulations commerciales',
      description: 'Mise à jour des politiques commerciales internationales',
      categorie: 'Actualité',
      statut: 'Public',
      date: '15/05/2025',
      datePublication: '2025-05-15',
      contenu: 'Les nouvelles régulations commerciales entreront en vigueur le 1er juin 2025. Toutes les entreprises sont invitées à se conformer aux nouvelles directives.'
    },
    {
      id: 3,
      titre: 'Opportunité de partenariat stratégique',
      description: 'Recherche de partenaires dans le secteur technologique',
      categorie: 'Opportunité',
      statut: 'Brouillon',
      date: '10/04/2025',
      datePublication: '2025-04-10',
      contenu: 'Nous recherchons des partenaires stratégiques dans le domaine des technologies émergentes pour développer de nouvelles solutions innovantes.'
    }
  ];

  filteredAnnonces: Annonce[] = [...this.annonces];
  selectedCategory = 'all';
  selectedStatus = 'all';
  searchTerm = '';
  currentRoute: string;
  private langSubscription!: Subscription;
  currentLang = 'fr';

  // Statistiques calculées
  get stats() {
    const totalAnnouncements = this.annonces.length;
    const publishedAnnouncements = this.annonces.filter(a => a.statut === 'Public' ).length;
    const draftAnnouncements = this.annonces.filter(a => a.statut === 'Brouillon' || a.statut === 'Draft').length;
    
    const lastMonthAnnouncements = this.annonces.filter(a => {
      const announcementDate = new Date(a.date.split('/').reverse().join('-'));
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return announcementDate > lastMonth;
    }).length;

    return {
      totalAnnouncements,
      publishedAnnouncements,
      draftAnnouncements,
      announcementGrowth: totalAnnouncements > 0 ? Math.round((lastMonthAnnouncements / totalAnnouncements) * 100) : 0,
      publishedGrowth: 15
    };
  }

  // Textes dynamiques
  get texts() {
    return this.currentLang === 'fr' ? {
      announcementsManagement: 'Gestion des annonces',
      totalMembers:123,
      totalAnnouncements: 'Annonces totales',
      sinceLastMonth: 'depuis le mois dernier',
      publishedAnnouncements: 'Annonces publiées',
      sinceLastWeek: 'depuis la semaine dernière',
      draftAnnouncements: 'Annonces brouillon',
      awaitingPublication: 'en attente de publication',
      searchPlaceholder: 'Rechercher ici...',
      allCategories: 'Toutes les catégories',
      allStatuses: 'Tous les statuts',
      addAnnouncement: 'Ajouter une annonce',
      announcement: 'Annonce',
      category: 'Catégorie',
      status: 'Statut',
      date: 'Date',
      actions: 'Actions',
      public: 'Public',
      draft: 'Brouillon',
      event: 'Événement',
      opportunity: 'Opportunité',
      news: 'Actualité',
      newAnnouncement: 'Nouvelle annonce',
      title: 'Titre',
      description: 'Description',
      publicationDate: 'Date de publication',
      content: 'Contenu',
      save: 'Enregistrer',
      cancel: 'Annuler',
      select: 'Sélectionner',
      view: 'Voir',
      edit: 'Modifier'
    } : {
      announcementsManagement: 'Announcements Management',
      totalAnnouncements: 'Total Announcements',
      sinceLastMonth: 'since last month',
      publishedAnnouncements: 'Published Announcements',
      sinceLastWeek: 'since last week',
      draftAnnouncements: 'Draft Announcements',
      awaitingPublication: 'awaiting publication',
      searchPlaceholder: 'Search here...',
      allCategories: 'All categories',
      allStatuses: 'All statuses',
      addAnnouncement: 'Add Announcement',
      announcement: 'Announcement',
      category: 'Category',
      status: 'Status',
      date: 'Date',
      actions: 'Actions',
      public: 'Public',
      draft: 'Draft',
      event: 'Event',
      opportunity: 'Opportunity',
      news: 'News',
      newAnnouncement: 'New Announcement',
      title: 'Title',
      description: 'Description',
      publicationDate: 'Publication Date',
      content: 'Content',
      save: 'Save',
      cancel: 'Cancel',
      select: 'Select',
      view: 'View',
      edit: 'Edit'
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
      this.updateAnnoncesLanguage();
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
    this.updateAnnoncesLanguage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.announcementForm = this.fb.group({
      titre: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categorie: ['', [Validators.required]],
      datePublication: ['', [Validators.required]],
      statut: ['Public', [Validators.required]],
      contenu: ['', [Validators.required]]
    });
  }

  private updateAnnoncesLanguage(): void {
    this.annonces = this.annonces.map(annonce => ({
      ...annonce,
      categorie: this.translateCategory(annonce.categorie),
      statut: this.translateStatus(annonce.statut)
    })) as Annonce[];
    this.filterAnnouncements();
  }

  private translateCategory(category: Categorie): Categorie {
    const categoryMap: Record<string, Categorie> = this.currentLang === 'fr' ? {
      'Event': 'Événement',
      'Opportunity': 'Opportunité',
      'News': 'Actualité'
    } : {
      'Événement': 'Event',
      'Opportunité': 'Opportunity',
      'Actualité': 'News'
    };
    return categoryMap[category] || category;
  }

  private translateStatus(status: Statut): Statut {
    const statusMap: Record<string, Statut> = this.currentLang === 'fr' ? {
      'Draft': 'Brouillon'
    } : {
      'Brouillon': 'Draft'
    };
    return statusMap[status] || status;
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterAnnouncements();
  }

  onCategoryFilter(event: any): void {
    this.selectedCategory = event.target.value;
    this.filterAnnouncements();
  }

  onStatusFilter(event: any): void {
    this.selectedStatus = event.target.value;
    this.filterAnnouncements();
  }

  private filterAnnouncements(): void {
    this.filteredAnnonces = this.annonces.filter(annonce => {
      const matchesSearch = annonce.titre.toLowerCase().includes(this.searchTerm) ||
                          annonce.description.toLowerCase().includes(this.searchTerm) ||
                          annonce.contenu.toLowerCase().includes(this.searchTerm);
      
      const matchesCategory = this.selectedCategory === 'all' || annonce.categorie === this.selectedCategory;
      const matchesStatus = this.selectedStatus === 'all' || annonce.statut === this.selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  openAddAnnouncementModal(): void {
    this.showAddAnnouncementModal = true;
    this.announcementForm.reset({
      statut: 'Public',
      datePublication: new Date().toISOString().split('T')[0]
    });
  }

  closeAddAnnouncementModal(): void {
    this.showAddAnnouncementModal = false;
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const formValue = this.announcementForm.value;
      const newAnnouncement: Annonce = {
        id: this.annonces.length + 1,
        titre: formValue.titre,
        description: formValue.description,
        categorie: formValue.categorie as Categorie,
        statut: formValue.statut as Statut,
        date: new Date().toLocaleDateString('fr-FR'),
        datePublication: formValue.datePublication,
        contenu: formValue.contenu
      };

      this.annonces.push(newAnnouncement);
      this.filterAnnouncements();
      this.closeAddAnnouncementModal();
    }
  }

  viewAnnouncement(annonce: Annonce): void {
    console.log('View announcement:', annonce);
  }

  editAnnouncement(annonce: Annonce): void {
    console.log('Edit announcement:', annonce);
  }

  toggleAnnouncementStatus(annonce: Annonce): void {
    if (annonce.statut === 'Public') {
      annonce.statut = this.currentLang === 'fr' ? 'Brouillon' : 'Draft';
    } else {
      annonce.statut = 'Public';
    }
  }
}