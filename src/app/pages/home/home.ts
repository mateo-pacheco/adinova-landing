import { Component, Inject, PLATFORM_ID, ViewChild, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Hero } from '../../components/hero/hero';
import { Marquee } from '../../components/marquee/marquee';
import { Services } from '../../components/services-company/services';
import { About } from '../../components/about/about';
import { Contact } from '../../components/contact/contact';
import { Social } from '../../components/social/social';
import { Map } from "../../components/map/map";
import { Preloader } from '../../components/preloader/preloader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Hero, Marquee, Services, About, Contact, Social, Footer, Map, Preloader],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
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