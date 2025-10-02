import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { LanguageService } from '../../../services/language.service';
import { HomeService, AnnonceResponse, Company, AdResponse } from '../../../services/home.service';
import { SecteurService, Country, SecteurResponse } from '../../../services/secteur.service';
import { PartenaireService, Partenaire } from '../../../services/partenaire.service';
import { Subscription } from 'rxjs';

interface MembreDisplay {
  id: number;
  nom: string;
  secteur: string;
  pictures: string[];
  pays: string;
  statut: 'Actif' | 'Inactif' | 'En attente' | 'Active' | 'Inactive' | 'Pending';
  date: string;
  logo: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  countryAmcham?: string;
  description?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  // Données des publicités dynamiques
  ads: AdResponse[] = [];
  isAdsLoading = false;
  
  currentSlideIndex = 0;
  private slideInterval: any;
  private langSubscription!: Subscription;
  currentLang = 'fr';
  isLoading = false;
  error: string | null = null;

  // Variables de recherche
  searchKeyword: string = '';
  selectedCountryId: number | undefined;
  selectedSectorId: number | undefined;
  isSearching = false;
  
  // Listes pour les dropdowns
  countries: Country[] = [];
  sectors: SecteurResponse[] = [];

  // Données dynamiques de l'API
  totalContacts = 0;
  totalCompanies = 0;
  totalCountries = 0;
  totalSectors = 0;
  annonces: AnnonceResponse[] = [];
  membres: MembreDisplay[] = [];

  // ID du pays AMCHAM
  countryAmchamId = 1;

  partenaires: Partenaire[] = [];

  // Slides statiques de fallback (en français)
  private heroSlidesFr = [
    {
      title: 'Votre réseau mondial',
      subtitle: "d'opportunités professionnelles",
      description: 'Connectez-vous avec le réseau mondial de membres AmCham et développez votre activité à l\'international',
      subtext: 'Recherchez par nom, secteur, pays ou continent, valorisez votre activité avec une fiche professionnelle complète',
      image: 'assets/image1.png',
      link: ''
    },
    {
      title: 'Opportunités d\'investissement',
      subtitle: 'aux États-Unis',
      description: 'Découvrez des secteurs en croissance et les régions prioritaires pour vos investissements internationaux',
      subtext: 'Bénéficiez de notre expertise et de nos partenariats stratégiques',
      image: 'assets/image2.png',
      link: ''
    },
    {
      title: 'Conférence annuelle AmCham',
      subtitle: '2025',
      description: 'Participez vous aussi à cette grand événement qui fait parler dans toute la France',
      subtext: 'Networking de haut niveau avec les dirigeants internationaux',
      image: 'assets/image3.png',
      link: ''
    },
    {
      title: 'Programme de partenariat',
      subtitle: 'international',
      description: 'Développez votre réseau à l\'international grâce à notre programme exclusif de partenariats',
      subtext: 'Accès privilégié aux marchés américains et européens',
      image: 'assets/image4.png',
      link: ''
    }
  ];

  getMemberImageUrl(pictures: string | undefined): string {
    if (pictures && pictures.length > 0) {
      return this.homeService.getMemberImageUrl(pictures);
    }
    return 'assets/default-member.png'; // Image par défaut si aucune image n'est disponible
  }

  // Slides statiques de fallback (en anglais)
  private heroSlidesEn = [
    {
      title: 'Your global network',
      subtitle: 'of professional opportunities',
      description: 'Connect with the global AmCham member network and expand your business internationally',
      subtext: 'Search by name, sector, country or continent, showcase your business with a complete professional profile',
      image: 'assets/image1.png',
      link: ''
    },
    {
      title: 'Investment opportunities',
      subtitle: 'in the United States',
      description: 'Discover growing sectors and priority regions for your international investments',
      subtext: 'Benefit from our expertise and strategic partnerships',
      image: 'assets/image2.png',
      link: ''
    },
    {
      title: 'Annual AmCham Conference',
      subtitle: '2025',
      description: 'Join this major event that is making waves throughout France',
      subtext: 'High-level networking with international leaders',
      image: 'assets/image3.png',
      link: ''
    },
    {
      title: 'Partnership program',
      subtitle: 'international',
      description: 'Develop your international network through our exclusive partnership program',
      subtext: 'Privileged access to American and European markets',
      image: 'assets/image4.png',
      link: ''
    }
  ];

