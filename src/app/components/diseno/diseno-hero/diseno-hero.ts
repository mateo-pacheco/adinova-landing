import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-diseno-hero',
  standalone: true,
  imports: [],
  templateUrl: './diseno-hero.html',
  styleUrl: './diseno-hero.css',
})
export class DisenoHero implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private mainShape!: THREE.Mesh;
  private wireShape!: THREE.Mesh;
  private innerShape!: THREE.Mesh;
  private floatingShapes: THREE.Mesh[] = [];
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
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
      document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementById('diseno');
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

    const isMobile = width < 768;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(isMobile ? 60 : 45, width / height, 0.1, 1000);
    this.camera.position.z = isMobile ? 5 : 7;

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

    const mainLight = new THREE.DirectionalLight(0x36A8A8, 1.5);
    mainLight.position.set(3, 3, 5);
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x36A8A8, 0.5);
    fillLight.position.set(-3, -2, 3);
    this.scene.add(fillLight);

    this.createMainShape(isMobile);
    this.createParticles(isMobile);
    this.createFloatingShapes(isMobile);
  }

  private createMainShape(isMobile: boolean) {
    const size = isMobile ? 1.8 : 2.5;
    
    const geometry = new THREE.IcosahedronGeometry(size, 0);
    
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x36A8A8,
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    this.mainShape = new THREE.Mesh(geometry, material);
    this.mainShape.position.set(2, 0, 0);
    this.scene.add(this.mainShape);

    const wireGeometry = new THREE.IcosahedronGeometry(size * 1.05, 0);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x36A8A8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    this.wireShape = new THREE.Mesh(wireGeometry, wireMaterial);
    this.mainShape.add(this.wireShape);

    const innerGeometry = new THREE.IcosahedronGeometry(size * 0.6, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x36A8A8,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    });
    this.innerShape = new THREE.Mesh(innerGeometry, innerMaterial);
    this.mainShape.add(this.innerShape);
  }

  private createParticles(isMobile: boolean) {
    const particleCount = isMobile ? 100 : 250;
    const spread = isMobile ? 10 : 18;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x36A8A8,
      size: isMobile ? 0.03 : 0.02,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createFloatingShapes(isMobile: boolean) {
    const shapes = [
      new THREE.TetrahedronGeometry(0.15),
      new THREE.OctahedronGeometry(0.12),
      new THREE.TetrahedronGeometry(0.1),
    ];

    for (let i = 0; i < 8; i++) {
      const geometry = shapes[i % shapes.length];
      const material = new THREE.MeshBasicMaterial({
        color: 0x36A8A8,
        transparent: true,
        opacity: 0.2 + Math.random() * 0.2,
        wireframe: true,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * (isMobile ? 6 : 10),
        (Math.random() - 0.5) * (isMobile ? 4 : 6),
        (Math.random() - 0.5) * 4 - 2
      );
      mesh.userData = {
        originalPos: mesh.position.clone(),
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.02,
      };
      
      this.floatingShapes.push(mesh);
      this.scene.add(mesh);
    }
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
    this.targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.008;

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

    const easeProgression = this.easeOutCubic(this.scrollProgress);
    const slowTime = this.time * 0.5;

    this.mainShape.rotation.x = slowTime * 0.4 + this.mouseY * 0.15;
    this.mainShape.rotation.y = slowTime * 0.6 + this.mouseX * 0.15;
    this.wireShape.rotation.x = -slowTime * 0.3;
    this.wireShape.rotation.y = -slowTime * 0.5;
    this.innerShape.rotation.x = slowTime * 0.8;
    this.innerShape.rotation.y = slowTime * 1.2;

    const mainScale = 1 - easeProgression * 0.5;
    this.mainShape.scale.setScalar(mainScale);

    const startX = 2;
    const endX = -1;
    this.mainShape.position.x = startX + (endX - startX) * easeProgression + Math.sin(this.time) * 0.1;
    this.mainShape.position.y = Math.sin(this.time * 0.5) * 0.15;

    const material = this.mainShape.material as THREE.MeshPhysicalMaterial;
    material.opacity = 0.9 - easeProgression * 0.6;

    this.particles.rotation.y = this.time * 0.05 + this.mouseX * 0.1;
    this.particles.rotation.x = this.time * 0.02 + this.mouseY * 0.1;

    this.floatingShapes.forEach((shape, i) => {
      const data = shape.userData as { [key: string]: any };
      shape.rotation.x += data['rotSpeed'];
      shape.rotation.y += data['rotSpeed'] * 0.7;
      
      const floatY = Math.sin(this.time * data['speed'] + data['offset']) * 0.3;
      const floatX = Math.cos(this.time * data['speed'] * 0.7 + data['offset']) * 0.2;
      
      shape.position.x = data['originalPos'].x + floatX;
      shape.position.y = data['originalPos'].y + floatY;
    });

    if (!window.matchMedia('(max-width: 768px)').matches) {
      this.camera.position.x = this.mouseX * 0.5;
      this.camera.position.y = this.mouseY * 0.3;
    }
    this.camera.lookAt(this.mainShape.position);

    this.renderer.render(this.scene, this.camera);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}