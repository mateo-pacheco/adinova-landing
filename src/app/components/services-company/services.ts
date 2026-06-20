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
        'Diseñamos viviendas que priorizan la luz natural, la privacidad y la conexión con el entorno. Cada casa es pensada desde la forma de habitar de sus dueños, con materiales nobles y espacios que envejecen con dignidad.',
      label: 'Residencial',
      image: 'assets/img/07.webp',
    },
    {
      index: '02',
      title: 'Arquitectura comercial',
      description:
        'Espacios comerciales que traducen la identidad de marca en experiencias espaciales memorables. Oficinas, restaurantes y locales diseñados para generar valor y bienestar.',
      label: 'Comercial',
      image: 'assets/img/08.webp',
    },
    {
      index: '03',
      title: 'Interiorismo',
      description:
        'Proyectos de interiores donde la materialidad, la atmósfera y el detalle construyen la experiencia. Creamos ambientes sobrios y coherentes que potencian la función de cada espacio.',
      label: 'Interiorismo',
      image: 'assets/img/09.webp',
    },
    {
      index: '04',
      title: 'Diseño conceptual',
      description:
        'Desarrollamos ideas espaciales sólidas desde la fase cero. Volumetrías, estudios de luz y esquemas funcionales que definen la dirección del proyecto antes de iniciar la etapa técnica.',
      label: 'Conceptual',
      image: 'assets/img/10.webp',
    },
    {
      index: '05',
      title: 'Dirección de obra',
      description:
        'Supervisión técnica integral durante la ejecución. Control de calidad, cumplimiento de planos, coordinación de gremios y gestión de proveedores para garantizar el resultado proyectado.',
      label: 'Obra',
      image: 'assets/img/01.webp',
    },
    {
      index: '06',
      title: 'Planificación espacial',
      description:
        'Organización funcional del programa arquitectónico a cualquier escala. Optimización de flujos, usos y permanencias para maximizar el rendimiento de cada metro cuadrado.',
      label: 'Programa',
      image: 'assets/img/02.webp',
    },
  ];


}
