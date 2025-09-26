import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CardStateComponent } from "../card-state/card-state.component";

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-static',
  standalone: true,
  imports: [CommonModule, HeaderAdminComponent, CardStateComponent],
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.css']
})
export class StaticComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('visitsChart', { static: false }) visitsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sectorsChart', { static: false }) sectorsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bannerClicksChart', { static: false }) bannerClicksChart!: ElementRef<HTMLCanvasElement>;

  private chartInstances: Chart[] = [];
  private langSubscription!: Subscription;
  currentLang = 'fr';
  currentRoute: string;

  // Données statistiques
  stats = {
    totalMembers: 126,
    memberGrowth: 12,
    searches: 1243,
    searchGrowth: 5,
    adClicks: 348,
    adClickGrowth: 18
  };

  // Données pour les graphiques
  visitsData = [
    { date: '02/05', visits: 300 },
    { date: '04/05', visits: 420 },
    { date: '06/05', visits: 280 },
    { date: '08/05', visits: 350 },
    { date: '10/05', visits: 450 },
    { date: '12/05', visits: 480 },
    { date: '14/05', visits: 520 }
  ];

  popularSearches = [
    { term: 'Technologie', count: 180 },
    { term: 'Finance', count: 140 },
    { term: 'Paris', count: 100 },
    { term: 'États-Unis', count: 85 },
    { term: 'Innovation', count: 75 },
    { term: 'Commerce', count: 60 }
  ];

  sectorData = {
    technologie: { count: 42, percentage: 33 },
    finance: { count: 28, percentage: 22 },
    sante: { count: 19, percentage: 15 },
    education: { count: 14, percentage: 11 },
    industrie: { count: 13, percentage: 10 },
    commerce: { count: 10, percentage: 9 }
  };

  bannerClicksData = [
    { name: 'Conférence annuelle', clicks: 135 },
    { name: 'Forum économique', clicks: 85 },
    { name: 'Innovation Summit', clicks: 75 },
    { name: 'Tech Conference', clicks: 65 }
  ];

  // Textes dynamiques
  get texts() {
    return this.currentLang === 'fr' ? {
      statistics: 'Statistiques',
      followPerformance: 'Suivez les performances',
      totalMembers: 'Membres totaux',
      sinceLastMonth: 'depuis le mois dernier',
      searches: 'Recherches',
      sinceLastWeek: 'depuis la semaine dernière',
      adClicks: 'Clics sur publicités',
      visitsPerDay: 'Visites par jour',
      popularSearches: 'Recherches populaires',
      membersBySector: 'Membres par secteur',
      bannerClicks: 'Clics sur bannières',
      technology: 'Technologie',
      finance: 'Finance',
      health: 'Santé',
      education: 'Éducation',
      industry: 'Industrie',
      commerce: 'Commerce',
      annualConference: 'Conférence annuelle',
      economicForum: 'Forum économique',
      innovationSummit: 'Innovation Summit',
      techConference: 'Tech Conference',
      paris: 'Paris',
      unitedStates: 'États-Unis',
      innovation: 'Innovation'
    } : {
      statistics: 'Statistics',
      followPerformance: 'Track performance',
      totalMembers: 'Total Members',
      sinceLastMonth: 'since last month',
      searches: 'Searches',
      sinceLastWeek: 'since last week',
      adClicks: 'Ad Clicks',
      visitsPerDay: 'Daily Visits',
      popularSearches: 'Popular Searches',
      membersBySector: 'Members by Sector',
      bannerClicks: 'Banner Clicks',
      technology: 'Technology',
      finance: 'Finance',
      health: 'Health',
      education: 'Education',
      industry: 'Industry',
      commerce: 'Commerce',
      annualConference: 'Annual Conference',
      economicForum: 'Economic Forum',
      innovationSummit: 'Innovation Summit',
      techConference: 'Tech Conference',
      paris: 'Paris',
      unitedStates: 'United States',
      innovation: 'Innovation'
    };
  }

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateChartsLanguage();
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
  }

  ngAfterViewInit(): void {
    // Délai pour s'assurer que les éléments du DOM sont prêts
    setTimeout(() => {
      this.createVisitsChart();
      this.createSectorsChart();
      this.createBannerClicksChart();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    
    // Détruire tous les graphiques
    this.chartInstances.forEach(chart => {
      chart.destroy();
    });
  }

  private createVisitsChart(): void {
    if (!this.visitsChart?.nativeElement) return;

    const ctx = this.visitsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.visitsData.map(d => d.date),
        datasets: [{
          data: this.visitsData.map(d => d.visits),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#3B82F6',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280'
            }
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  private createSectorsChart(): void {
    if (!this.sectorsChart?.nativeElement) return;

    const ctx = this.sectorsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const sectorLabels = this.currentLang === 'fr' 
      ? ['Technologie', 'Finance', 'Santé', 'Éducation', 'Industrie', 'Commerce']
      : ['Technology', 'Finance', 'Health', 'Education', 'Industry', 'Commerce'];

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: sectorLabels,
        datasets: [{
          data: [
            this.sectorData.technologie.percentage,
            this.sectorData.finance.percentage,
            this.sectorData.sante.percentage,
            this.sectorData.education.percentage,
            this.sectorData.industrie.percentage,
            this.sectorData.commerce.percentage
          ],
          backgroundColor: [
            '#3B82F6', // Technologie - Bleu
            '#10B981', // Finance - Vert
            '#F59E0B', // Santé - Orange
            '#EF4444', // Éducation - Rouge
            '#8B5CF6', // Industrie - Violet
            '#6B7280'  // Commerce - Gris
          ],
          borderWidth: 0,               
          // cutout: 0 // Pie chart plein, pas de donut
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              color: '#374151',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  private createBannerClicksChart(): void {
    if (!this.bannerClicksChart?.nativeElement) return;

    const ctx = this.bannerClicksChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const bannerLabels = this.currentLang === 'fr' 
      ? this.bannerClicksData.map(d => d.name)
      : ['Annual Conference', 'Economic Forum', 'Innovation Summit', 'Tech Conference'];

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bannerLabels,
        datasets: [{
          data: this.bannerClicksData.map(d => d.clicks),
          backgroundColor: '#1E40AF',
          borderColor: '#1E40AF',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              maxRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280'
            }
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  private updateChartsLanguage(): void {
    // Détruire les graphiques existants
    this.chartInstances.forEach(chart => {
      chart.destroy();
    });
    this.chartInstances = [];

    // Recréer les graphiques avec les nouvelles langues
    setTimeout(() => {
      this.createVisitsChart();
      this.createSectorsChart();
      this.createBannerClicksChart();
    }, 100);
  }

  getPopularSearchTerm(term: string): string {
    const termMap = this.currentLang === 'fr' ? {
      'Technology': 'Technologie',
      'Finance': 'Finance',
      'Paris': 'Paris',
      'United States': 'États-Unis',
      'Innovation': 'Innovation',
      'Commerce': 'Commerce'
    } : {
      'Technologie': 'Technology',
      'Finance': 'Finance',
      'Paris': 'Paris',
      'États-Unis': 'United States',
      'Innovation': 'Innovation',
      'Commerce': 'Commerce'
    };
    return termMap[term as keyof typeof termMap] || term;
  }
}