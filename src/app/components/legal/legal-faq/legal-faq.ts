import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-legal-faq',
  standalone: true,
  imports: [],
  templateUrl: './legal-faq.html',
  styleUrl: './legal-faq.css',
})
export class LegalFaq implements AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;
  private boundResize = this.onWindowResize.bind(this);

  protected readonly expandedId = signal<string | null>(null);

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    
    this.ngZone.runOutsideAngular(() => {
      try {
        this.initThreeJS();
        this.animate();
        window.addEventListener('resize', this.boundResize);
      } catch (e) {
        console.warn('3D initialization skipped:', e);
      }
    });
  }

  ngOnDestroy() {
    if (!this.isBrowser) return;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.boundResize);
    this.renderer?.dispose();
  }

  protected readonly faqs = [
    {
      id: '01',
      question: '¿Cuáles son los servicios que ofrecemos?',
      answer: 'Ofrecemos asesoría legal arquitectónica, gestión de permisos de construcción, regularización de excedentes, declaratorias de propiedad horizontal, y trámites de escrituración y derechos sucesorios.',
    },
    {
      id: '02',
      question: '¿Dónde estamos ubicados?',
      answer: 'Nuestra oficina principal se encuentra en Luis Cordero 9-55 y Simón Bolívar, Ofic. #16, en la ciudad de Cuenca. También brindamos atención virtual para proyectos en todo el país.',
    },
    {
      id: '03',
      question: 'Horarios de atención',
      answer: 'Atendemos de lunes a viernes de 09:00 a 18:00. Los sábados atendemos de 10:00 a 14:00 mediante cita previa.',
    },
    {
      id: '04',
      question: 'Costo de los trámites',
      answer: 'El costo depende de la complejidad del proceso legal o técnico y de las tasas municipales vigentes. Proporcionamos un presupuesto detallado tras la primera consulta.',
    },
    {
      id: '05',
      question: '¿Cómo puedo arreglar mis Escrituras y Derechos?',
      answer: 'Realizamos procesos de derecho patrimonial, posesiones efectivas y trámites legales para la regularización de propiedades y derechos sucesorios. Agenda una asesoría para analizar tu caso.',
    },
  ];

  protected toggleFaq(id: string): void {
    const current = this.expandedId();
    if (current === id) {
      this.expandedId.set(null);
    } else {
      this.expandedId.set(id);
    }
  }

  protected isExpanded(id: string): boolean {
    return this.expandedId() === id;
  }

  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const isMobile = width < 768;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(isMobile ? 60 : 50, width / height, 0.1, 1000);
    this.camera.position.z = isMobile ? 5 : 6;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x36A8A8, 1.0);
    mainLight.position.set(3, 3, 5);
    this.scene.add(mainLight);

    this.createParticles(isMobile);
  }

  private createParticles(isMobile: boolean) {
    const particleCount = isMobile ? 50 : 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x36A8A8,
      size: isMobile ? 0.04 : 0.025,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private onWindowResize() {
    const container = this.canvasRef.nativeElement.parentElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.008;

    this.particles.rotation.y = this.time * 0.05;
    this.particles.rotation.x = this.time * 0.02;

    this.renderer.render(this.scene, this.camera);
  }
}
