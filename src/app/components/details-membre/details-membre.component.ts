import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-membre',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './details-membre.component.html',
  styleUrls: ['./details-membre.component.css']
})
export class DetailsMembreComponent implements OnInit, OnDestroy {
  private langSubscription!: Subscription;
  currentLang = 'fr';

  membreId: number = 0;
  membre: any = null;

  // Textes dynamiques
  get texts() {
    return this.currentLang === 'fr' ? {
      giveReview: 'Donner un avis',
      founded: 'Fondée en',
      employees: 'actifs',
      coordinates: 'Coordonnées',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      website: 'Site web',
      contact: 'Contacter',
      openingHours: 'Horaires d\'ouverture',
      closed: 'Fermé',
      presentation: 'Présentation',
      services: 'Services proposés',
      certifications: 'Certifications & Labels',
      photoGallery: 'Galerie photos',
      presentationVideo: 'Vidéo de présentation',
      clickToWatch: 'Cliquer pour voir la vidéo',
      location: 'Localisation',
      viewOnMap: 'Voir sur la carte',
      reviews: 'Avis & notes',
      similarMembers: 'Membres similaires',
      seeAllMembers: 'Voir tous les membres',
      memberNotFound: 'Membre non trouvé',
      memberNotFoundDesc: 'Le membre que vous cherchez n\'existe pas ou a été supprimé.',
      seeAllMembersBtn: 'Voir tous les membres',
      contactBtn: 'Contacter',
      viewProfile: 'Voir la fiche',
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
      discoverMembers: 'Découvrez quelques-uns de nos membres et explorez les opportunités de collaboration'
    } : {
      giveReview: 'Give review',
      founded: 'Founded in',
      employees: 'employees',
      coordinates: 'Contact Information',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      contact: 'Contact',
      openingHours: 'Opening Hours',
      closed: 'Closed',
      presentation: 'Presentation',
      services: 'Services Offered',
      certifications: 'Certifications & Labels',
      photoGallery: 'Photo Gallery',
      presentationVideo: 'Presentation Video',
      clickToWatch: 'Click to watch video',
      location: 'Location',
      viewOnMap: 'View on map',
      reviews: 'Reviews & Ratings',
      similarMembers: 'Similar Members',
      seeAllMembers: 'See all members',
      memberNotFound: 'Member not found',
      memberNotFoundDesc: 'The member you are looking for does not exist or has been deleted.',
      seeAllMembersBtn: 'See all members',
      contactBtn: 'Contact',
      viewProfile: 'View profile',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      discoverMembers: 'Discover some of our members and explore collaboration opportunities'
    };
  }

