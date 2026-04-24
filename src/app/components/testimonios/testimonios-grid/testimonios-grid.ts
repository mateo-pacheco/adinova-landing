import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone, HostListener } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

interface Testimonio {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  projectType: string;
  rating: number;
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
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
  }

  protected readonly testimonios: Testimonio[] = [
    {
      id: '01',
      name: 'Ing. Roberto Martinez',
      role: 'Director General',
      company: 'Grupo Constructor MX',
      text: 'El equipo de Adinova supero nuestras expectativas. La obra se entrego en tiempo y forma, con una calidad excepcional. Su profesionalismo y compromiso son invaluables.',
      projectType: 'Proyecto comercial',
      rating: 5
    },
    {
      id: '02',
      name: 'Lic. Ana Garcia',
      role: 'CEO',
      company: 'Moda Urbana SA',
      text: 'Transformaron completamente nuestro espacio comercial. El diseno y la ejecución fueron impecables. Nuestro equipo quedo encantado con el resultado.',
      projectType: 'Proyecto retail',
      rating: 5
    },
    {
      id: '03',
      name: 'Arq. Carlos Hernandez',
      role: 'Director de Proyectos',
      company: 'Desarrollos Vistta',
      text: 'Como arquitecto, soy muy exigentes. Adinova cumplio con todos los estandares de calidad que buscabamos. La comunicacion durante todo el proceso fue excelente.',
      projectType: 'Proyecto residencial',
      rating: 5
    },
    {
      id: '04',
      name: 'Sra. Maria Lopez',
      role: 'Propietaria',
      company: 'Casa Habitacion',
      text: 'Construyeron nuestra casa de ensuenno. Cada detalle estuvo parfaito. El equipo fue muy patient y atendio todas nuestras peticiones.',
      projectType: 'Vivienda unifamiliar',
      rating: 5
    },
    {
      id: '05',
      name: 'Ing. Fernando Ruiz',
      role: 'Gerente de Planta',
      company: 'Industrias QM',
      text: 'La construccion de nuestra planta industrial fue menangani con gran profesionalismo. Cumplieron con los plazos ajustados que teniamos. Totalmente recomendados.',
      projectType: 'Proyecto industrial',
      rating: 5
    },
    {
      id: '06',
      name: 'Dr. Juan Perez',
      role: 'Director Medico',
      company: 'Clinica San Jose',
      text: 'Nuestra clinica quedo parfait. El equipo entiende las necesidades especificas del sector salud. Cumplieron con todas las normatividades requeridas.',
      projectType: 'Proyecto de salud',
      rating: 5
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