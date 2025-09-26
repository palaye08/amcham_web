import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-membre',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './membre.component.html',
  styleUrls: ['./membre.component.css'],
})
export class MembreComponent implements OnInit, OnDestroy {
  private langSubscription!: Subscription;
  currentLang = 'fr';

  // Filtres
  searchTerm: string = '';
  selectedCountry: string = '';
  selectedSector: string = '';

  // Textes dynamiques
  get texts() {
    return this.currentLang === 'fr' ? {
      heroTitle: 'Trouvez des partenaires commerciaux',
      heroSubtitle: 'Utilisez notre outil de recherche avancée pour trouver des membres par nom, secteur d\'activité ou localisation',
      memberName: 'Nom du membre',
      memberPlaceholder: 'E.S. Amcham SN',
      country: 'Pays',
      sector: 'Secteur d\'activité',
      search: 'Rechercher',
      ourMembers: 'Nos membres',
      membersDisplayed: 'membres affichés',
      noMembersFound: 'Aucun membre trouvé',
      noMembersDesc: 'Essayez de modifier vos critères de recherche pour obtenir plus de résultats.',
      resetFilters: 'Réinitialiser les filtres',
      contact: 'Contacter',
      viewProfile: 'Voir la fiche',
      seeMore: 'Voir plus',
      location: 'Localisation',
      phone: 'Téléphone',
      website: 'Site web',
      allCountries: 'Tous les pays',
      allSectors: 'Tous les secteurs'
    } : {
      heroTitle: 'Find business partners',
      heroSubtitle: 'Use our advanced search tool to find members by name, business sector or location',
      memberName: 'Member name',
      memberPlaceholder: 'E.S. Amcham SN',
      country: 'Country',
      sector: 'Business sector',
      search: 'Search',
      ourMembers: 'Our members',
      membersDisplayed: 'members displayed',
      noMembersFound: 'No members found',
      noMembersDesc: 'Try adjusting your search criteria to get more results.',
      resetFilters: 'Reset filters',
      contact: 'Contact',
      viewProfile: 'View profile',
      seeMore: 'See more',
      location: 'Location',
      phone: 'Phone',
      website: 'Website',
      allCountries: 'All countries',
      allSectors: 'All sectors'
    };
  }

  // Options de filtrage avec traductions
  get countries() {
    return this.currentLang === 'fr' ? [
      'Tous les pays',
      'États-Unis',
      'France', 
      'Canada',
      'Royaume-Uni',
      'Allemagne',
      'Japon'
    ] : [
      'All countries',
      'United States',
      'France', 
      'Canada',
      'United Kingdom',
      'Germany',
      'Japan'
    ];
  }

  get sectors() {
    return this.currentLang === 'fr' ? [
      'Tous les secteurs',
      'Technologie',
      'Finance',
      'Santé',
      'Éducation',
      'Industrie',
      'Commerce'
    ] : [
      'All sectors',
      'Technology',
      'Finance',
      'Health',
      'Education',
      'Industry',
      'Commerce'
    ];
  }

