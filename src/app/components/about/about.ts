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
        'Cada decisión responde a una lógica funcional, visual y constructiva. Espacios que fluyen con naturalidad y propósito.',
    },
    {
      title: 'Materialidad honesta',
      description:
        'Trabajamos con texturas auténticas, luz natural y proporciones que envejecen con dignidad. Sin revestimientos innecesarios.',
    },
    {
      title: 'Precisión técnica',
      description:
        'El diseño y la ejecución se articulan con rigor. Control continuo de cada detalle constructivo desde el concepto hasta la entrega.',
    },
    {
      title: 'Contexto y lugar',
      description:
        'Cada proyecto nace del diálogo con su entorno. Clima, topografía, cultura y paisaje definen las decisiones arquitectónicas.',
    },
  ];

  protected readonly team = [
    {
      name: 'Erick Ramiro Farez Paguay',
      role: 'Gerente - Representante legal de Adinova',
    },
    {
      name: 'Daniel Pedro Chicaiza Quituisaca',
      role: 'Jefe de Construcción - Encargado de los procesos en obra',
    },
    {
      name: 'Pablo Andres Patiño Campoverde',
      role: 'Jefe de Topografía - Medición de terrenos en campo',
    },
    {
      name: 'Sami Dayanna Vacacela Naranjo',
      role: 'Arquitecta Junior - Dibujante de proyectos arquitectónicos',
    },
    {
      name: 'Britany Lizbeth Gaon Lopez',
      role: 'Abogada - Trámite de procesos legales en derecho patrimonial',
    },
    {
      name: 'Ivan Joel Pardo Castro',
      role: 'Marketing Digital - Gestión de campañas y redes sociales',
    },
    {
      name: 'Kevin Anibal Brito Sarmiento',
      role: 'Arquitecto - Dibujante de proyectos arquitectónicos',
    },
  ];

  ngOnInit() {}
}
