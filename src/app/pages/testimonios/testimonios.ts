import { Component, Inject, PLATFORM_ID, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Preloader } from '../../components/preloader/preloader';
import { TestimoniosHero } from '../../components/testimonios/testimonios-hero/testimonios-hero';
import { TestimoniosGrid } from '../../components/testimonios/testimonios-grid/testimonios-grid';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [Navbar, Footer, Preloader, TestimoniosHero, TestimoniosGrid],
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.css',
})
export class Testimonios implements OnInit, AfterViewInit {
  @ViewChild(Preloader) preloader!: Preloader;
  preloaderCompleted = false;
  pageVisible = false;
  private seo = inject(SeoService);
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.seo.updateSeoTags({
      title: 'Testimonios y Clientes',
      description: 'Conoce la experiencia de nuestros clientes. Más de 6 años diseñando y construyendo sueños arquitectónicos en Cuenca con excelencia.',
      canonical: 'https://adinovaestudio.com/testimonios'
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