import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { LanguageService } from '../../../services/language.service';
import { CompanySectorService, SectorKPI } from '../../../services/company-sector.service';
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

  // Données dynamiques pour les secteurs
  sectorData: SectorKPI[] = [];
  isLoadingSectors = true;
  sectorError = '';

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
      innovation: 'Innovation',
      loading: 'Chargement des données...',
      errorLoading: 'Erreur lors du chargement des données'
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
      innovation: 'Innovation',
      loading: 'Loading data...',
      errorLoading: 'Error loading data'
    };
  }

  constructor(
    private router: Router,
    private languageService: LanguageService,
    public companySectorService: CompanySectorService
  ) {
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateChartsLanguage();
    });
    
    this.currentLang = this.languageService.getCurrentLanguage();
    
    // Charger les données des secteurs
    this.loadSectorData();
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

  /**
   * Charger les données des secteurs depuis l'API
   */
  private loadSectorData(): void {
    this.isLoadingSectors = true;
    this.sectorError = '';

    this.companySectorService.getCompanyBySector().subscribe({
      next: (data) => {
        this.sectorData = this.companySectorService.sortSectorsByPercentage(data);
        this.isLoadingSectors = false;
        
        // Recréer le graphique des secteurs avec les nouvelles données
        setTimeout(() => {
          this.updateSectorsChart();
        }, 100);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données des secteurs:', error);
        this.sectorError = this.texts.errorLoading;
        this.isLoadingSectors = false;
      }
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

    // Si les données ne sont pas encore chargées, créer un graphique vide
    if (this.isLoadingSectors || this.sectorData.length === 0) {
      this.createEmptySectorsChart(ctx);
      return;
    }

    this.createDynamicSectorsChart(ctx);
  }

  private createEmptySectorsChart(ctx: CanvasRenderingContext2D): void {
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [this.texts.loading],
        datasets: [{
          data: [100],
          backgroundColor: ['#E5E7EB'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      }
    });

    this.chartInstances.push(chart);
  }

  private createDynamicSectorsChart(ctx: CanvasRenderingContext2D): void {
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.sectorData.map(sector => sector.sectorName),
        datasets: [{
          data: this.sectorData.map(sector => sector.percentage),
          backgroundColor: this.sectorData.map(sector => sector.color),
          borderWidth: 0,
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
                return `${label}: ${this.companySectorService.formatPercentage(value)}`;
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

  /**
   * Mettre à jour le graphique des secteurs avec les données dynamiques
   */
  private updateSectorsChart(): void {
    // Trouver et détruire l'ancien graphique des secteurs
    const sectorChartIndex = this.chartInstances.findIndex(chart => 
      chart.canvas === this.sectorsChart?.nativeElement
    );
    
    if (sectorChartIndex !== -1) {
      this.chartInstances[sectorChartIndex].destroy();
      this.chartInstances.splice(sectorChartIndex, 1);
    }

    // Recréer le graphique avec les nouvelles données
    if (this.sectorsChart?.nativeElement) {
      const ctx = this.sectorsChart.nativeElement.getContext('2d');
      if (ctx) {
        this.createDynamicSectorsChart(ctx);
      }
    }
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

  /**
   * Obtenir le nombre total de membres basé sur les données des secteurs
   */
  getTotalMembersFromSectors(): number {
    if (this.sectorData.length === 0) return this.stats.totalMembers;
    
    // Simuler un nombre total basé sur les pourcentages
    // Dans une vraie application, vous auriez le nombre réel depuis l'API
    return Math.round(this.stats.totalMembers * (this.sectorData.reduce((sum, sector) => sum + sector.percentage, 0) / 100));
  }
}