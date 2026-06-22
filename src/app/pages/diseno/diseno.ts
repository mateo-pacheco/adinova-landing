import { Component, OnInit, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { DisenoHero } from '../../components/diseno/diseno-hero/diseno-hero';
import { DisenoGallery } from '../../components/diseno/diseno-gallery/diseno-gallery';
import { DisenoProcess } from '../../components/diseno/diseno-process/diseno-process';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-diseno',
  standalone: true,
  imports: [Navbar, Footer, DisenoHero, DisenoGallery, DisenoProcess],
  templateUrl: './diseno.html',
  styleUrl: './diseno.css',
})
export class Diseno implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateSeoTags({
      title: 'Diseño Arquitectónico y de Interiores en Cuenca',
      description: 'Servicios profesionales de diseño arquitectónico y de interiores en Cuenca. Planos, renders, y diseño conceptual para proyectos residenciales y comerciales. Transformamos ideas en espacios funcionales y estéticos.',
      keywords: 'diseño arquitectónico Cuenca, diseño interiores Cuenca, planos arquitectónicos, renders 3D, diseño conceptual',
      canonical: 'https://adinovaestudio.com/diseno',
      image: 'https://adinovaestudio.com/assets/logo/icono_fondo.webp'
    });
  }
}