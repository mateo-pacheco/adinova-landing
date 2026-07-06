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
      title: 'Levantamientos Planimétricos',
      description:
        'Medición técnica precisa de terrenos y edificaciones. ' +
        'Planos topográficos, curvas de nivel e informes para ' +
        'procesos legales, construcción y regularización predial.',
      label: 'Topografía',
      image: 'assets/img/LP.webp',
    },
    {
      index: '02',
      title: 'Trámites',
      description:
        'Gestión integral de permisos de construcción, licencias urbanísticas, certificados de afectación y aprobaciones ante el municipio de Cuenca.',
      label: 'Trámites',
      image: 'assets/img/Tra.webp',
    },
    {
      index: '03',
      title: 'Arreglo de Escrituras',
      description:
        'Regularización de escrituras, posesiones efectivas ' +
        'y derechos sucesorios. Procesos de derecho patrimonial ' +
        'con acompañamiento jurídico especializado.',
      label: 'Escrituras',
      image: 'assets/img/AE.webp',
    },
    {
      index: '04',
      title: 'Arquitectura residencial',
      description:
        'Diseñamos viviendas que priorizan la luz natural, ' +
        'la privacidad y la conexión con el entorno. Cada casa ' +
        'es pensada desde la forma de habitar de sus dueños, ' +
        'con materiales nobles y espacios que envejecen con dignidad.',
      label: 'Residencial',
      image: 'assets/img/10.webp',
    },
    {
      index: '05',
      title: 'Arquitectura comercial',
      description:
        'Espacios comerciales que traducen la identidad de marca ' +
        'en experiencias espaciales memorables. Oficinas, ' +
        'restaurantes y locales diseñados para generar valor ' +
        'y bienestar.',
      label: 'Comercial',
      image: 'assets/img/01.webp',
    },
    {
      index: '06',
      title: 'Interiorismo',
      description:
        'Proyectos de interiores donde la materialidad, ' +
        'la atmósfera y el detalle construyen la experiencia. ' +
        'Creamos ambientes sobrios y coherentes que potencian ' +
        'la función de cada espacio.',
      label: 'Interiorismo',
      image: 'assets/img/02.webp',
    },
  ];


}
