import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  protected readonly items = [
    {
      index: '01',
      title: 'Arquitectura residencial',
      description:
        'Proyectos que prioritizan la luz natural, la privacidad y la conexion con el entorno. Viviendas pensadas para habitar con quietud.',
      label: 'Residencial',
      image: 'assets/mock/07-night-render.svg',
    },
    {
      index: '02',
      title: 'Arquitectura comercial',
      description:
        'Espacios comerciales que traducen identidad de marca en recorridos claros y memorables. Tiendas, oficinas y locales pensados para generar valor.',
      label: 'Comercial',
      image: 'assets/mock/08-material-board.svg',
    },
    {
      index: '03',
      title: 'Interiorismo',
      description:
        'Diseno de interiores que trabaja con materialidad, atmosfera y detalle. Ambientes sobrios y coherentes con el espacio arquitectura.',
      label: 'Interiorismo',
      image: 'assets/mock/09-perspective.svg',
    },
    {
      index: '04',
      title: 'Diseno conceptual',
      description:
        'Desarrollo de ideas espaciales solidas para orientar decisiones desde el inicio. Volumetrias y esquemas que definen el proyecto.',
      label: 'Conceptual',
      image: 'assets/mock/10-studio-desk.svg',
    },
    {
      index: '05',
      title: 'Direccion de obra',
      description:
        'Supervision tecnica y control de ejecucion para mantener calidad constructiva. Seguimiento desde proyecto hasta entrega final.',
      label: 'Obra',
      image: 'assets/mock/01-hero-facade.svg',
    },
    {
      index: '06',
      title: 'Planificacion espacial',
      description:
        'Organizacion funcional del programa arquitectonico. Optimizacion de flujos, usos y permanencia en cada escala del proyecto.',
      label: 'Programa',
      image: 'assets/mock/02-interior-living.svg',
    },
  ];
}