  // Getter pour les slides héro (dynamique ou fallback)
  get heroSlides() {
    if (this.ads.length === 0) {
      // Fallback sur les slides statiques si aucune pub n'est chargée
      return this.currentLang === 'fr' ? this.heroSlidesFr : this.heroSlidesEn;
    }
    
    // Convertir les ads en format slide
    return this.ads.map(ad => ({
      title: this.extractTitle(ad.title),
      subtitle: this.extractSubtitle(ad.title),
      description: ad.description,
      subtext: this.formatAdDates(ad.startDate, ad.endDate),
      image: this.getAdImageUrl(ad.webImg),
      link: ad.link,
      id: ad.id
    }));
  }

  get stats() {
    return this.currentLang === 'fr' ? [
      { number: this.formatNumber(this.totalContacts), label: 'Contacts établis', icon: 'users' },
      { number: this.formatNumber(this.totalCompanies), label: 'Entreprises', icon: 'building' },
      { number: `${this.totalCountries}+`, label: 'Pays représentés', icon: 'globe' },
      { number: `${this.totalSectors}+`, label: 'Secteurs d\'activités', icon: 'clock' }
    ] : [
      { number: this.formatNumber(this.totalContacts), label: 'Contacts established', icon: 'users' },
      { number: this.formatNumber(this.totalCompanies), label: 'Companies', icon: 'building' },
      { number: `${this.totalCountries}+`, label: 'Countries represented', icon: 'globe' },
      { number: `${this.totalSectors}+`, label: 'Activity sectors', icon: 'clock' }
    ];
  }