  // Liste complète des membres avec traductions
  allMembres = [
    {
      id: 1,
      name: 'Global Tech Solutions',
      categoryFr: 'Technologie',
      categoryEn: 'Technology',
      locationFr: 'Boston, États-Unis',
      locationEn: 'Boston, USA',
      phone: '+1 555-123-4567',
      website: 'www.example.us',
      descriptionFr: 'Leader dans le domaine des solutions technologiques innovantes. Nous aidons les entreprises à transformer leurs opérations grâce à des technologies de pointe et des services consultatifs spécialisés.',
      descriptionEn: 'Leader in innovative technology solutions. We help businesses transform their operations through cutting-edge technologies and specialized advisory services.',
      logo: '/assets/logo1.jpg'
    },
    {
      id: 2,
      name: 'Finance Partners International',
      categoryFr: 'Finance',
      categoryEn: 'Finance',
      locationFr: 'Paris, France',
      locationEn: 'Paris, France',
      phone: '+33 1 23 45 67 89',
      website: 'www.example.fr',
      descriptionFr: 'Spécialistes des services financiers internationaux avec plus de 20 ans d\'expérience dans le secteur bancaire et les investissements transfrontaliers.',
      descriptionEn: 'Specialists in international financial services with over 20 years of experience in banking and cross-border investments.',
      logo: '/assets/logo2.jpg'
    },
    {
      id: 3,
      name: 'Health Innovations Corp',
      categoryFr: 'Santé',
      categoryEn: 'Health',
      locationFr: 'Toronto, Canada',
      locationEn: 'Toronto, Canada',
      phone: '+1 416-555-7890',
      website: 'www.example.ca',
      descriptionFr: 'Pionniers dans les innovations en santé avec des solutions révolutionnaires pour améliorer les soins aux patients et l\'efficacité des systèmes de santé.',
      descriptionEn: 'Pioneers in health innovations with revolutionary solutions to improve patient care and healthcare system efficiency.',
      logo: '/assets/logo3.jpg'
    },
    {
      id: 4,
      name: 'EduGlobal Network',
      categoryFr: 'Éducation',
      categoryEn: 'Education',
      locationFr: 'Londres, Royaume-Uni',
      locationEn: 'London, United Kingdom',
      phone: '+44 20 1234 5678',
      website: 'www.example.co.uk',
      descriptionFr: 'Réseau éducatif international offrant des programmes d\'échange et des formations professionnelles de haute qualité pour les entreprises.',
      descriptionEn: 'International educational network offering exchange programs and high-quality professional training for businesses.',
      logo: '/assets/logo4.jpg'
    },
    {
      id: 5,
      name: 'Industrial Dynamics',
      categoryFr: 'Industrie',
      categoryEn: 'Industry',
      locationFr: 'Berlin, Allemagne',
      locationEn: 'Berlin, Germany',
      phone: '+49 30 12345678',
      website: 'www.example.de',
      descriptionFr: 'Solutions industrielles avancées pour l\'automatisation et l\'optimisation des processus de fabrication dans l\'industrie 4.0.',
      descriptionEn: 'Advanced industrial solutions for automation and optimization of manufacturing processes in Industry 4.0.',
      logo: '/assets/logo5.jpg'
    },
    {
      id: 6,
      name: 'Commerce Global',
      categoryFr: 'Commerce',
      categoryEn: 'Commerce',
      locationFr: 'Tokyo, Japon',
      locationEn: 'Tokyo, Japan',
      phone: '+81 3-1234-5678',
      website: 'www.example.jp',
      descriptionFr: 'Plateforme de commerce international facilitant les échanges commerciaux entre l\'Asie et les marchés occidentaux.',
      descriptionEn: 'International trade platform facilitating commercial exchanges between Asia and Western markets.',
      logo: '/assets/logo6.jpg'
    },
    {
      id: 7,
      name: 'Finrex Capital',
      categoryFr: 'Finance',
      categoryEn: 'Finance',
      locationFr: 'Paris, France',
      locationEn: 'Paris, France',
      phone: '+33 1 34 56 78 90',
      website: 'www.example.fr',
      descriptionFr: 'Cabinet de conseil en investissements et gestion de patrimoine pour les entreprises internationales.',
      descriptionEn: 'Investment advisory and wealth management firm for international companies.',
      logo: '/assets/logo7.jpg'
    },
    {
      id: 8,
      name: 'Acme Technologies',
      categoryFr: 'Technologie',
      categoryEn: 'Technology',
      locationFr: 'États-Unis',
      locationEn: 'United States',
      phone: '+1 146-555-7890',
      website: 'www.example.us',
      descriptionFr: 'Solutions technologiques personnalisées pour les entreprises de toutes tailles.',
      descriptionEn: 'Custom technology solutions for businesses of all sizes.',
      logo: '/assets/logo8.jpg'
    }
  ];

  // Membres filtrés à afficher
  filteredMembres = [...this.allMembres];

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.applyFilters();
    
    // S'abonner aux changements de langue
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.applyFilters(); // Re-filtrer pour mettre à jour les textes
    });
    
    // Initialiser la langue
    this.currentLang = this.languageService.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  // Méthode pour appliquer les filtres
  applyFilters() {
    this.filteredMembres = this.allMembres.filter(membre => {
      const matchesSearch = !this.searchTerm || 
        membre.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        membre[`description${this.currentLang === 'fr' ? 'Fr' : 'En'}`].toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCountry = !this.selectedCountry || 
        this.selectedCountry === this.texts.allCountries ||
        membre[`location${this.currentLang === 'fr' ? 'Fr' : 'En'}`].includes(this.selectedCountry);
      
      const matchesSector = !this.selectedSector || 
        this.selectedSector === this.texts.allSectors ||
        membre[`category${this.currentLang === 'fr' ? 'Fr' : 'En'}`] === this.selectedSector;

      return matchesSearch && matchesCountry && matchesSector;
    });
  }

  // Méthode pour rechercher
  onSearch() {
    this.applyFilters();
  }

  rechercher() {
    this.applyFilters();
  }

  // Méthodes de filtrage
  onCountryChange(country: string) {
    this.selectedCountry = country;
    this.applyFilters();
  }

  onSectorChange(sector: string) {
    this.selectedSector = sector;
    this.applyFilters();
  }

  // Navigation vers les détails d'un membre
  navigateToMembreDetails(membreId: number) {
    this.router.navigate(['/membre', membreId]);
  }

  // Méthode pour contacter un membre
  contactMembre(membre: any) {
    // Logique de contact - peut ouvrir une modal ou rediriger vers un formulaire
    console.log('Contacter:', membre.name);
  }

  // Charger plus de membres (si pagination)
  loadMore() {
    // Logique pour charger plus de membres
    console.log('Charger plus de membres');
  }

  // Méthode utilitaire pour obtenir la propriété traduite d'un membre
  getTranslatedProperty(membre: any, property: string): string {
    const langSuffix = this.currentLang === 'fr' ? 'Fr' : 'En';
    return membre[`${property}${langSuffix}`] || membre[property] || '';
  }
}