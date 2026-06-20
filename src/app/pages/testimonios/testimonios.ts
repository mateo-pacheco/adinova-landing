import { Component, OnInit, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { TestimoniosHero } from '../../components/testimonios/testimonios-hero/testimonios-hero';
import { TestimoniosGrid } from '../../components/testimonios/testimonios-grid/testimonios-grid';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [Navbar, Footer, TestimoniosHero, TestimoniosGrid],
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.css',
})
export class Testimonios implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateSeoTags({
      title: 'Testimonios de Clientes',
      description: 'Opiniones y experiencias de clientes que confiaron en Adinova para sus proyectos arquitectónicos en Cuenca. Más de 6 años de excelencia en diseño y construcción.',
      keywords: 'testimonios arquitectura Cuenca, opiniones clientes, experiencias construcción',
      canonical: 'https://adinovaestudio.com/testimonios'
    });
  }
}