import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../../../services/language.service';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-header-membre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-membre.component.html',
  styleUrl: './header-membre.component.css'
})
export class HeaderMembreComponent implements OnInit {
  currentRoute: string = '/apropos'; // Défaut à "A propos"
  
  // Gestion des langues
  showLanguagePopup = false;
  languages: Language[] = [
    { code: 'FR', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'EN', name: 'Anglais', flag: 'https://flagcdn.com/w20/gb.png' }
  ];
  currentLanguage: Language = this.languages[0];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
    // Déterminer la route actuelle ou définir par défaut
    this.currentRoute = this.router.url || '/apropos';
    
    // Si on est sur la route racine, rediriger vers apropos
    if (this.currentRoute === '/' || this.currentRoute === '') {
      this.currentRoute = '/apropos';
    }
  }

  ngOnInit(): void {
    // Initialiser la langue actuelle
    this.initializeLanguage();

    // Écouter les changements de route pour mettre à jour l'état actif
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentRoute(event.urlAfterRedirects);
    });
  }

  private initializeLanguage(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    const foundLanguage = this.languages.find(lang => 
      lang.code.toLowerCase() === currentLang.toLowerCase()
    );
    
    if (foundLanguage) {
      this.currentLanguage = foundLanguage;
    } else {
      // Défaut français
      this.currentLanguage = this.languages[0];
      this.languageService.setLanguage('fr');
    }
  }

  private updateCurrentRoute(url: string): void {
    let newRoute = url;
    
    // Si on est sur la route racine, considérer que c'est apropos
    if (newRoute === '/' || newRoute === '') {
      newRoute = '/apropos';
    }
    
    this.currentRoute = newRoute;
    console.log('Route actuelle:', this.currentRoute);
  }

  // Méthodes de navigation améliorées
  navigateToPropos(): void {
    if (this.currentRoute !== '/apropos') {
      console.log('Navigation vers apropos');
      this.router.navigate(['/apropos']);
    }
  }

  navigateToStatistique(): void {
    if (this.currentRoute !== '/statistique') {
      console.log('Navigation vers statistique');
      this.router.navigate(['/statistique']);
    }
  }

  navigateToMedia(): void {
    if (this.currentRoute !== '/media') {
      console.log('Navigation vers media');
      this.router.navigate(['/media']);
    }
  }

  navigateToHoraire(): void {
    if (this.currentRoute !== '/horaire') {
      console.log('Navigation vers horaire');
      this.router.navigate(['/horaire']);
    }
  }

  // Méthodes de gestion des langues
  toggleLanguagePopup(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showLanguagePopup = !this.showLanguagePopup;
  }

  selectLanguage(languageCode: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const selectedLanguage = this.languages.find(lang => 
      lang.code.toLowerCase() === languageCode.toLowerCase()
    );

    if (selectedLanguage && this.currentLanguage.code !== selectedLanguage.code) {
      this.currentLanguage = selectedLanguage;
      this.showLanguagePopup = false;

      // Changer la langue dans le service
      this.languageService.setLanguage(languageCode.toLowerCase());
      console.log(`Langue changée vers: ${selectedLanguage.name}`);

      // Ici vous pouvez ajouter d'autres actions comme recharger les traductions
      // this.reloadTranslations();
    } else {
      this.showLanguagePopup = false;
    }
  }

  // Fermer la popup en cliquant à l'extérieur
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showLanguagePopup) {
      const target = event.target as HTMLElement;
      const isLanguageSelector = target.closest('.language-selector');
      const isLanguagePopup = target.closest('.language-popup');
      
      if (!isLanguageSelector && !isLanguagePopup) {
        this.showLanguagePopup = false;
      }
    }
  }

  // Fermer la popup avec la touche Échap
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.showLanguagePopup) {
      this.showLanguagePopup = false;
    }
  }

  // Méthode pour déterminer si un onglet est actif
  isActiveTab(route: string): boolean {
    const isActive = this.currentRoute === route;
    return isActive;
  }

  // Méthode utilitaire pour recharger les traductions (à adapter selon votre implémentation)
  private reloadTranslations(): void {
    // Implémentez cette méthode selon votre système de traduction
    // Exemple avec ngx-translate :
    // this.translate.use(this.currentLanguage.code.toLowerCase()).subscribe(() => {
    //   console.log('Traductions rechargées');
    // });
  }
}