import { Component, Inject, PLATFORM_ID, ViewChild, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Preloader } from '../../components/preloader/preloader';
import { LegalHero } from '../../components/legal/legal-hero/legal-hero';
import { LegalProcess } from '../../components/legal/legal-process/legal-process';
import { LegalCases } from '../../components/legal/legal-cases/legal-cases';
import { LegalFaq } from '../../components/legal/legal-faq/legal-faq';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [Navbar, Footer, Preloader, LegalHero, LegalProcess, LegalCases, LegalFaq],
  templateUrl: './legal.html',
  styleUrl: './legal.css',
})
export class Legal implements AfterViewInit {
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