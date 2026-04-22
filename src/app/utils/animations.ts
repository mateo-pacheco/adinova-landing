import { Injectable, inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class AnimationsService implements OnDestroy {
  private ngZone = inject(NgZone);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private cleanup: Array<() => void> = [];

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
  }

  init(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      this.initPageAnimations();
      this.initHeroAnimations();
      this.initScrollReveal();
      this.initStaggerReveal();
      this.initMagneticInteractions();
      this.initTiltInteractions();
      this.initParallax();
      ScrollTrigger.refresh();
    });
  }

  private initPageAnimations(): void {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: 'power3.out',
        },
      );
    });
  }

  private initHeroAnimations(): void {
    const hero = document.querySelector('.hero-container');
    if (!hero) return;

    const children = hero.querySelectorAll('[data-animate]');
    if (!children.length) return;

    gsap.fromTo(
      hero,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' },
    );

    gsap.fromTo(
      children,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      },
    );
  }

  private initScrollReveal(): void {
    document.querySelectorAll('[data-scroll-reveal]').forEach((el) => {
      const direction = el.getAttribute('data-reveal') || 'up';
      const fromConfig = this.getRevealFrom(direction);

      gsap.fromTo(
        el,
        fromConfig,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      );
    });
  }

  private getRevealFrom(direction: string): { opacity: number; y: number; x?: number; scale?: number } {
    switch (direction) {
      case 'down':
        return { opacity: 0, y: -40 };
      case 'left':
        return { opacity: 0, x: -40, y: 0 };
      case 'right':
        return { opacity: 0, x: 40, y: 0 };
      case 'scale':
        return { opacity: 0, scale: 0.9, y: 0 };
      default:
        return { opacity: 0, y: 40 };
    }
  }

  private initStaggerReveal(): void {
    document.querySelectorAll('[data-stagger-reveal]').forEach((parent) => {
      const children = Array.from(parent.children);
      if (!children.length) return;

      const staggerAttr = (parent as HTMLElement).getAttribute('data-stagger');
      const stagger = staggerAttr ? parseFloat(staggerAttr) : 0.08;

      gsap.fromTo(
        children,
        { opacity: 0, y: 28, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: parent,
            start: 'top 82%',
            once: true,
          },
        },
      );
    });
  }

  private initParallax(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const speedAttr = el.getAttribute('data-parallax');
      const speed = speedAttr ? parseFloat(speedAttr) : 0.5;

      gsap.to(el, {
        y: () => -(window.innerHeight * speed * 0.1),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  private initMagneticInteractions(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const strengthAttr = el.getAttribute('data-magnetic');
      const strength = strengthAttr ? parseFloat(strengthAttr) : 6;

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;

        gsap.to(el, {
          x,
          y,
          duration: 0.3,
          ease: 'power3.out',
        });
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      this.cleanup.push(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      });
    });
  }

  private initTiltInteractions(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
      const tiltAttr = el.getAttribute('data-tilt');
      const maxTilt = tiltAttr ? parseFloat(tiltAttr) : 4;

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * maxTilt;
        const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * maxTilt;

        gsap.to(el, {
          rotateX,
          rotateY,
          duration: 0.3,
          ease: 'power3.out',
          transformPerspective: 900,
          transformOrigin: 'center center',
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.4,
          ease: 'power3.out',
        });
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      this.cleanup.push(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      });
    });
  }

  fadeIn(
    selector: string,
    options?: { y?: number; duration?: number; delay?: number },
  ): gsap.core.Tween | null {
    if (!this.isBrowser) return null;
    const el = document.querySelector(selector);
    if (!el) return null;
    return gsap.fromTo(
      el,
      { opacity: 0, y: options?.y ?? 24 },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 0.7,
        delay: options?.delay ?? 0,
        ease: 'power3.out',
      },
    );
  }

  scaleIn(
    selector: string,
    options?: { scale?: number; duration?: number; delay?: number },
  ): gsap.core.Tween | null {
    if (!this.isBrowser) return null;
    const el = document.querySelector(selector);
    if (!el) return null;
    return gsap.fromTo(
      el,
      { opacity: 0, scale: options?.scale ?? 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: options?.duration ?? 0.7,
        delay: options?.delay ?? 0,
        ease: 'power3.out',
      },
    );
  }

  refresh(): void {
    ScrollTrigger.refresh();
  }
}