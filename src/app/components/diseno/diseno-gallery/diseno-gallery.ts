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
    if (!this.isBrowser) return;
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
      title: 'Casa Alto Valle',
      subtitle: 'Vivienda unifamiliar de 380m2',
      category: 'Residencial',
      location: 'Cumbaya, Quito',
      image: 'assets/mock/01-hero-facade.svg',
      year: '2024',
      client: 'Familia Herrera',
      challenge: 'Aprovechar vista al valle en pendiente pronunciada',
      result: 'Tres volumenes escalonados con terraza panoramica',
      metrics: {
        area: '380m2',
        tiempo: '10 meses',
        presupuesto: '$320K'
      }
    },
    {
      id: '02',
      title: 'Oficinas UIO Corporate',
      subtitle: 'Espacio corporativo de 850m2',
      category: 'Comercial',
      location: 'La Carolina, Quito',
      image: 'assets/mock/04-facade-detail.svg',
      year: '2024',
      client: 'Grupo Fides',
      challenge: 'Unificar dos plantas con identidad de marca',
      result: 'Oficina abierta con nucleo de colaboracion central',
      metrics: {
        area: '850m2',
        tiempo: '5 meses',
        capacidad: '80 personas'
      }
    },
    {
      id: '03',
      title: 'Restaurante Tierra',
      subtitle: 'Remodelacion gastronomica 240m2',
      category: 'Interiorismo',
      location: 'Tumbaco, Quito',
      image: 'assets/mock/02-interior-living.svg',
      year: '2024',
      client: 'Chef Martinez',
      challenge: 'Integrar cocina abierta y comedor en espacio reducido',
      result: 'Ambiente rustico-contemporaneo con capacidad para 80 comensales',
      metrics: {
        area: '240m2',
        tiempo: '4 meses',
        comensales: '80'
      }
    },
    {
      id: '04',
      title: 'Residencia El Bosque',
      subtitle: 'Casa unifamiliar de 520m2',
      category: 'Residencial',
      location: 'Carcelen, Quito',
      image: 'assets/mock/03-floor-plan.svg',
      year: '2023',
      client: 'Familia Torres',
      challenge: 'Maximizar iluminacion natural en lote entre medianeras',
      result: 'Doble altura con lucernario y jardin interior',
      metrics: {
        area: '520m2',
        tiempo: '12 meses',
        iluminacion: '80% natural'
      }
    },
    {
      id: '05',
      title: 'Clinica Dental Sonrisa',
      subtitle: 'Consultorio odontologico 180m2',
      category: 'Comercial',
      location: 'Quito',
      image: 'assets/mock/05-site-plan.svg',
      year: '2023',
      client: 'Dra. Patricia Jimenez',
      challenge: 'Distribuir 5 consultorios en espacio lineal',
      result: 'Flujo eficiente con sala de espera y area de esterilizacion',
      metrics: {
        area: '180m2',
        tiempo: '3 meses',
        consultorios: '5'
      }
    },
    {
      id: '06',
      title: 'Casa de Campo Volcan',
      subtitle: 'Vivienda vacacional de 280m2',
      category: 'Residencial',
      location: 'Banos, Tungurahua',
      image: 'assets/mock/06-section-cut.svg',
      year: '2023',
      client: 'Familia Vasconez',
      challenge: 'Construir en terreno volcanico con vista al volcan',
      result: 'Casa minimalista con muros de piedra local y gran ventanal',
      metrics: {
        area: '280m2',
        tiempo: '8 meses',
        altitud: '2,200 msnm'
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