  // Données simulées des membres avec traductions
  membresData: { [key: number]: any } = {
    1: {
      id: 1,
      name: 'Global Tech Solutions',
      categoryFr: 'Technologie',
      categoryEn: 'Technology',
      locationFr: '123 Innovation Street, Boston, MA 02110',
      locationEn: '123 Innovation Street, Boston, MA 02110',
      phone: '+1 555-123-4567',
      email: 'contact@globaltechsolutions.com',
      website: 'www.example.us',
      foundedYear: '2003',
      employeesFr: '4.7 mille actifs',
      employeesEn: '4.7 thousand employees',
      descriptionFr: 'Global Tech Solutions est une entreprise leader dans le domaine des solutions technologiques innovantes. Nous aidons les entreprises à transformer leurs opérations grâce à des technologies de pointe et des services consultatifs de droite collaboration avec les clients pour développer des solutions sur mesure qui répondent à leurs besoins spécifiques.',
      descriptionEn: 'Global Tech Solutions is a leading company in innovative technology solutions. We help businesses transform their operations through cutting-edge technologies and advisory services, working closely with clients to develop customized solutions that meet their specific needs.',
      horaires: {
        'Lundi': '09:00 - 18:00',
        'Mardi': '09:00 - 18:00',
        'Mercredi': '09:00 - 18:00',
        'Jeudi': '09:00 - 18:00',
        'Vendredi': '09:00 - 17:00',
        'Samedi': 'Fermé',
        'Dimanche': 'Fermé'
      },
      horairesEn: {
        'Monday': '09:00 - 18:00',
        'Tuesday': '09:00 - 18:00',
        'Wednesday': '09:00 - 18:00',
        'Thursday': '09:00 - 18:00',
        'Friday': '09:00 - 17:00',
        'Saturday': 'Closed',
        'Sunday': 'Closed'
      },
      galerie: [
        '/assets/gallery1.jpg',
        '/assets/gallery2.jpg',
        '/assets/gallery3.jpg'
      ],
      videoUrl: '/assets/presentation-video.mp4',
      avis: [
        {
          id: 1,
          nom: 'Emma Li',
          note: 5,
          commentaireFr: 'Excellent service client et solutions très innovantes. L\'équipe est toujours disponible pour aider et les résultats sont impressionnants.',
          commentaireEn: 'Excellent customer service and very innovative solutions. The team is always available to help and the results are impressive.',
          avatar: '/assets/avatar1.jpg'
        },
        {
          id: 2,
          nom: 'Maximilien Mbaye',
          note: 5,
          commentaireFr: 'Très satisfait de la qualité des services. J\'ai pu avoir un retour de contact sous 24h et l\'équipe connaît bien ses sujets.',
          commentaireEn: 'Very satisfied with the quality of services. I got a response within 24 hours and the team knows their subjects well.',
          avatar: '/assets/avatar2.jpg'
        },
        {
          id: 3,
          nom: 'Aicha Diop',
          note: 5,
          commentaireFr: 'Partenaire de confiance depuis plus de 3 ans. Leur expertise dans le domaine technologique est impressionnante.',
          commentaireEn: 'Trusted partner for over 3 years. Their expertise in the technology field is impressive.',
          avatar: '/assets/avatar3.jpg'
        }
      ],
      servicesFr: [
        'Développement d\'applications web et mobiles',
        'Solutions cloud et infrastructure',
        'Intelligence artificielle et machine learning',
        'Consultation technologique',
        'Support et maintenance'
      ],
      servicesEn: [
        'Web and mobile application development',
        'Cloud solutions and infrastructure',
        'Artificial intelligence and machine learning',
        'Technology consulting',
        'Support and maintenance'
      ],
      certifications: [
        'ISO 9001:2015',
        'SOC 2 Type II',
        'AWS Partner',
        'Microsoft Gold Partner'
      ]
    },
    2: {
      id: 2,
      name: 'Finance Partners International',
      categoryFr: 'Finance',
      categoryEn: 'Finance',
      locationFr: 'Paris, France',
      locationEn: 'Paris, France',
      phone: '+33 1 23 45 67 89',
      email: 'contact@financepartners.fr',
      website: 'www.example.fr',
      foundedYear: '1998',
      employeesFr: '2.3 mille actifs',
      employeesEn: '2.3 thousand employees',
      descriptionFr: 'Finance Partners International est un cabinet spécialisé dans les services financiers internationaux avec plus de 20 ans d\'expérience dans le secteur bancaire et les investissements transfrontaliers.',
      descriptionEn: 'Finance Partners International is a firm specialized in international financial services with over 20 years of experience in banking and cross-border investments.',
      horaires: {
        'Lundi': '08:30 - 18:30',
        'Mardi': '08:30 - 18:30',
        'Mercredi': '08:30 - 18:30',
        'Jeudi': '08:30 - 18:30',
        'Vendredi': '08:30 - 17:30',
        'Samedi': 'Fermé',
        'Dimanche': 'Fermé'
      },
      horairesEn: {
        'Monday': '08:30 - 18:30',
        'Tuesday': '08:30 - 18:30',
        'Wednesday': '08:30 - 18:30',
        'Thursday': '08:30 - 18:30',
        'Friday': '08:30 - 17:30',
        'Saturday': 'Closed',
        'Sunday': 'Closed'
      },
      galerie: [
        '/assets/finance-gallery1.jpg',
        '/assets/finance-gallery2.jpg',
        '/assets/finance-gallery3.jpg'
      ],
      videoUrl: '/assets/finance-presentation.mp4',
      avis: [
        {
          id: 1,
          nom: 'Pierre Dubois',
          note: 5,
          commentaireFr: 'Service exceptionnel et expertise reconnue dans le domaine financier. Équipe très professionnelle.',
          commentaireEn: 'Exceptional service and recognized expertise in the financial field. Very professional team.',
          avatar: '/assets/avatar4.jpg'
        },
        {
          id: 2,
          nom: 'Marie Leclerc',
          note: 4,
          commentaireFr: 'Très bon accompagnement pour nos investissements internationaux.',
          commentaireEn: 'Very good support for our international investments.',
          avatar: '/assets/avatar5.jpg'
        }
      ],
      servicesFr: [
        'Conseil en investissements',
        'Gestion de patrimoine',
        'Services bancaires internationaux',
        'Financement de projets',
        'Analyse financière'
      ],
      servicesEn: [
        'Investment advisory',
        'Wealth management',
        'International banking services',
        'Project financing',
        'Financial analysis'
      ],
      certifications: [
        'AMF (Autorité des Marchés Financiers)',
        'CFA Institute Member',
        'ISO 27001'
      ]
    }
  };

