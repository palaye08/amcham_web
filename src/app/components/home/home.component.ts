// home.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
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
  currentSlideIndex = 0;
  private slideInterval: any;
  private langSubscription!: Subscription;
  currentLang = 'fr';

  // Textes en français
  heroSlidesFr = [
    {
      title: 'Votre réseau mondial',
      subtitle: "d'opportunités professionnelles",
      description: 'Connectez-vous avec le réseau mondial de membres AmCham et développez votre activité à l\'international',
      subtext: 'Recherchez par nom, secteur, pays ou continent, valorisez votre activité avec une fiche professionnelle complète',
      image: 'assets/image1.png'
    },
    {
      title: 'Opportunités d\'investissement',
      subtitle: 'aux États-Unis',
      description: 'Découvrez des secteurs en croissance et les régions prioritaires pour vos investissements internationaux',
      subtext: 'Bénéficiez de notre expertise et de nos partenariats stratégiques',
      image: 'assets/image2.png'
    },
    {
      title: 'Conférence annuelle AmCham',
      subtitle: '2025',
      description: 'Participez vous aussi à cette grand événement qui fait parler dans toute la France',
      subtext: 'Networking de haut niveau avec les dirigeants internationaux',
      image: 'assets/image3.png'
    },
    {
      title: 'Programme de partenariat',
      subtitle: 'international',
      description: 'Développez votre réseau à l\'international grâce à notre programme exclusif de partenariats',
      subtext: 'Accès privilégié aux marchés américains et européens',
      image: 'assets/image4.png'
    }
  ];

  // Textes en anglais
  heroSlidesEn = [
    {
      title: 'Your global network',
      subtitle: 'of professional opportunities',
      description: 'Connect with the global AmCham member network and expand your business internationally',
      subtext: 'Search by name, sector, country or continent, showcase your business with a complete professional profile',
      image: 'assets/image1.png'
    },
    {
      title: 'Investment opportunities',
      subtitle: 'in the United States',
      description: 'Discover growing sectors and priority regions for your international investments',
      subtext: 'Benefit from our expertise and strategic partnerships',
      image: 'assets/image2.png'
    },
    {
      title: 'Annual AmCham Conference',
      subtitle: '2025',
      description: 'Join this major event that is making waves throughout France',
      subtext: 'High-level networking with international leaders',
      image: 'assets/image3.png'
    },
    {
      title: 'Partnership program',
      subtitle: 'international',
      description: 'Develop your international network through our exclusive partnership program',
      subtext: 'Privileged access to American and European markets',
      image: 'assets/image4.png'
    }
  ];

  statsFr = [
    { number: '5 000+', label: 'Réseaux de vente', icon: 'users' },
    { number: '1 200+', label: 'Entreprises', icon: 'building' },
    { number: '75+', label: 'Pays représentés', icon: 'globe' },
    { number: '12+', label: 'Années', icon: 'clock' }
  ];

  statsEn = [
    { number: '5,000+', label: 'Sales networks', icon: 'users' },
    { number: '1,200+', label: 'Companies', icon: 'building' },
    { number: '75+', label: 'Countries represented', icon: 'globe' },
    { number: '12+', label: 'Years', icon: 'clock' }
  ];

  actualitesFr = [
    {
      id: 1,
      title: 'Forum économique franco-américain',
      description: 'Participez à notre forum annuel sur les opportunités d\'affaires entre la France et les États-Unis.',
      date: '15 Août 2024',
      image: '/assets/forum.jpg',
      category: 'Événement'
    },
    {
      id: 2,
      title: 'Appel à candidatures',
      description: 'Postulez pour notre programme d\'échange professionnel de 6 mois aux États-Unis.',
      date: '25 Septembre 2024',
      image: '/assets/candidature.jpg',
      category: 'Programme'
    },
    {
      id: 3,
      title: 'Nouvelles régulations commerciales',
      description: 'Informations importantes sur les nouvelles régulations commerciales entre l\'UE et les États-Unis.',
      date: '28 Septembre 2024',
      image: '/assets/regulations.jpg',
      category: 'Information'
    }
  ];

  actualitesEn = [
    {
      id: 1,
      title: 'French-American Economic Forum',
      description: 'Participate in our annual forum on business opportunities between France and the United States.',
      date: 'August 15, 2024',
      image: '/assets/forum.jpg',
      category: 'Event'
    },
    {
      id: 2,
      title: 'Call for applications',
      description: 'Apply for our 6-month professional exchange program in the United States.',
      date: 'September 25, 2024',
      image: '/assets/candidature.jpg',
      category: 'Program'
    },
    {
      id: 3,
      title: 'New trade regulations',
      description: 'Important information about new trade regulations between the EU and the United States.',
      date: 'September 28, 2024',
      image: '/assets/regulations.jpg',
      category: 'Information'
    }
  ];

  // Getters pour les données selon la langue actuelle
  get heroSlides() {
    return this.currentLang === 'fr' ? this.heroSlidesFr : this.heroSlidesEn;
  }

  get stats() {
    return this.currentLang === 'fr' ? this.statsFr : this.statsEn;
  }

  get actualites() {
    return this.currentLang === 'fr' ? this.actualitesFr : this.actualitesEn;
  }

  // Textes dynamiques
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
      seeAllNews: 'Voir toutes les actualites',
      membersTitle: 'Nos membres',
      membersDesc: 'Découvrez quelques-uns de nos membres et explorez les opportunités de collaboration',
      membersDisplayed: '6 membres affichés',
      contact: 'Contacter',
      viewProfile: 'Voir la fiche',
      seeAllMembers: 'Voir tous les membres',
      appTitle: 'Téléchargez l\'app AmCham',
      appDesc: 'Recherchez des membres, gérez votre profil, suivez les annonces et les événements — partout, à tout moment.',
      feature1: 'Recherche avancée (nom, pays, secteur)',
      feature2: 'Espace membre sur mobile',
      feature3: 'Notifications d\'annonces & actus',
      feature4: 'Carte interactive',
      download: 'Télécharger sur',
      appStore: 'App Store',
      googlePlay: 'Google Play',
      partnersTitle: 'Nos partenaires'
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
      membersDisplayed: '6 members displayed',
      contact: 'Contact',
      viewProfile: 'View profile',
      seeAllMembers: 'See all members',
      appTitle: 'Download the AmCham app',
      appDesc: 'Search for members, manage your profile, follow announcements and events — anywhere, anytime.',
      feature1: 'Advanced search (name, country, sector)',
      feature2: 'Member space on mobile',
      feature3: 'Announcements & news notifications',
      feature4: 'Interactive map',
      download: 'Download on',
      appStore: 'App Store',
      googlePlay: 'Google Play',
      partnersTitle: 'Our partners'
    };
  }

  membres = [
    {
      id: 1,
      name: 'Global Tech Solutions',
      categoryFr: 'Technologie',
      categoryEn: 'Technology',
      locationFr: 'Boston, États-Unis',
      locationEn: 'Boston, USA',
      logo: '/assets/logo1.jpg',
      descriptionFr: 'Solutions technologiques innovantes',
      descriptionEn: 'Innovative technology solutions'
    },
    // ... autres membres avec traductions
  ];

  partenaires = [
    { name: 'US Embassy', logo: '/assets/embassy.jpg' },
    { name: 'Ministère de l\'Education', logo: '/assets/ministry.jpg' },
    { name: 'Coca-Cola', logo: '/assets/cocacola.jpg' }
  ];

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.startSlideShow();
    
    // S'abonner aux changements de langue
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    
    // Initialiser la langue
    this.currentLang = this.languageService.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 2000);
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

  rechercher() {
    console.log('Recherche en cours...');
  }
}