import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

interface Testimonio {
  id: string;
  name: string;
  text: string;
}

@Component({
  selector: 'app-testimonios-grid',
  standalone: true,
  imports: [],
  templateUrl: './testimonios-grid.html',
  styleUrl: './testimonios-grid.css',
})
export class TestimoniosGrid implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private floatingShapes: THREE.Mesh[] = [];
  private particles!: THREE.Points;
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;
  private boundResize = this.onWindowResize.bind(this);
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
      try {
        this.initThreeJS();
        this.animate();
        window.addEventListener('resize', this.boundResize);
      } catch (e) {
        console.warn('3D initialization skipped:', e);
      }
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementById('testimonios-ver');
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
    if (!this.isBrowser) return;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.boundResize);
    this.renderer?.dispose();
  }

  protected getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  protected readonly testimonios: Testimonio[] = [
    {
      id: '01',
      name: 'Clara Iñiguez',
      text: 'La experiencia que tengo es con Adinova de un trabajo muy profesional y ético dando un seguimiento hasta concluir con los trámites a ellos encomendados. Recomiendo a éstos jóvenes profesionales como personas y profesionales.',
    },
    {
      id: '02',
      name: 'Marcos Aucay',
      text: 'Un grupo de jóvenes profesionales, me brindaron un buen asesoramiento en mis trámites, totalmente recomendado.',
    },
    {
      id: '03',
      name: 'Nancy Sánchez',
      text: 'Muy agradecida a Adinova diseño y construcción un grupo de jóvenes profesionales que me ayudaron en la construcción de mi casita muchísimas gracias y muchos éxitos en su vida profesional.',
    },
    {
      id: '04',
      name: 'María Ortiz',
      text: 'El equipo del estudio arquitectónico Adinova es un grupo de profesionales que nos han ayudado desde el principio a fin quiero agradecerles por su trabajo y esmero gracias y tienen un cliente satisfecho.',
    },
    {
      id: '05',
      name: 'Luis Alberto Padilla',
      text: 'El mejor estudio de arquitectos realmente son unos profesionales.',
    },
  ];

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

    const mainLight = new THREE.DirectionalLight(0x36A8A8, 1.2);
    mainLight.position.set(3, 3, 5);
    this.scene.add(mainLight);

    this.createFloatingShapes(isMobile);
    this.createParticles(isMobile);
  }

  private createFloatingShapes(isMobile: boolean) {
    const geometries = [
      new THREE.TetrahedronGeometry(0.2),
      new THREE.OctahedronGeometry(0.15),
      new THREE.IcosahedronGeometry(0.12),
      new THREE.TorusGeometry(0.12, 0.04, 8, 16),
    ];

    for (let i = 0; i < 12; i++) {
      const geometry = geometries[i % geometries.length];
      const material = new THREE.MeshBasicMaterial({
        color: 0x36A8A8,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.15,
        wireframe: true,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * (isMobile ? 8 : 14),
        (Math.random() - 0.5) * (isMobile ? 6 : 10),
        (Math.random() - 0.5) * 4 - 2
      );
      mesh.userData = {
        originalPos: mesh.position.clone(),
        speed: 0.2 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.015 + 0.005,
        floatRange: 0.2 + Math.random() * 0.3,
      };
      
      this.floatingShapes.push(mesh);
      this.scene.add(mesh);
    }
  }

  private createParticles(isMobile: boolean) {
    const particleCount = isMobile ? 50 : 120;
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

    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

    this.floatingShapes.forEach((shape, i) => {
      const d = shape.userData as any;
      shape.rotation.x += d['rotSpeed'];
      shape.rotation.y += d['rotSpeed'] * 1.3;
      shape.rotation.z += d['rotSpeed'] * 0.7;
      
      const floatY = Math.sin(this.time * d['speed'] + d['offset']) * d['floatRange'];
      const floatX = Math.cos(this.time * d['speed'] * 0.6 + d['offset']) * d['floatRange'] * 0.5;
      const floatZ = Math.sin(this.time * d['speed'] * 0.8 + d['offset'] * 2) * d['floatRange'] * 0.3;
      
      shape.position.x = d['originalPos'].x + floatX;
      shape.position.y = d['originalPos'].y + floatY;
      shape.position.z = d['originalPos'].z + floatZ;
    });

    this.particles.rotation.y = this.time * 0.04;
    this.particles.rotation.x = this.time * 0.02;

    const easeProgress = this.easeOutCubic(this.scrollProgress);
    this.scene.position.y = easeProgress * -1.5;

    this.renderer.render(this.scene, this.camera);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}
