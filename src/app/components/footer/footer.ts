import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly navigation = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Estudio', href: '#estudio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#contacto' },
  ];

  protected readonly contacts = [
    { label: 'adinovaarq@gmail.com', href: 'mailto:adinovaarq@gmail.com' },
    { label: '+593 98 409 0397', href: 'tel:+593984090397' },
    { label: 'Luis Cordero 9-55 y Simón Bolívar, Ofic. #16', href: 'https://maps.app.goo.gl/HLxuPuiyU563Tr9w6' },
  ];
}
