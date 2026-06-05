import { Component, Inject, PLATFORM_ID, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Preloader } from '../../components/preloader/preloader';
import { ConstruccionHero } from '../../components/construccion/construccion-hero/construccion-hero';
import { ConstruccionProcess } from '../../components/construccion/construccion-process/construccion-process';
import { ConstruccionCases } from '../../components/construccion/construccion-cases/construccion-cases';
import { ConstruccionFaq } from '../../components/construccion/construccion-faq/construccion-faq';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-construccion',
  standalone: true,
  imports: [Navbar, Footer, Preloader, ConstruccionHero, ConstruccionProcess, ConstruccionCases, ConstruccionFaq],
  templateUrl: './construccion.html',
  styleUrl: './construccion.css',
})
export class Construccion implements OnInit, AfterViewInit {
  @ViewChild(Preloader) preloader!: Preloader;
  preloaderCompleted = false;
  pageVisible = false;
  private seo = inject(SeoService);
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.seo.updateSeoTags({
      title: 'Construcción y Obra',
      description: 'Expertos en ejecución de obras arquitectónicas en Quito. Calidad, precisión y cumplimiento de plazos en cada proyecto de construcción.',
      canonical: 'https://adinovaestudio.com/construccion'
    });
  }
  
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.preloaderCompleted && !this.pageVisible) {
          this.pageVisible = true;
        }
      }, 100);
    }
  }
  
  onPreloaderHidden() {
    if (isPlatformBrowser(this.platformId)) {
      this.preloaderCompleted = true;
      
      const hostEl = document.querySelector('app-preloader');
      if (hostEl) {
        (hostEl as HTMLElement).style.display = 'none';
      }
      
      this.enablePageContent();
      this.pageVisible = true;
      window.scrollTo(0, 0);
    }
  }

  private enablePageContent() {
    const root = document.querySelector('app-root');
    if (root) {
      root.classList.add('loaded');
    }
  }
}