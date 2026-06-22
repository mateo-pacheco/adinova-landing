import { Component, OnInit, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ConstruccionHero } from '../../components/construccion/construccion-hero/construccion-hero';
import { ConstruccionProcess } from '../../components/construccion/construccion-process/construccion-process';
import { ConstruccionCases } from '../../components/construccion/construccion-cases/construccion-cases';
import { ConstruccionFaq } from '../../components/construccion/construccion-faq/construccion-faq';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-construccion',
  standalone: true,
  imports: [Navbar, Footer, ConstruccionHero, ConstruccionProcess, ConstruccionCases, ConstruccionFaq],
  templateUrl: './construccion.html',
  styleUrl: './construccion.css',
})
export class Construccion implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateSeoTags({
      title: 'Construcción de Obras Arquitectónicas en Cuenca',
      description: 'Expertos en construcción y ejecución de obras arquitectónicas en Cuenca. Calidad, precisión y cumplimiento de plazos. Remodelaciones, ampliaciones y obra nueva. Solicita tu presupuesto sin compromiso.',
      keywords: 'construcción Cuenca, obras arquitectónicas, remodelaciones Cuenca, construcción residencial, presupuesto construcción',
      canonical: 'https://adinovaestudio.com/construccion',
      image: 'https://adinovaestudio.com/assets/logo/icono_fondo.webp'
    });
  }
}