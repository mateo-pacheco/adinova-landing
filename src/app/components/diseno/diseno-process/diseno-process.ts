import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-diseno-process',
  standalone: true,
  imports: [],
  templateUrl: './diseno-process.html',
  styleUrl: './diseno-process.css',
})
export class DisenoProcess implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private flowLines: THREE.Line[] = [];
  private particles!: THREE.Points;
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;
  private scrollProgress = 0;
  private targetScrollProgress = 0;

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

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementById('diseno-proceso');
    if (section) {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight;
      const scrolled = windowHeight - rect.top;
      const totalScrollable = windowHeight + sectionHeight;
      this.targetScrollProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
  }

  protected readonly steps = [
    {
      step: '01',
      title: 'Descubrimiento',
      subtitle: 'Entender',
      description: 'Reunion inicial para explorar necesidades, objetivos y restricciones. Analizamos el contexto, el terreno y las condiciones del lugar.',
      deliverables: ['Briefing consolidado', 'Analisis de sitio', 'Programa arquitectonico', 'Estimacion inicial'],
      duration: '1-2 semanas',
      icon: `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`,
    },
    {
      step: '02',
      title: 'Concepto',
      subtitle: 'La idea toma forma',
      description: 'Desarrollo de propuestas conceptuales. Esquemas volumetricos, estudios de luz y primeras visualizaciones que comunican la intencion del proyecto.',
      deliverables: ['Esquemas volumetricos', 'Renderizados conceptuales', 'Analisis solar', 'Cubicaje preliminar'],
      duration: '2-3 semanas',
      icon: `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>`,
    },
    {
      step: '03',
      title: 'Desarrollo',
      subtitle: 'Detalle y coordinacion',
      description: 'Refinamiento del diseno con detalles tecnicos, materiales y sistemas constructivos. Coordinacion con disciplinas adicionales.',
      deliverables: ['Planos de diseno', 'Memoria descriptiva', 'Especificaciones', 'Presupuesto detallado'],
      duration: '3-6 semanas',
      icon: `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    },
    {
      step: '04',
      title: 'Documentacion',
      subtitle: 'El proyecto se escribe',
      description: 'Elaboracion de planos ejecutivos, especificaciones y documentacion formal para construccion y permisos.',
      deliverables: ['Paquete de planos', 'Especific tecnicas', 'Bases de licitacion', 'Cronograma de obra'],
      duration: '2-4 semanas',
      icon: `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
    },
    {
      step: '05',
      title: 'Construccion',
      subtitle: 'Supervision constante',
      description: 'Acompanamiento durante la ejecucion. Visitas de obra, ajustes en campo y control de calidad.',
      deliverables: ['Visitas de supervision', 'Actas de obra', 'Control de cambios', 'Gestion de proveedores'],
      duration: 'Segun cronograma',
      icon: `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0v2m0-2v-2m-10 2H7m-2-16v2m14 2v2m0-2v-2m-10 2H7m-2-16v2m14 2v2m0-2v-2m-10 2H7" /></svg>`,
    },
  ];

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x36A8A8, 1.0);
    mainLight.position.set(3, 3, 5);
    this.scene.add(mainLight);

    this.createFlowLines();
    this.createParticles();
  }

  private createFlowLines() {
    const lineCount = 15;
    
    for (let i = 0; i < lineCount; i++) {
      const points: THREE.Vector3[] = [];
      const segments = 40;
      const startX = (Math.random() - 0.5) * 10;
      const startY = (Math.random() - 0.5) * 8;
      const startZ = (Math.random() - 0.5) * 4 - 1;
      
      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        points.push(new THREE.Vector3(
          startX + t * 4 - 2,
          startY + Math.sin(t * Math.PI * 2) * 0.4,
          startZ
        ));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x36A8A8,
        transparent: true,
        opacity: 0.2,
      });
      
      const line = new THREE.Line(geometry, material);
      line.userData = { 
        offset: Math.random() * Math.PI * 2, 
        speed: 0.2 + Math.random() * 0.3,
        originalPositions: points.map(p => p.clone())
      };
      this.flowLines.push(line);
      this.scene.add(line);
    }
  }

  private createParticles() {
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x36A8A8,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
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
    this.time += 0.01;

    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

    this.flowLines.forEach((line, index) => {
      const positions = line.geometry.attributes['position'].array as Float32Array;
      const originalPositions = line.userData['originalPositions'];
      const offset = line.userData['offset'];
      const speed = line.userData['speed'];
      const segments = positions.length / 3;

      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const orig = originalPositions[i];
        
        positions[i * 3] = orig.x + Math.sin(this.time * speed + t * Math.PI + offset) * 0.15;
        positions[i * 3 + 1] = orig.y + Math.cos(this.time * speed * 0.8 + t * Math.PI + offset) * 0.15;
      }
      line.geometry.attributes['position'].needsUpdate = true;
      
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = 0.1 + Math.sin(this.time + offset) * 0.1;

      const yOffset = Math.sin(this.time * speed + offset) * 0.3;
      line.position.y = yOffset;
    });

    this.particles.rotation.y = this.time * 0.03;
    this.particles.rotation.x = this.time * 0.02;

    const easeProgress = this.easeOutCubic(this.scrollProgress);
    this.scene.position.y = easeProgress * -1;

    this.renderer.render(this.scene, this.camera);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}