import { Component, signal, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  protected readonly isMenuOpen = signal(false);
  protected readonly isScrolled = signal(false);

  private scrollHandler: (() => void) | null = null;

  protected readonly links = [
    { label: 'Estudio', href: '/', route: null },
    { label: 'Diseño', href: null, route: '/diseno' },
    { label: 'Construcción', href: null, route: '/construccion' },
    { label: 'Legal', href: null, route: '/legal' },
    { label: 'Testimonios', href: null, route: '/testimonios' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrollHandler = () => {
      this.isScrolled.set(window.scrollY > 40);
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
