import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { filter } from 'rxjs/operators';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showLanguagePopup = false;
  activeSection = 'accueil'; // Section active par défaut

  languages: Language[] = [
    { code: 'FR', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'EN', name: 'Anglais', flag: 'https://flagcdn.com/w20/gb.png' }
  ];

  currentLanguage: Language = this.languages[0];

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {
    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveSection();
    });
  }

  ngOnInit(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    this.currentLanguage = this.languages.find(lang => 
      lang.code.toLowerCase() === currentLang.toLowerCase()
    ) || this.languages[0];

    // Initialiser la section active
    this.updateActiveSection();

    // Écouter le scroll pour détecter la section visible
    this.setupScrollListener();
  }

  // Mettre à jour la section active basée sur l'URL ou le scroll
  updateActiveSection(): void {
    const url = this.router.url;
    
    if (url.includes('#annonces')) {
      this.activeSection = 'annonces';
    } else if (url.includes('#annuaires')) {
      this.activeSection = 'annuaires';
    } else {
      this.activeSection = 'accueil';
    }
  }

  // Configurer l'écouteur de scroll pour détecter la section visible
  setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      const sections = ['accueil', 'annonces', 'annuaires'];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Si la section est visible dans le viewport (avec un offset)
          if (rect.top <= 150 && rect.bottom >= 150) {
            this.activeSection = sectionId;
            break;
          }
        }
      }
    });
  }

  // Vérifier si une section est active
  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  // Navigation methods
  navigateToHome() {
    this.activeSection = 'accueil';
    this.router.navigate(['/']);
  }

  navigateToAccueil() {
    this.activeSection = 'accueil';
    this.navigateToSection('accueil');
  }

  navigateToAnnonces() {
    this.activeSection = 'annonces';
    this.navigateToSection('annonces');
  }

  navigateToAnnuaires() {
    this.activeSection = 'annuaires';
    this.navigateToSection('annuaires');
  }

  navigateToEspaceMembre() {
    this.router.navigate(['/espace-membre']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Language methods
  toggleLanguagePopup() {
    this.showLanguagePopup = !this.showLanguagePopup;
  }

  selectLanguage(languageCode: string) {
    const selectedLanguage = this.languages.find(lang => 
      lang.code.toLowerCase() === languageCode.toLowerCase()
    );

    if (selectedLanguage) {
      this.currentLanguage = selectedLanguage;
      this.showLanguagePopup = false;
      this.languageService.setLanguage(languageCode.toLowerCase());
      console.log(`Langue changée vers: ${selectedLanguage.name}`);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      this.showLanguagePopup = false;
    }
  }

  // Smooth scroll to section
  navigateToSection(sectionId: string) {
    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80; // Hauteur du header fixe
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
  }
}