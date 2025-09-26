// header.component.ts
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showLanguagePopup = false;

  languages: Language[] = [
    { code: 'FR', name: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
    { code: 'EN', name: 'Anglais', flag: 'https://flagcdn.com/w20/gb.png' }
  ];

  currentLanguage: Language = this.languages[0];

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Initialiser la langue actuelle
    const currentLang = this.languageService.getCurrentLanguage();
    this.currentLanguage = this.languages.find(lang => 
      lang.code.toLowerCase() === currentLang.toLowerCase()
    ) || this.languages[0];
  }

  // Navigation methods
  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToAnnonces() {
    this.router.navigate(['/annonces']);
  }

  navigateToAnnuaires() {
    this.router.navigate(['/annuaires']);
  }

  navigateToEspaceMembre() {
    this.router.navigate(['/espace-membre']);
  }
  navigateToLogin() {
    console.log('naviguer')
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

      // Changer la langue dans le service
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
}

// le html 