  membresSimilaires = [
    {
      id: 7,
      name: 'Global Tech Solutions',
      categoryFr: 'TechAugai',
      categoryEn: 'TechAugai',
      locationFr: 'Boston, États-Unis',
      locationEn: 'Boston, USA',
      phone: '+1 555-123-4567',
      website: 'www.example.us'
    },
    {
      id: 8,
      name: 'Finrex Capital',
      categoryFr: 'TechAugai',
      categoryEn: 'TechAugai',
      locationFr: 'Paris, France',
      locationEn: 'Paris, France',
      phone: '+33 1 34 56 78 90',
      website: 'www.example.fr'
    },
    {
      id: 9,
      name: 'Acme Technologies',
      categoryFr: 'Technologie',
      categoryEn: 'Technology',
      locationFr: 'États-Unis',
      locationEn: 'United States',
      phone: '+1 146-555-7890',
      website: 'www.example.us'
    }
  ];

  constructor(
    public route: ActivatedRoute, 
    public router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.membreId = +params['id'];
      this.loadMembreDetails();
    });

    // S'abonner aux changements de langue
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    
    // Initialiser la langue
    this.currentLang = this.languageService.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  loadMembreDetails() {
    this.membre = this.membresData[this.membreId];
    if (!this.membre) {
      this.router.navigate(['/membres']);
    }
  }

  // Méthode utilitaire pour obtenir la propriété traduite
  getTranslatedProperty(membre: any, property: string): string {
    const langSuffix = this.currentLang === 'fr' ? 'Fr' : 'En';
    return membre[`${property}${langSuffix}`] || membre[property] || '';
  }

  // Méthode pour obtenir les horaires traduits
  getTranslatedHoraires(): any {
    return this.currentLang === 'fr' ? this.membre.horaires : this.membre.horairesEn;
  }

  // Méthode pour obtenir les jours de la semaine traduits
  getTranslatedDays(): string[] {
    return this.currentLang === 'fr' ? 
      ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] :
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  laisserAvis() {
    console.log('Laisser un avis pour:', this.membre.name);
  }

  contacter() {
    console.log('Contacter:', this.membre.name);
  }

  voirFiche(membreId: number) {
    this.router.navigate(['/membre', membreId]);
  }

  voirTousLesMembres() {
    this.router.navigate(['/membres']);
  }

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  openMap() {
    const encodedAddress = encodeURIComponent(this.getTranslatedProperty(this.membre, 'location'));
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  }

  callPhone() {
    window.location.href = `tel:${this.membre.phone}`;
  }

  sendEmail() {
    window.location.href = `mailto:${this.membre.email}`;
  }

  visitWebsite() {
    window.open(`https://${this.membre.website}`, '_blank');
  }
}