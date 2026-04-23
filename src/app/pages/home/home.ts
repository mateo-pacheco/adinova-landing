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
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}
  
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.querySelector('app-root')?.classList.add('loaded');
      }, 100);
    }
  }
  
  onPreloaderHidden() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('page-reveal');
    }
  }
}