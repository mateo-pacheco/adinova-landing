import { Component, Inject, PLATFORM_ID, ViewChild, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Preloader } from '../../components/preloader/preloader';
import { TestimoniosHero } from '../../components/testimonios/testimonios-hero/testimonios-hero';
import { TestimoniosGrid } from '../../components/testimonios/testimonios-grid/testimonios-grid';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [Navbar, Footer, Preloader, TestimoniosHero, TestimoniosGrid],
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.css',
})
export class Testimonios implements AfterViewInit {
  @ViewChild(Preloader) preloader!: Preloader;
  preloaderCompleted = false;
  pageVisible = false;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}
  
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