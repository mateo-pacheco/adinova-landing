import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  image: string;
  area: string;
  duration: string;
  year: string;
}

@Component({
  selector: 'app-construccion-cases',
  standalone: true,
  imports: [],
  templateUrl: './construccion-cases.html',
  styleUrl: './construccion-cases.css',
})
export class ConstruccionCases implements OnInit, AfterViewInit, OnDestroy {
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
    const section = document.getElementById('construccion-proyectos');
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

  protected readonly projects: Project[] = [
    {
      id: '01',
      title: 'Edificio Torre Victoria',
      subtitle: 'Torre de 25 niveles',
      category: 'Comercial',
      location: 'Ciudad de Mexico',
      image: 'assets/mock/01-hero-facade.svg',
      area: '12,500 m2',
      duration: '18 meses',
      year: '2024'
    },
    {
      id: '02',
      title: 'Residencial San Pedro',
      subtitle: 'Conjunto de 50 casas',
      category: 'Vivienda',
      location: 'Guadalajara',
      image: 'assets/mock/04-facade-detail.svg',
      area: '8,200 m2',
      duration: '14 meses',
      year: '2023'
    },
    {
      id: '03',
      title: 'Planta Maquinados MX',
      subtitle: 'Nave industrial',
      category: 'Industrial',
      location: 'Queretaro',
      image: 'assets/mock/05-site-plan.svg',
      area: '15,000 m2',
      duration: '8 meses',
      year: '2023'
    },
    {
      id: '04',
      title: 'Centro Comercial Oaks',
      subtitle: 'Plaza comercial',
      category: 'Comercial',
      location: 'Monterrey',
      image: 'assets/mock/03-floor-plan.svg',
      area: '22,000 m2',
      duration: '12 meses',
      year: '2022'
    },
    {
      id: '05',
      title: 'Villa Hacienda',
      subtitle: 'Casa de campo',
      category: 'Vivienda',
      location: 'Puebla',
      image: 'assets/mock/06-section-cut.svg',
      area: '850 m2',
      duration: '10 meses',
      year: '2022'
    },
    {
      id: '06',
      title: 'Clinica San Jose',
      subtitle: 'Hospital privado',
      category: 'Salud',
      location: 'Tijuana',
      image: 'assets/mock/02-interior-living.svg',
      area: '6,800 m2',
      duration: '16 meses',
      year: '2021'
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