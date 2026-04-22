import { Component } from '@angular/core';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
})
export class Marquee {
  protected readonly items = [
    {
      title: 'Arquitectura residencial',
      label: 'Casa Patron',
      image: 'assets/mock/01-hero-facade.svg',
    },
    {
      title: 'Arquitectura comercial',
      label: 'Retail',
      image: 'assets/mock/02-interior-living.svg',
    },
    {
      title: 'Interiorismo',
      label: 'Interior',
      image: 'assets/mock/03-floor-plan.svg',
    },
    {
      title: 'Direccion de obra',
      label: 'Obra',
      image: 'assets/mock/04-facade-detail.svg',
    },
    {
      title: 'Diseno conceptual',
      label: 'Concepto',
      image: 'assets/mock/05-site-plan.svg',
    },
    {
      title: 'Planificacion espacial',
      label: 'Programa',
      image: 'assets/mock/06-section-cut.svg',
    },
  ];
}
