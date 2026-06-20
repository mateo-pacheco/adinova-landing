import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  protected readonly values = [
    {
      title: 'Claridad espacial',
      description:
        'Cada decision responde a una logica funcional, visual y constructiva. Espacios que fluyen con naturalidad y proposito.',
    },
    {
      title: 'Materialidad honesta',
      description:
        'Trabajamos con texturas autenticas, luz natural y proporciones que envejecen con dignidad. Sin revestimientos innecesarios.',
    },
    {
      title: 'Precision tecnica',
      description:
        'El diseno y la ejecucion se articulan con rigor. Control continuo de cada detalle constructivo desde el concepto hasta la entrega.',
    },
    {
      title: 'Contexto y lugar',
      description:
        'Cada proyecto nace del dialogo con su entorno. Clima, topografia, cultura y paisaje definen las decisiones arquitectonicas.',
    },
  ];

  protected readonly team = [
    {
      name: 'Erick Ramiro Farez Paguay',
      role: 'Gerente - Representante legal de Adinova',
    },
    {
      name: 'Daniel Pedro Chicaiza Quituisaca',
      role: 'Jefe de Construccion - Encargado de los procesos en obra',
    },
    {
      name: 'Pablo Andres Patiño Campoverde',
      role: 'Jefe de Topografia - Medicion de terrenos en campo',
    },
    {
      name: 'Sami Dayanna Vacacela Naranjo',
      role: 'Arquitecta Junior - Dibujante de proyectos arquitectonicos',
    },
    {
      name: 'Britany Lizbeth Gaon Lopez',
      role: 'Abogada - Tramite de procesos legales en derecho patrimonial',
    },
    {
      name: 'Ivan Joel Pardo Castro',
      role: 'Marketing Digital - Gestion de campañas y redes sociales',
    },
    {
      name: 'Kevin Anibal Brito Sarmiento',
      role: 'Arquitecto - Dibujante de proyectos arquitectonicos',
    },
  ];

  ngOnInit() {}
}
