import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { LanguageService } from '../../../services/language.service';
import { CompanyService, Company, CompanySchedule } from '../../../services/company.service';
import { Subscription, forkJoin } from 'rxjs';

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
  membre: Company | null = null;
  horaires: CompanySchedule[] = [];
  isLoading = true;

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

  // Données simulées pour les sections non disponibles dans l'API
  membresSimilaires = [
    {
      id: 7,
      name: 'Global Tech Solutions',
      categoryFr: 'Technologie',
      categoryEn: 'Technology',
      locationFr: 'Boston, États-Unis',
      locationEn: 'Boston, USA',
      phone: '+1 555-123-4567',
      website: 'www.example.us'
    },
    {
      id: 8,
      name: 'Finrex Capital',
      categoryFr: 'Finance',
      categoryEn: 'Finance',
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

  avisSimules = [
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
  ];

  certificationsSimules = [
    'ISO 9001:2015',
    'SOC 2 Type II',
    'AWS Partner',
    'Microsoft Gold Partner'
  ];

  servicesSimulesFr = [
    'Développement d\'applications web et mobiles',
    'Solutions cloud et infrastructure',
    'Intelligence artificielle et machine learning',
    'Consultation technologique',
    'Support et maintenance'
  ];

  servicesSimulesEn = [
    'Web and mobile application development',
    'Cloud solutions and infrastructure',
    'Artificial intelligence and machine learning',
    'Technology consulting',
    'Support and maintenance'
  ];

  constructor(
    public route: ActivatedRoute, 
    public router: Router,
    private languageService: LanguageService,
    private companyService: CompanyService
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
    this.isLoading = true;
    
    // Charger les données du membre et ses horaires en parallèle
    forkJoin({
      company: this.companyService.getCompanyById(this.membreId),
      schedules: this.companyService.getHoraire(this.membreId)
    }).subscribe({
      next: ({ company, schedules }) => {
        this.membre = company;
        this.horaires = schedules;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données du membre:', error);
        this.isLoading = false;
        this.router.navigate(['/membres']);
      }
    });
  }

  // Méthode utilitaire pour obtenir la propriété traduite
  getTranslatedProperty(property: string): string {
    if (!this.membre) return '';
    
    // Pour les propriétés qui n'ont pas de traduction, retourner directement la valeur
    return this.membre[property as keyof Company] as string || '';
  }

  // Méthode pour obtenir les horaires formatés
  getFormattedHoraires(): any {
    const horairesObj: any = {};
    
    this.horaires.forEach(schedule => {
      const dayKey = this.getTranslatedDay(schedule.dayOfWeek);
      if (schedule.closed) {
        horairesObj[dayKey] = this.texts.closed;
      } else if (schedule.openingTime && schedule.closingTime) {
        horairesObj[dayKey] = `${schedule.openingTime} - ${schedule.closingTime}`;
      } else {
        horairesObj[dayKey] = this.texts.closed;
      }
    });
    
    return horairesObj;
  }

  // Méthode pour traduire les jours de la semaine
  getTranslatedDay(day: string): string {
    const daysMap: { [key: string]: { fr: string, en: string } } = {
      'MONDAY': { fr: 'Lundi', en: 'Monday' },
      'TUESDAY': { fr: 'Mardi', en: 'Tuesday' },
      'WEDNESDAY': { fr: 'Mercredi', en: 'Wednesday' },
      'THURSDAY': { fr: 'Jeudi', en: 'Thursday' },
      'FRIDAY': { fr: 'Vendredi', en: 'Friday' },
      'SATURDAY': { fr: 'Samedi', en: 'Saturday' },
      'SUNDAY': { fr: 'Dimanche', en: 'Sunday' }
    };
    
    return this.currentLang === 'fr' 
      ? daysMap[day]?.fr || day 
      : daysMap[day]?.en || day;
  }

  // Méthode pour obtenir les jours de la semaine traduits
  getTranslatedDays(): string[] {
    return this.currentLang === 'fr' ? 
      ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] :
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  // Méthode pour obtenir les services (simulés pour l'instant)
  getServices(): string[] {
    return this.currentLang === 'fr' ? this.servicesSimulesFr : this.servicesSimulesEn;
  }

  // Méthode pour obtenir l'adresse complète
  getCompleteAddress(): string {
    if (!this.membre) return '';
    
    const addressParts = [this.membre.address, this.membre.city, this.membre.country]
      .filter(part => part && part.trim() !== '');
    
    return addressParts.join(', ');
  }

  laisserAvis() {
    console.log('Laisser un avis pour:', this.membre?.name);
    // Implémenter la logique pour laisser un avis
  }

  contacter() {
    console.log('Contacter:', this.membre?.name);
    // Implémenter la logique de contact
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
    if (!this.membre) return;
    
    const encodedAddress = encodeURIComponent(this.getCompleteAddress());
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  }

  callPhone() {
    if (!this.membre) return;
    window.location.href = `tel:${this.membre.telephone}`;
  }

  sendEmail() {
    if (!this.membre) return;
    window.location.href = `mailto:${this.membre.email}`;
  }

  visitWebsite() {
    if (!this.membre) return;
    
    let website = this.membre.webLink;
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
      website = 'https://' + website;
    }
    window.open(website, '_blank');
  }

  // Méthode pour obtenir l'initiale du nom de l'entreprise
  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}