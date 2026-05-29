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
    { label: 'hola@adinova.studio', href: 'mailto:hola@adinova.studio' },
    { label: '+593 98 765 4321', href: 'tel:+593987654321' },
    { label: 'Quito, Ecuador', href: '#' },
  ];
}
