import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
})
export class Marquee {
  readonly track = viewChild<ElementRef<HTMLDivElement>>('track');

  protected paused = false;
  protected translateX = 0;

  protected readonly items = [
    {
      title: 'Arquitectura residencial',
      label: 'Casa Alto Valle',
      image: 'assets/img/01.webp',
    },
    {
      title: 'Arquitectura comercial',
      label: 'Oficinas Cuenca',
      image: 'assets/img/02.webp',
    },
    {
      title: 'Interiorismo',
      label: 'Restaurante Tierra',
      image: 'assets/img/03.webp',
    },
    {
      title: 'Dirección de obra',
      label: 'Conjunto San Luis',
      image: 'assets/img/04.webp',
    },
    {
      title: 'Diseño conceptual',
      label: 'Centro Logistico',
      image: 'assets/img/05.webp',
    },
    {
      title: 'Planificación espacial',
      label: 'Hacienda El Rosal',
      image: 'assets/img/06.webp',
    },
  ];

  prev() {
    const el = this.track()?.nativeElement;
    if (!el) return;
    this.paused = true;
    const step = el.querySelector('article')?.getBoundingClientRect().width ?? 300;
    const gap = 12;
    this.translateX = Math.min(this.translateX + step + gap, 0);
    el.style.setProperty('transform', `translateX(${this.translateX}px)`, 'important');
  }

  next() {
    const el = this.track()?.nativeElement;
    if (!el) return;
    this.paused = true;
    const step = el.querySelector('article')?.getBoundingClientRect().width ?? 300;
    const gap = 12;
    const trackWidth = el.scrollWidth / 2;
    const maxScroll = trackWidth - el.parentElement!.clientWidth;
    this.translateX = Math.max(this.translateX - step - gap, -maxScroll);
    el.style.setProperty('transform', `translateX(${this.translateX}px)`, 'important');
  }

  onEnter() {
    this.paused = true;
  }

  onLeave() {
    this.paused = false;
    const el = this.track()?.nativeElement;
    if (el) {
      el.style.removeProperty('transform');
    }
  }
}
