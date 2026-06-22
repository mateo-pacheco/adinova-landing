import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly isMenuOpen = signal(false);

  protected readonly links = [
    { label: 'Estudio', href: '/', route: null },
    { label: 'Diseño', href: null, route: '/diseno' },
    { label: 'Construcción', href: null, route: '/construccion' },
    { label: 'Legal', href: null, route: '/legal' },
    { label: 'Testimonios', href: null, route: '/testimonios' },
  ];

  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
