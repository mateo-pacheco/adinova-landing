import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly isMenuOpen = signal(false);

  protected readonly links = [
    { label: 'Estudio', href: '#estudio' },
    { label: 'Diseño', href: '/diseno' },
    { label: 'Construccion', href: '/construccion' },
    { label: 'Legal', href: '/legal' },
    { label: 'Testimonios', href: '/testimonios' },
  ];

  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
