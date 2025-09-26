import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { HeaderMembreComponent } from "../header-membre/header-membre.component";
import { LanguageService } from '../../../services/language.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-statistique',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule, HeaderMembreComponent],
  templateUrl: './statistique.component.html'
})
export class StatistiqueComponent implements OnInit, AfterViewInit, OnDestroy {
  private lineChart!: Chart;
  private pieChart!: Chart;
  currentRoute: string;
  private langSubscription!: Subscription;
  currentLang = 'fr';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.currentRoute = this.router.url;
  }

  // Textes dynamiques
  get texts() {
    return this.currentLang === 'fr' ? {
      // Titres et descriptions
      pageTitle: 'Statistiques de votre profil',
      pageDescription: 'Suivez les performances de votre profil et l\'engagement des visiteurs.',
      profileViews: 'Vues du profil',
      contactsReceived: 'Contacts reçus',
      lastUpdate: 'Dernière mise à jour',
      timelineContacts: 'Chronologie des contacts',
      
      // Métriques
      sinceLastMonth: 'depuis le mois dernier',
      sinceLastWeek: 'depuis la semaine dernière',
      
      // Légende timeline
      today: 'Aujourd\'hui',
      thisWeek: 'Cette semaine',
      thisMonth: 'Ce mois',
      thisYear: 'Cette année',
      
      // Tooltips
      dateLabel: 'Date',
      viewsLabel: 'vues',
      contactsLabel: 'contacts',
      
      // Navigation
      about: 'À propos',
      media: 'Média',
      schedule: 'Horaires',
      statistics: 'Statistiques'
    } : {
      // Titles and descriptions
      pageTitle: 'Your Profile Statistics',
      pageDescription: 'Track your profile performance and visitor engagement.',
      profileViews: 'Profile Views',
      contactsReceived: 'Contacts Received',
      lastUpdate: 'Last Update',
      timelineContacts: 'Contacts Timeline',
      
      // Metrics
      sinceLastMonth: 'since last month',
      sinceLastWeek: 'since last week',
      
      // Timeline legend
      today: 'Today',
      thisWeek: 'This week',
      thisMonth: 'This month',
      thisYear: 'This year',
      
      // Tooltips
      dateLabel: 'Date',
      viewsLabel: 'views',
      contactsLabel: 'contacts',
      
      // Navigation
      about: 'About',
      media: 'Media',
      schedule: 'Schedule',
      statistics: 'Statistics'
    };
  }

  // Données pour les métriques principales avec traductions
  get metriques() {
    return this.currentLang === 'fr' ? {
      vuesProfil: {
        valeur: '1 265',
        croissance: '+12%',
        periode: 'depuis le mois dernier'
      },
      contactsRecus: {
        valeur: '37',
        croissance: '+5%',
        periode: 'depuis la semaine dernière'
      },
      derniereMiseAJour: {
        valeur: '17/08/2025',
        croissance: '+18%',
        periode: 'depuis le mois dernier'
      }
    } : {
      vuesProfil: {
        valeur: '1,265',
        croissance: '+12%',
        periode: 'since last month'
      },
      contactsRecus: {
        valeur: '37',
        croissance: '+5%',
        periode: 'since last week'
      },
      derniereMiseAJour: {
        valeur: '08/17/2025',
        croissance: '+18%',
        periode: 'since last month'
      }
    };
  }

  // Données pour la légende du graphique en secteurs avec traductions
  get donneesChronologie() {
    const labels = this.currentLang === 'fr' ? 
      ["Aujourd'hui", 'Cette semaine', 'Ce mois', 'Cette année'] :
      ['Today', 'This week', 'This month', 'This year'];
    
    return [
      { label: labels[0], valeur: 15, couleur: 'bg-orange-500' },
      { label: labels[1], valeur: 25, couleur: 'bg-green-500' },
      { label: labels[2], valeur: 30, couleur: 'bg-yellow-500' },
      { label: labels[3], valeur: 30, couleur: 'bg-blue-500' }
    ];
  }

  ngOnInit(): void {
    // S'abonner aux changements de langue
    this.langSubscription = this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.updateChartsLanguage();
    });
    
    // Initialiser la langue
    this.currentLang = this.languageService.getCurrentLanguage();
  }

  ngAfterViewInit(): void {
    // Petit délai pour s'assurer que les éléments DOM sont bien rendus
    setTimeout(() => {
      this.initLineChart();
      this.initPieChart();
    }, 200);
  }

  private updateChartsLanguage(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    
    setTimeout(() => {
      this.initLineChart();
      this.initPieChart();
    }, 100);
  }

  private initLineChart(): void {
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas lineChart non trouvé - vérifiez que l\'élément existe dans le DOM');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Impossible d\'obtenir le contexte 2D du canvas lineChart');
      return;
    }

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: ['17/04', '20/04', '23/04', '26/04', '29/04', '02/05', '05/05', '08/05', '11/05', '14/05'],
        datasets: [{
          label: this.texts.profileViews,
          data: [45, 42, 48, 38, 42, 55, 62, 70, 85, 95],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#3B82F6',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3
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
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3B82F6',
            borderWidth: 2,
            cornerRadius: 8,
            displayColors: false,
            titleFont: {
              size: 13,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              title: (context) => `${this.texts.dateLabel}: ${context[0].label}`,
              label: (context) => `${context.parsed.y} ${this.texts.viewsLabel}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 172,
            ticks: {
              stepSize: 45,
              color: '#64748B',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              callback: function(value) {
                return value;
              }
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.2)',
              lineWidth: 1
            },
            border: {
              display: false
            }
          },
          x: {
            ticks: {
              color: '#64748B',
              font: {
                size: 11,
                family: 'Inter, system-ui, sans-serif'
              },
              maxRotation: 0
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBackgroundColor: '#3B82F6'
          }
        }
      }
    };

    this.lineChart = new Chart(ctx, config);
  }

  private initPieChart(): void {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas pieChart non trouvé - vérifiez que l\'élément existe dans le DOM');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Impossible d\'obtenir le contexte 2D du canvas pieChart');
      return;
    }

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: {
        labels: [this.texts.today, this.texts.thisWeek, this.texts.thisMonth, this.texts.thisYear],
        datasets: [{
          data: [15, 25, 30, 30],
          backgroundColor: [
            '#F97316', // Orange - Aujourd'hui
            '#10B981', // Vert - Cette semaine  
            '#F59E0B', // Jaune - Ce mois
            '#3B82F6'  // Bleu - Cette année
          ],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverBorderWidth: 4,
          hoverBorderColor: '#ffffff',
          hoverOffset: 8
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
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(148, 163, 184, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            titleFont: {
              size: 13,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const dataset = context.dataset.data as number[];
                const total = dataset.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${value} ${this.texts.contactsLabel} (${percentage}%)`;
              }
            }
          }
        },
        interaction: {
          intersect: false
        },
        animation: {
          duration: 1000
        },
        onHover: (event, activeElements) => {
          const canvas = event.native?.target as HTMLCanvasElement;
          if (canvas) {
            canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
          }
        }
      }
    };

    this.pieChart = new Chart(ctx, config);
  }

  // Méthodes de navigation
  navigateToPropos(): void {
    if (this.router.url !== '/apropos') {
      this.router.navigate(['/apropos']);
      this.currentRoute = '/apropos';
    }
  }

  navigateToMedia(): void {
    this.router.navigate(['/media']);
    this.currentRoute = '/media';
  }

  navigateToHoraire(): void {
    if (this.router.url !== '/horaire') {
      this.router.navigate(['/horaire']);
      this.currentRoute = '/horaire';
    }
  }
  
  navigateToStatistique(): void {
    this.router.navigate(['/statistique']);
    this.currentRoute = '/statistique';
  }
  
  isActiveTab(route: string): boolean {
    return this.currentRoute === route;
  }

  ngOnDestroy(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}