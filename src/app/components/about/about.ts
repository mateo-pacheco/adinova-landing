import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly values = [
    {
      title: 'Claridad espacial',
      description:
        'Cada decision responde a una logica funcional, visual y constructiva. Espacios que funcionan sin多余的.',
    },
    {
      title: 'Materialidad sobria',
      description:
        'Trabajamos con texturas honestas, luz natural y proporciones que envejecen con dignidad.',
    },
    {
      title: 'Precision tecnica',
      description:
        'El diseno y la ejecucion se articulan con criterio. Control continuo de cada detalle constructivo.',
    },
  ];

  protected readonly team = [
    {
      name: 'Andrea Molina',
      role: 'Arquitecta principal',
    },
    {
      name: 'Daniel Vela',
      role: 'Director de proyecto',
    },
    {
      name: 'Sofia Cardenas',
      role: 'Especialista en interiores',
    },
  ];
}
