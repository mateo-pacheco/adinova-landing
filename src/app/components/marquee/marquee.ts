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
      label: 'Casa Alto Valle',
      image: 'assets/img/01.webp',
    },
    {
      title: 'Arquitectura comercial',
      label: 'Oficinas UIO',
      image: 'assets/img/02.webp',
    },
    {
      title: 'Interiorismo',
      label: 'Restaurante Tierra',
      image: 'assets/img/03.webp',
    },
    {
      title: 'Direccion de obra',
      label: 'Conjunto San Luis',
      image: 'assets/img/04.webp',
    },
    {
      title: 'Diseno conceptual',
      label: 'Centro Logistico',
      image: 'assets/img/05.webp',
    },
    {
      title: 'Planificacion espacial',
      label: 'Hacienda El Rosal',
      image: 'assets/img/06.webp',
    },
  ];
}
