import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

export interface CardStats {
  totalMembers?: number;
  memberGrowth?: number;
  searches?: number;
  searchGrowth?: number;
  adClicks?: number;
  clickGrowth?: number;
  totalAnnouncements?: number;
  announcementGrowth?: number;
  publishedAnnouncements?: number;
  publishedGrowth?: number;
  draftAnnouncements?: number;
}

@Component({
  selector: 'app-card-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-state.component.html',
  styleUrls: ['./card-state.component.css']
})
export class CardStateComponent implements OnInit, OnDestroy {
  @Input() stats: CardStats = {
    totalMembers: 126,
    memberGrowth: 12,
    searches: 1243,
    searchGrowth: 5,
    adClicks: 348,
    clickGrowth: 18
  };

  @Input() type: 'members' | 'announcements'| 'banners' | 'amchams' | 'statics' = 'members';

  private langSubscription!: Subscription;
  currentLang = 'fr';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  // Textes dynamiques selon le type et la langue
  get texts() {
    if (this.type === 'announcements') {
      return this.currentLang === 'fr' ? {
        totalMembers: 'Annonces totales',
        sinceLastMonth: 'depuis le mois dernier',
        searches: 'Annonces publiées',
        sinceLastWeek: 'depuis la semaine dernière',
        adClicks: 'Annonces brouillon',
        awaitingPublication: 'en attente de publication'
      } : {
        totalMembers: 'Total Announcements',
        sinceLastMonth: 'since last month',
        searches: 'Published Announcements',
        sinceLastWeek: 'since last week',
        adClicks: 'Draft Announcements',
        awaitingPublication: 'awaiting publication'
      };
    }

    // Par défaut (type members)
    return this.currentLang === 'fr' ? {
      totalMembers: 'Membres totaux',
      sinceLastMonth: 'depuis le mois dernier',
      searches: 'Recherches',
      sinceLastWeek: 'depuis la semaine dernière',
      adClicks: 'Clics sur publicités'
    } : {
      totalMembers: 'Total Members',
      sinceLastMonth: 'since last month',
      searches: 'Searches',
      sinceLastWeek: 'since last week',
      adClicks: 'Ad Clicks'
    };
  }

  // Valeurs par défaut pour les stats si non fournies
  get computedStats() {
    const defaultStats = {
      totalMembers: 126,
      memberGrowth: 12,
      searches: 1243,
      searchGrowth: 5,
      adClicks: 348,
      clickGrowth: 18,
      totalAnnouncements: 45,
      announcementGrowth: 8,
      publishedAnnouncements: 32,
      publishedGrowth: 15,
      draftAnnouncements: 13
    };

    return { ...defaultStats, ...this.stats };
  }

  // Détermine le texte pour le pourcentage de croissance selon le type
  getGrowthText(): string {
    if (this.type === 'announcements') {
      return this.texts.awaitingPublication || '';
    }
    return this.stats.clickGrowth !== undefined ? 
      `+${this.computedStats.clickGrowth}% ${this.texts.sinceLastMonth}` : 
      `+${this.computedStats.publishedGrowth}% ${this.texts.sinceLastWeek}`;
  }

  // Formate les nombres avec séparateurs
  formatNumber(value: number | undefined): string {
    if (value === undefined) return '0';
    return value.toLocaleString();
  }
}