  get searchTexts() {
    return this.currentLang === 'fr' ? {
      memberName: 'Nom du membre',
      memberPlaceholder: 'E.S. Amcham SN',
      country: 'Pays',
      allCountries: 'Tous les pays',
      sector: 'Secteur d\'activité',
      allSectors: 'Tous les secteurs',
      search: 'Rechercher',
      newsTitle: 'Actualités et événements',
      seeAllNews: 'Voir toutes les actualités',
      membersTitle: 'Nos membres',
      membersDesc: 'Découvrez quelques-uns de nos membres et explorez les opportunités de collaboration',
      membersDisplayed: 'membres affichés',
      contact: 'Contacter',
      viewProfile: 'Voir la fiche',
      seeAllMembers: 'Voir plus',
      appTitle: 'Téléchargez l\'app AmCham',
      appDesc: 'Recherchez des membres, gérez votre profil, suivez les annonces et les événements — partout, à tout moment.',
      feature1: 'Recherche avancée (nom, pays, secteur)',
      feature2: 'Espace membre sur mobile',
      feature3: 'Notifications d\'annonces & actus',
      feature4: 'Carte interactive',
      download: 'Télécharger sur',
      appStore: 'App Store',
      googlePlay: 'Google Play',
      partnersTitle: 'Nos partenaires',
      loading: 'Chargement...',
      noAnnouncements: 'Aucune annonce disponible',
      noMembers: 'Aucun membre disponible'
    } : {
      memberName: 'Member name',
      memberPlaceholder: 'E.S. Amcham SN',
      country: 'Country',
      allCountries: 'All countries',
      sector: 'Business sector',
      allSectors: 'All sectors',
      search: 'Search',
      newsTitle: 'News and events',
      seeAllNews: 'See all news',
      membersTitle: 'Our members',
      membersDesc: 'Discover some of our members and explore collaboration opportunities',
      membersDisplayed: 'members displayed',
      contact: 'Contact',
      viewProfile: 'View profile',
      seeAllMembers: 'See more',
      appTitle: 'Download the AmCham app',
      appDesc: 'Search for members, manage your profile, follow announcements and events — anywhere, anytime.',
      feature1: 'Advanced search (name, country, sector)',
      feature2: 'Member space on mobile',
      feature3: 'Announcements & news notifications',
      feature4: 'Interactive map',
      download: 'Download on',
      appStore: 'App Store',
      googlePlay: 'Google Play',
      partnersTitle: 'Our partners',
      loading: 'Loading...',
      noAnnouncements: 'No announcements available',
      noMembers: 'No members available'
    };
  }

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private homeService: HomeService,
    private secteurService: SecteurService,
    private partenaireService: PartenaireService 
  ) { }

  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateMembresLanguage();
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
    
    // Charger les ads en premier
    this.loadAds();
    
    // Puis charger les autres données
    this.loadHomeData();
    this.loadCountriesAndSectors();
    this.loadPartners();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  /**
   * Charger les publicités depuis l'API
   */
  loadAds(): void {
    this.isAdsLoading = true;
    
    this.homeService.getAds({ page: 0, size: 10 }).subscribe({
      next: (response) => {
        this.ads = response.content;
        this.isAdsLoading = false;
        
        // Démarrer le slideshow avec les nouvelles données
        if (this.ads.length > 0) {
          this.currentSlideIndex = 0;
          if (this.slideInterval) {
            clearInterval(this.slideInterval);
          }
          this.startSlideShow();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des publicités:', error);
        this.isAdsLoading = false;
        // Les slides statiques seront utilisés comme fallback
        this.startSlideShow();
      }
    });
  }

  /**
   * Obtenir l'URL complète de l'image de la publicité
   */
  getAdImageUrl(webImg: string): string {
    return this.homeService.getAdWebImageUrl(webImg);
  }

  /**
   * Extraire le titre principal (avant le tiret ou tout le texte)
   */
  private extractTitle(fullTitle: string): string {
    const parts = fullTitle.split('–');
    if (parts.length === 0) return fullTitle;
    return parts[0].trim();
  }

  /**
   * Extraire le sous-titre (après le tiret si existe)
   */
  private extractSubtitle(fullTitle: string): string {
    const parts = fullTitle.split('–');
    return parts.length > 1 ? parts[1].trim() : '';
  }

  /**
   * Formater les dates de début et fin pour l'affichage
   */
  private formatAdDates(startDate: string, endDate: string): string {
    if (this.currentLang === 'fr') {
      return `Du ${startDate} au ${endDate}`;
    } else {
      return `From ${startDate} to ${endDate}`;
    }
  }

  /**
   * Ouvrir le lien de la publicité
   */
  openAdLink(): void {
    const currentAd = this.ads[this.currentSlideIndex];
    if (currentAd && currentAd.link) {
      window.open(currentAd.link, '_blank');
    }
  }

  getLogoUrl(logoPath: string): string {
    return this.partenaireService.getLogoUrl(logoPath);
  }

  loadPartners(): void {
    this.partenaireService.getPartners().subscribe({
      next: (partenaires) => {
        this.partenaires = partenaires;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des partenaires:', error);
        this.partenaires = [
          { id: 1, name: 'US Embassy', logo: '/assets/embassy.jpg', link: '#' },
          { id: 2, name: 'Ministère de l\'Education', logo: '/assets/ministry.jpg', link: '#' },
          { id: 3, name: 'Coca-Cola', logo: '/assets/cocacola.jpg', link: '#' }
        ];
      }
    });
  }

  loadCountriesAndSectors(): void {
    this.secteurService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pays:', error);
      }
    });

    this.secteurService.getAllSecteurs().subscribe({
      next: (sectors) => {
        this.sectors = sectors;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des secteurs:', error);
      }
    });
  }

  rechercher(): void {
    this.isSearching = true;
    this.error = null;

    const searchParams: any = {
      page: 0,
      size: 6
    };

    if (this.searchKeyword && this.searchKeyword.trim()) {
      searchParams.name = this.searchKeyword.trim();
    }

    if (this.selectedSectorId) {
      const selectedSector = this.sectors.find(s => s.id === this.selectedSectorId);
      if (selectedSector) {
        searchParams.sector = this.currentLang === 'fr' ? selectedSector.nameFr : selectedSector.nameEn;
      }
    }

    this.homeService.getMembres(searchParams).subscribe({
      next: (response) => {
        this.membres = response.content.map(company => this.mapCompanyToMembreDisplay(company));
        console.log('Membres après recherche:', this.membres);
        this.totalCompanies = response.totalElements;
        this.isSearching = false;

        if (this.membres.length > 0) {
          setTimeout(() => {
            const membresSection = document.querySelector('.membres-section');
            if (membresSection) {
              membresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.error = this.currentLang === 'fr' 
          ? 'Une erreur est survenue lors de la recherche. Veuillez réessayer.' 
          : 'An error occurred during the search. Please try again.';
        this.isSearching = false;
      }
    });
  }

  resetSearch(): void {
    this.searchKeyword = '';
    this.selectedCountryId = undefined;
    this.selectedSectorId = undefined;
    this.loadMembres();
  }

  loadHomeData(): void {
    this.isLoading = true;
    this.error = null;

    this.loadStats();
    this.loadAnnonces();
    this.loadMembres();
  }

  loadStats(): void {
    this.homeService.getContacts().subscribe({
      next: (data) => {
        this.totalContacts = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contacts:', error);
      }
    });

    this.homeService.getCompanies().subscribe({
      next: (data) => {
        this.totalCompanies = data.totalCompanies;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des entreprises:', error);
      }
    });

    this.homeService.getSectors().subscribe({
      next: (data) => {
        this.totalSectors = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des secteurs:', error);
      }
    });
  }

  loadAnnonces(): void {
    this.homeService.getAnnonces({ page: 0, size: 3 }).subscribe({
      next: (response) => {
        this.annonces = response.content;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des annonces:', error);
      }
    });
  }

  loadMembres(): void {
    this.homeService.getMembres(this.countryAmchamId, { 
      page: 0, 
      size: 6 
    }).subscribe({
      next: (response) => {
        this.membres = response.content.map(company => this.mapCompanyToMembreDisplay(company));
        console.log('Membres après recherche:', this.membres);
        const uniqueCountries = [...new Set(response.content.map(membre => membre.country))];
        this.totalCountries = uniqueCountries.length;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des membres:', error);
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  private mapCompanyToMembreDisplay(company: Company): MembreDisplay {
    return {
      id: company.id,
      nom: company.name,
      secteur: company.sector,
      pays: company.country,
      statut: 'Actif',
      date: this.formatDateForDisplay(new Date()),
      pictures: company.pictures || [],
      logo: company.logo,
      adresse: company.address,
      telephone: company.telephone,
      email: company.email,
      siteWeb: company.webLink,
      countryAmcham: company.countryAmcham,
      description: company.description
    };
  }

  private updateMembresLanguage(): void {
    this.membres = this.membres.map(membre => ({
      ...membre,
      secteur: this.translateSector(membre.secteur),
      pays: this.translateCountry(membre.pays),
      statut: this.translateStatus(membre.statut)
    }));
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

  private formatDateForDisplay(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return num.toLocaleString(this.currentLang === 'fr' ? 'fr-FR' : 'en-US') + '+';
    }
    return num.toString();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(this.currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCategoryName(annonce: AnnonceResponse): string {
    return this.currentLang === 'fr' ? annonce.category.nameFr : annonce.category.nameEn;
  }

  getSectorName(sector: SecteurResponse): string {
    return this.currentLang === 'fr' ? sector.nameFr : sector.nameEn;
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 secondes pour mieux voir les publicités
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  get currentSlide() {
    return this.heroSlides[this.currentSlideIndex];
  }

  navigateToMembres() {
    this.router.navigate(['/membres']);
  }

  navigateToMembreDetails(membreId: number) {
    this.router.navigate(['/membre', membreId]);
  }

  voirToutesActualites() {
    this.router.navigate(['/actualites']);
  }
}