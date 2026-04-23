import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private morphMesh!: THREE.Mesh;
  private morphTargetInfluences: number[] = [0, 0];
  private particles!: THREE.Points;
  private animationId!: number;
  private scrollProgress = 0;
  private targetScrollProgress = 0;
  private mouseX = 0;
  private mouseY = 0;
  private time = 0;
  private isBrowser: boolean;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  protected readonly values = [
    {
      title: 'Claridad espacial',
      description:
        'Cada decision responde a una logica funcional, visual y constructiva. Espacios que funcionan sin多余的.',
    },
    {
      title: 'Materialidad sobria',
      description:
        'Trabajamos con texturas honestas, luz natural y proporciones que envejecen con dignidad.',
    },
    {
      title: 'Precision tecnica',
      description:
        'El diseno y la ejecucion se articulan con criterio. Control continuo de cada detalle constructivo.',
    },
  ];

  protected readonly team = [
    {
      name: 'Andrea Molina',
      role: 'Arquitecta principal',
    },
    {
      name: 'Daniel Vela',
      role: 'Director de proyecto',
    },
    {
      name: 'Sofia Cardenas',
      role: 'Especialista en interiores',
    },
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJS();
      this.animate();
      window.addEventListener('resize', this.onWindowResize.bind(this));
      document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementById('estudio');
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
    document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    this.renderer.dispose();
  }

  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x36A8A8, 1.2);
    mainLight.position.set(3, 3, 5);
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x36A8A8, 0.5);
    fillLight.position.set(-3, -2, 2);
    this.scene.add(fillLight);

    this.createMorphMesh();
    this.createParticles();
  }

  private createMorphMesh() {
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    
    const sphereGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const spherePositions = sphereGeom.attributes['position'].array;
    geometry.morphAttributes.position = [];
    
    const morphPositions = new Float32Array(spherePositions.length);
    for (let i = 0; i < spherePositions.length; i++) {
      morphPositions[i] = spherePositions[i];
    }
    geometry.morphAttributes.position[0] = new THREE.BufferAttribute(morphPositions, 3);

    const octaGeom = new THREE.OctahedronGeometry(1.5, 0);
    const octaPositions = octaGeom.attributes['position'].array;
    geometry.morphAttributes.position[1] = new THREE.BufferAttribute(new Float32Array(octaPositions), 3);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x36A8A8,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    this.morphMesh = new THREE.Mesh(geometry, material);
    this.morphMesh.position.set(-1.5, 0, 0);
    this.morphMesh.morphTargetInfluences = [0, 0];
    this.scene.add(this.morphMesh);

    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x36A8A8,
      transparent: true,
      opacity: 0.4,
    });
    const wireframe = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    this.morphMesh.add(wireframe);
  }

  private createParticles() {
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x36A8A8,
      size: 0.05,
      transparent: true,
      opacity: 0.35,
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

  private onDocumentMouseMove(event: MouseEvent) {
    this.mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
    this.mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.008;

    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

    const easeProgress = this.easeOutCubic(this.scrollProgress);
    const scrollRotation = easeProgress * Math.PI * 2;

    this.morphMesh.rotation.x = this.time * 0.3 + scrollRotation;
    this.morphMesh.rotation.y = this.time * 0.5 + scrollRotation * 0.7;
    this.morphMesh.rotation.z = Math.sin(this.time * 0.2) * 0.2;

    this.morphMesh.position.x = -1.5 + Math.sin(this.time * 0.5) * 0.1 + this.mouseX;
    this.morphMesh.position.y = Math.cos(this.time * 0.4) * 0.15 + this.mouseY;

    const morphSpeed = 0.5;
    if (this.morphMesh) {
      this.morphMesh.morphTargetInfluences![0] = (Math.sin(this.time * morphSpeed) + 1) * 0.5;
      this.morphMesh.morphTargetInfluences![1] = (Math.cos(this.time * morphSpeed * 0.7) + 1) * 0.5;
    }

    const scale = 1 - easeProgress * 0.4;
    this.morphMesh.scale.setScalar(scale);

    const material = this.morphMesh.material as THREE.MeshPhysicalMaterial;
    material.opacity = 0.85 - easeProgress * 0.5;

    this.particles.rotation.y = this.time * 0.08;
    this.particles.rotation.x = this.time * 0.03;

    this.renderer.render(this.scene, this.camera);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}
