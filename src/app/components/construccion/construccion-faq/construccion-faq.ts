import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-construccion-faq',
  standalone: true,
  imports: [],
  templateUrl: './construccion-faq.html',
  styleUrl: './construccion-faq.css',
})
export class ConstruccionFaq implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJS();
      this.animate();
      window.addEventListener('resize', this.onWindowResize.bind(this));
    });
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
  }

  protected readonly expandedId = signal<string | null>(null);

  protected readonly faqs = [
    {
      id: '01',
      question: '¿Cuánto tiempo toma construir una obra arquitectónica?',
      answer: 'El tiempo varía según el tamaño y complejidad. Una vivienda puede tomar 6-10 meses, mientras que edificios comerciales pueden requerir 12-24 meses. Entregamos un cronograma detallado al inicio.',
    },
    {
      id: '02',
      question: '¿Cómo garantizan la calidad de la construcción?',
      answer: 'Contamos con supervisores calificados, materiales certificados, pruebas de resistencia de concreto y cumplimiento de normatividad. Cada etapa es inspeccionada y documentada.',
    },
    {
      id: '03',
      question: '¿El presupuesto incluye todos los materiales?',
      answer: 'Sí, el presupuesto incluye materiales, mano de obra, equipo y acabados especificados. Entregamos un desglose detallado antes de iniciar la obra.',
    },
    {
      id: '04',
      question: '¿Qué pasa si necesito cambios durante la obra?',
      answer: 'Cualquier cambio se analiza, se cotiza y se aprueba antes de ejecutarse. Entregamos estimaciones de costo y tiempo adicional con transparencia.',
    },
    {
      id: '05',
      question: '¿Ofrecen garantía de la obra terminada?',
      answer: 'Sí, otorgamos garantía estructural de 5 años y garantía de acabados de 1 año en todas nuestras obras ejecutadas.',
    },
    {
      id: '06',
      question: '¿Cómo Controlan el presupuesto durante la obra?',
      answer: 'Realizamos reuniones semanales de avance, entregas de estimaciones detalladas y control de gastos. El presupuesto se respeta salvo modificaciones solicitadas por el cliente.',
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
    const container = canvas.parentElement!;
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
    const container = this.canvasRef.nativeElement.parentElement!;
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