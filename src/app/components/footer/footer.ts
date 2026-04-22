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
    { label: 'Ubicacion', href: '#ubicacion' },
    { label: 'Contacto', href: '#contacto' },
  ];

  protected readonly contacts = [
    { label: 'hola@adinova.studio', href: 'mailto:hola@adinova.studio' },
    { label: '+593 99 123 4567', href: 'tel:+593991234567' },
  ];
}
