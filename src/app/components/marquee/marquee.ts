import { Component, ElementRef, OnDestroy, viewChild } from '@angular/core';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [],
  templateUrl: './marquee.html',
  styleUrl: './marquee.css',
})
export class Marquee implements OnDestroy {
  readonly track = viewChild<ElementRef<HTMLDivElement>>('track');

  protected paused = false;
  protected translateX = 0;
  private autoResumeTimer: ReturnType<typeof setTimeout> | null = null;

  private touchStartX = 0;
  private touchEndX = 0;
  private isDragging = false;

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
    el.style.animation = 'none';
    this.clearAutoResume();
    const step = el.querySelector('article')?.getBoundingClientRect().width ?? 300;
    const gap = 12;
    this.translateX = Math.min(this.translateX + step + gap, 0);
    el.style.transform = `translateX(${this.translateX}px)`;
    this.scheduleAutoResume(el);
  }

  next() {
    const el = this.track()?.nativeElement;
    if (!el) return;
    this.paused = true;
    el.style.animation = 'none';
    this.clearAutoResume();
    const step = el.querySelector('article')?.getBoundingClientRect().width ?? 300;
    const gap = 12;
    const trackWidth = el.scrollWidth / 2;
    const maxScroll = trackWidth - el.parentElement!.clientWidth;
    this.translateX = Math.max(this.translateX - step - gap, -maxScroll);
    el.style.transform = `translateX(${this.translateX}px)`;
    this.scheduleAutoResume(el);
  }

  private scheduleAutoResume(el: HTMLElement) {
    this.clearAutoResume();
    this.autoResumeTimer = setTimeout(() => {
      this.paused = false;
      el.style.removeProperty('transform');
      el.style.removeProperty('animation');
      this.autoResumeTimer = null;
    }, 4000);
  }

  private clearAutoResume() {
    if (this.autoResumeTimer !== null) {
      clearTimeout(this.autoResumeTimer);
      this.autoResumeTimer = null;
    }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.isDragging = true;
    this.paused = true;
    const el = this.track()?.nativeElement;
    if (el) {
      el.style.animation = 'none';
    }
    this.clearAutoResume();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.next();
      else this.prev();
    } else {
      this.onLeave();
    }
  }

  onEnter() {
    this.paused = true;
    this.clearAutoResume();
    const el = this.track()?.nativeElement;
    if (el) {
      el.style.animation = 'none';
    }
  }

  onLeave() {
    this.paused = false;
    this.clearAutoResume();
    const el = this.track()?.nativeElement;
    if (el) {
      el.style.removeProperty('transform');
      el.style.removeProperty('animation');
    }
  }

  ngOnDestroy() {
    this.clearAutoResume();
  }
}
