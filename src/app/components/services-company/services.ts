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
        'Disenamos viviendas que priorizan la luz natural, la privacidad y la conexion con el entorno. Cada casa es pensada desde la forma de habitar de sus duenos, con materiales nobles y espacios que envejecen con dignidad.',
      label: 'Residencial',
      image: 'assets/img/07.webp',
    },
    {
      index: '02',
      title: 'Arquitectura comercial',
      description:
        'Espacios comerciales que traducen la identidad de marca en experiencias espaciales memorables. Oficinas, restaurantes y locales disenados para generar valor y bienestar.',
      label: 'Comercial',
      image: 'assets/img/08.webp',
    },
    {
      index: '03',
      title: 'Interiorismo',
      description:
        'Proyectos de interiores donde la materialidad, la atmosfera y el detalle construyen la experiencia. Creamos ambientes sobrios y coherentes que potencian la funcion de cada espacio.',
      label: 'Interiorismo',
      image: 'assets/img/09.webp',
    },
    {
      index: '04',
      title: 'Diseno conceptual',
      description:
        'Desarrollamos ideas espaciales solidas desde la fase cero. Volumetrias, estudios de luz y esquemas funcionales que definen la direccion del proyecto antes de iniciar la etapa tecnica.',
      label: 'Conceptual',
      image: 'assets/img/10.webp',
    },
    {
      index: '05',
      title: 'Direccion de obra',
      description:
        'Supervision tecnica integral durante la ejecucion. Control de calidad, cumplimiento de planos, coordinacion de gremios y gestion de proveedores para garantizar el resultado proyectado.',
      label: 'Obra',
      image: 'assets/img/01.webp',
    },
    {
      index: '06',
      title: 'Planificacion espacial',
      description:
        'Organizacion funcional del programa arquitectonico a cualquier escala. Optimizacion de flujos, usos y permanencias para maximizar el rendimiento de cada metro cuadrado.',
      label: 'Programa',
      image: 'assets/img/02.webp',
    },
  ];


}
