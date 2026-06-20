import { Component, OnInit, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { Hero } from '../../components/hero/hero';
import { Marquee } from '../../components/marquee/marquee';
import { Services } from '../../components/services-company/services';
import { About } from '../../components/about/about';
import { Contact } from '../../components/contact/contact';
import { Social } from '../../components/social/social';
import { Map } from "../../components/map/map";
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Hero, Marquee, Services, About, Contact, Social, Footer, Map],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateSeoTags({
      title: 'Estudio de Arquitectura Contemporánea en Cuenca',
      description: 'Adinova es un estudio de arquitectura contemporánea en Cuenca. Diseño arquitectónico, construcción y asesoría legal para proyectos residenciales y comerciales. 6+ años transformando espacios.',
      keywords: 'arquitectura Cuenca, estudio arquitectura, diseño arquitectónico, construcción Cuenca, asesoría legal arquitectura',
      canonical: 'https://adinovaestudio.com/'
    });
  }
}