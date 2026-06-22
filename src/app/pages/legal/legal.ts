import { Component, OnInit, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { LegalHero } from '../../components/legal/legal-hero/legal-hero';
import { LegalProcess } from '../../components/legal/legal-process/legal-process';
import { LegalFaq } from '../../components/legal/legal-faq/legal-faq';
import { SeoService } from '../../shared/seo.service';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [Navbar, Footer, LegalHero, LegalProcess, LegalFaq],
  templateUrl: './legal.html',
  styleUrl: './legal.css',
})
export class Legal implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateSeoTags({
      title: 'Asesoría Legal para Proyectos Arquitectónicos en Cuenca',
      description: 'Gestión de permisos de construcción, trámites municipales y asesoría legal para proyectos arquitectónicos en Cuenca. Regularización de bienes inmuebles y seguridad jurídica para inversiones.',
      keywords: 'asesoría legal arquitectura Cuenca, permisos construcción, trámites municipales, regularización inmuebles',
      canonical: 'https://adinovaestudio.com/legal',
      image: 'https://adinovaestudio.com/assets/logo/icono_fondo.webp'
    });
  }
}