import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
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
export class LegalFaq implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;

  protected readonly expandedId = signal<string | null>(null);

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

  protected readonly faqs = [
    {
      id: '01',
      question: '¿Cuánto tiempo toma obtener una licencia de construcción?',
      answer: 'El tiempo varía según el municipio y tipo de proyecto. Typicamentee entre 4 a 12 semanas para proyectos residenciales, y hasta 6 meses para proyectos comerciales de gran escala. Nosotros gestionamos todo el proceso para que sea lo más ágil posible.',
    },
    {
      id: '02',
      question: '¿Qué documentos necesito para iniciar un proyecto?',
      answer: 'Los documentos básicos incluyen: propiedad del terreno, identificación del propietario, planos arquitectónicos, memoria descriptiva, y en algunos casos estudios de impacto ambiental o tráfico. Te orientamos específicamente para tu proyecto.',
    },
    {
      id: '03',
      question: '¿Pueden modificar el uso de suelo de mi propiedad?',
      answer: 'Sí, es posible mediante un trámite de cambio de uso de suelo ante el municipio. El proceso depende de la zonificación actual y los reglamentos locales. Realizamos el análisis para viabilidad antes de iniciar.',
    },
    {
      id: '04',
      question: '¿Qué sucede si construyo sin permiso?',
      answer: 'Construir sin licencia puede resultar en multas, suspensión de obra, demolición, o problemas legales al momento de escriturar. Siempre recomendamos obtener los permisos antes de iniciar construcción.',
    },
    {
      id: '05',
      question: '¿Ofrecen supervisión durante toda la obra?',
      answer: 'Sí, unsericio de supervisión legal incluye visitas periódicas, verificación de cumplimiento de especificaciones, revisión de actas de avance y asesoría continua durante todo el proceso constructivo.',
    },
    {
      id: '06',
      question: '¿Cómo saber si mi proyecto cumple la normatividad?',
      answer: 'Realizamos un análisis completo de zonificación, usos de suelo, restricciones municipales y normas técnicas aplicables a tu proyecto antes de iniciar cualquier trámite.',
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