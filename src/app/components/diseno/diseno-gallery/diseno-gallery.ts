import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

interface ProjectMetrics {
  [key: string]: string;
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  image: string;
  year: string;
  client: string;
  challenge: string;
  result: string;
  metrics: ProjectMetrics;
}

@Component({
  selector: 'app-diseno-gallery',
  standalone: true,
  imports: [],
  templateUrl: './diseno-gallery.html',
  styleUrl: './diseno-gallery.css',
})
export class DisenoGallery implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private floatingShapes: THREE.Mesh[] = [];
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
    const section = document.getElementById('diseno-proyectos');
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

  protected objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  protected readonly projects: Project[] = [
    {
      id: '01',
      title: 'Casa Torre',
      subtitle: 'Vivienda unifamiliar de 450m2',
      category: 'Residencial',
      location: 'Ciudad de Mexico',
      image: 'assets/mock/01-hero-facade.svg',
      year: '2024',
      client: 'Familia Martinez',
      challenge: 'Maximizar views y privacidad en lote medianero',
      result: 'Espacio fluido con patio interno y terrazas',
      metrics: {
        area: '450m2',
        tiempo: '8 meses',
        presupuesto: '$4.2M'
      }
    },
    {
      id: '02',
      title: 'Oficinas Spectrum',
      subtitle: 'Espacio corporativo de 1,200m2',
      category: 'Comercial',
      location: 'Monterrey',
      image: 'assets/mock/04-facade-detail.svg',
      year: '2024',
      client: 'Tech Solutions MX',
      challenge: 'Crear identidad de marca en espacio corporativo',
      result: 'Ambiente colaborativo con zonas definidas',
      metrics: {
        area: '1,200m2',
        tiempo: '6 meses',
        eficiencia: '+35%'
      }
    },
    {
      id: '03',
      title: 'Loft Centro',
      subtitle: 'Renovacion de departamento 120m2',
      category: 'Interiorismo',
      location: 'Ciudad de Mexico',
      image: 'assets/mock/02-interior-living.svg',
      year: '2023',
      client: 'Ing. Ramirez',
      challenge: 'Renovar espacio envejecimiento con presupuesto limitado',
      result: 'Ambiente moderno sin obra major',
      metrics: {
        area: '120m2',
        tiempo: '3 meses',
        ahorro: '40%'
      }
    },
    {
      id: '04',
      title: 'Villa Gardens',
      subtitle: 'Casa de campo 650m2',
      category: 'Residencial',
      location: 'Guadalajara',
      image: 'assets/mock/03-floor-plan.svg',
      year: '2023',
      client: 'Familia Gomez',
      challenge: 'Integrar naturaleza con espacios de estar',
      result: 'Arquitectura biophilic con jardin interior',
      metrics: {
        area: '650m2',
        tiempo: '10 meses',
        verde: '200m2'
      }
    },
    {
      id: '05',
      title: 'Showroom Moda',
      subtitle: 'Tienda retail 280m2',
      category: 'Comercial',
      location: 'Ciudad de Mexico',
      image: 'assets/mock/05-site-plan.svg',
      year: '2023',
      client: 'Moda Urbana',
      challenge: 'Crear experiencia de compra memorable',
      result: 'Flujo natural con zona de prueba amplia',
      metrics: {
        area: '280m2',
        tiempo: '4 meses',
        ventas: '+50%'
      }
    },
    {
      id: '06',
      title: 'Penthouse Vista',
      subtitle: 'Departamento penthouse 320m2',
      category: 'Residencial',
      location: 'Ciudad de Mexico',
      image: 'assets/mock/06-section-cut.svg',
      year: '2022',
      client: 'Lic. Hernandez',
      challenge: 'Renovar completamente vista a la ciudad',
      result: 'Ventanales floor-to-ceiling y terraza integrada',
      metrics: {
        area: '320m2',
        tiempo: '5 meses',
        views: '180'
      }
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

    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

    this.floatingShapes.forEach((shape, i) => {
      const data = shape.userData as { [key: string]: any };
      shape.rotation.x += data['rotSpeed'];
      shape.rotation.y += data['rotSpeed'] * 1.3;
      shape.rotation.z += data['rotSpeed'] * 0.7;
      
      const floatY = Math.sin(this.time * data['speed'] + data['offset']) * data['floatRange'];
      const floatX = Math.cos(this.time * data['speed'] * 0.6 + data['offset']) * data['floatRange'] * 0.5;
      const floatZ = Math.sin(this.time * data['speed'] * 0.8 + data['offset'] * 2) * data['floatRange'] * 0.3;
      
      shape.position.x = data['originalPos'].x + floatX;
      shape.position.y = data['originalPos'].y + floatY;
      shape.position.z = data['originalPos'].z + floatZ;
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