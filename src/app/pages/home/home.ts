import { Component, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Hero, Marquee, Services, About, Contact, Social, Footer, Map],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const main = document.querySelector('main');
        if (main) {
          this.renderer.addClass(main, 'fade-in');
        }
        
        const hero = document.querySelector('.hero-container');
        if (hero) {
          this.renderer.addClass(hero, 'hero-visible');
        }
      }, 100);
    }
  }
}
