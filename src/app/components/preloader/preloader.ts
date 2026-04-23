import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preloader" [class.fade-out]="isFadingOut">
      <canvas #canvas3d class="preloader-canvas"></canvas>
      
      <div class="preloader-vignette"></div>
      <div class="preloader-noise"></div>
      
      <div class="preloader-content">
        <div class="preloader-logo-container">
          <span class="preloader-letter" *ngFor="let letter of letters; let i = index" 
                [style.animation-delay]="(i * 0.08) + 's'">
            {{ letter }}
          </span>
        </div>
        
        <div class="preloader-tagline">Architecture Studio</div>
        
        <div class="preloader-loader">
          <div class="preloader-track">
            <div class="preloader-progress" [style.width.%]="progress"></div>
            <div class="preloader-glow" [style.left.%]="progress"></div>
          </div>
          <div class="preloader-percent">{{ progress | number:'1.0-0' }}%</div>
        </div>
        
        <div class="preloader-status">{{ statusText }}</div>
      </div>
      
      <div class="preloader-corner preloader-corner-tl"></div>
      <div class="preloader-corner preloader-corner-tr"></div>
      <div class="preloader-corner preloader-corner-bl"></div>
      <div class="preloader-corner preloader-corner-br"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 99999;
    }

    .preloader {
      position: absolute;
      inset: 0;
      background: #030303;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .preloader-canvas {
      position: absolute;
      inset: 0;
      width: 100% !important;
      height: 100% !important;
    }
    
    .preloader-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 0%, rgba(3, 3, 3, 0.4) 70%, rgba(3, 3, 3, 0.9) 100%);
      pointer-events: none;
    }
    
    .preloader-noise {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      opacity: 0.04;
      mix-blend-mode: overlay;
      pointer-events: none;
    }
    
    .preloader-content {
      position: relative;
      z-index: 10;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .preloader-logo-container {
      display: flex;
      gap: 0.1em;
      margin-bottom: 0.75rem;
    }
    
    .preloader-letter {
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: 200;
      letter-spacing: 0.35em;
      color: #fff;
      opacity: 0;
      transform: translateY(30px);
      animation: letterReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    @keyframes letterReveal {
      0% { opacity: 0; transform: translateY(30px) scale(0.9); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .preloader-tagline {
      font-size: 0.65rem;
      font-weight: 400;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: rgba(54, 168, 168, 0.8);
      margin-bottom: 3rem;
      opacity: 0;
      animation: fadeIn 1s ease 0.8s forwards;
    }
    
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    
    .preloader-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .preloader-track {
      position: relative;
      width: clamp(180px, 40vw, 280px);
      height: 1px;
      background: rgba(54, 168, 168, 0.15);
      border-radius: 1px;
      overflow: visible;
    }
    
    .preloader-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: linear-gradient(90deg, rgba(54, 168, 168, 0.5), #36A8A8);
      border-radius: 1px;
      transition: width 0.15s ease-out;
      box-shadow: 0 0 15px rgba(54, 168, 168, 0.5);
    }
    
    .preloader-glow {
      position: absolute;
      top: 50%;
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, rgba(54, 168, 168, 0.4) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: glowPulse 1.5s ease-in-out infinite;
    }
    
    @keyframes glowPulse {
      0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    }
    
    .preloader-percent {
      font-size: 0.6rem;
      font-weight: 400;
      letter-spacing: 0.3em;
      color: rgba(255, 255, 255, 0.4);
      font-variant-numeric: tabular-nums;
    }
    
    .preloader-status {
      margin-top: 1.5rem;
      font-size: 0.55rem;
      font-weight: 300;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.25);
      opacity: 0;
      animation: fadeIn 0.5s ease 1s forwards;
    }
    
    .preloader-corner {
      position: absolute;
      width: 30px;
      height: 30px;
      border-color: rgba(54, 168, 168, 0.3);
      border-style: solid;
      border-width: 0;
      opacity: 0;
      animation: cornerReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
    }
    
    .preloader-corner-tl {
      top: 40px;
      left: 40px;
      border-top-width: 1px;
      border-left-width: 1px;
    }
    
    .preloader-corner-tr {
      top: 40px;
      right: 40px;
      border-top-width: 1px;
      border-right-width: 1px;
    }
    
    .preloader-corner-bl {
      bottom: 40px;
      left: 40px;
      border-bottom-width: 1px;
      border-left-width: 1px;
    }
    
    .preloader-corner-br {
      bottom: 40px;
      right: 40px;
      border-bottom-width: 1px;
      border-right-width: 1px;
    }
    
    @keyframes cornerReveal {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    @media (max-width: 640px) {
      .preloader-corner { width: 20px; height: 20px; }
      .preloader-corner-tl, .preloader-corner-tr { top: 20px; }
      .preloader-corner-bl, .preloader-corner-br { bottom: 20px; }
      .preloader-corner-tl, .preloader-corner-bl { left: 20px; }
      .preloader-corner-tr, .preloader-corner-br { right: 20px; }
    }
  `]
})
export class Preloader implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() hidden = new EventEmitter<void>();
  
  isHidden = false;
  hostHidden = false;
  isFadingOut = false;
  progress = 0;
  letters = 'ADINOVA'.split('');
  statusText = 'Initializing';

  get hiddenAttr(): boolean {
    return this.isHidden || this.hostHidden;
  }

  get hostVisibility(): 'visible' | 'hidden' {
    return (this.isHidden || this.hostHidden) ? 'hidden' : 'visible';
  }

  get isCompletelyHidden(): boolean {
    return this.isHidden || this.hostHidden;
  }

  get hostDisplay(): string {
    return (this.isHidden || this.hostHidden) ? 'none' : 'block';
  }
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private mainMesh!: THREE.Mesh;
  private secondaryMesh!: THREE.Mesh;
  private particles!: THREE.Points;
  private rings: THREE.Mesh[] = [];
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;

  private loadingSteps = [
    { progress: 15, text: 'Loading assets' },
    { progress: 30, text: 'Building scene' },
    { progress: 50, text: 'Preparing animations' },
    { progress: 70, text: 'Optimizing' },
    { progress: 85, text: 'Finalizing' },
    { progress: 100, text: 'Welcome' },
  ];
  private currentStep = 0;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      document.body.classList.add('preloader-active');
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    
    this.ngZone.runOutsideAngular(() => {
      this.initThreeJS();
      this.animate();
      this.simulateLoading();
    });
  }

  private hideElement(): void {
    const el = this.canvasRef?.nativeElement;
    if (el?.parentElement) {
      el.parentElement.style.display = 'none';
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    if (this.isBrowser) {
      document.body.classList.remove('preloader-active');
    }
    this.hideElement();
  }

  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x36A8A8, 2);
    mainLight.position.set(3, 3, 4);
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x36A8A8, 0.8);
    fillLight.position.set(-3, -2, 2);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.5);
    rimLight.position.set(0, -3, -2);
    this.scene.add(rimLight);

    this.createMainCrystal();
    this.createSecondaryElements();
    this.createParticles();
    this.createRings();

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private createMainCrystal() {
    const geometry = new THREE.OctahedronGeometry(1.4, 0);
    
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x36A8A8,
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.95,
      envMapIntensity: 1.5,
    });

    this.mainMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mainMesh);

    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x36A8A8,
      transparent: true,
      opacity: 0.6,
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    this.mainMesh.add(edges);

    const innerGeometry = new THREE.OctahedronGeometry(0.7, 0);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x36A8A8,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    this.mainMesh.add(inner);
  }

  private createSecondaryElements() {
    const geometry = new THREE.IcosahedronGeometry(0.5, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x36A8A8,
      roughness: 0.2,
      metalness: 0.9,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.7,
    });

    this.secondaryMesh = new THREE.Mesh(geometry, material);
    this.secondaryMesh.position.set(2.2, -1, 0.5);
    this.scene.add(this.secondaryMesh);
  }

  private createParticles() {
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 2;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0x36A8A8,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createRings() {
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.TorusGeometry(1.8 + i * 0.4, 0.008, 16, 100);
      const material = new THREE.MeshBasicMaterial({
        color: 0x36A8A8,
        transparent: true,
        opacity: 0.15 - i * 0.04,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2 + i * 0.2;
      ring.rotation.y = i * 0.3;
      this.rings.push(ring);
      this.scene.add(ring);
    }
  }

  private onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.012;

    this.mainMesh.rotation.x = this.time * 0.4;
    this.mainMesh.rotation.y = this.time * 0.6;
    this.mainMesh.rotation.z = Math.sin(this.time * 0.2) * 0.15;
    
    const breathe = 1 + Math.sin(this.time * 1.5) * 0.08;
    this.mainMesh.scale.setScalar(breathe);

    const mainMaterial = this.mainMesh.material as THREE.MeshPhysicalMaterial;
    mainMaterial.opacity = 0.9 + Math.sin(this.time * 2) * 0.05;

    this.secondaryMesh.rotation.x = -this.time * 0.3;
    this.secondaryMesh.rotation.y = this.time * 0.5;
    this.secondaryMesh.position.y = -1 + Math.sin(this.time * 0.8) * 0.2;

    this.particles.rotation.y = this.time * 0.05;
    this.particles.rotation.x = this.time * 0.02;

    this.rings.forEach((ring, i) => {
      ring.rotation.z = this.time * (0.1 + i * 0.05);
      ring.rotation.x = Math.PI / 2 + Math.sin(this.time * 0.3 + i) * 0.1;
    });

    const cameraX = Math.sin(this.time * 0.2) * 0.3;
    const cameraY = Math.cos(this.time * 0.15) * 0.2;
    this.camera.position.x = cameraX;
    this.camera.position.y = cameraY;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  private simulateLoading() {
    const totalDuration = 4000;
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      
      this.progress = progress;
      this.cdr.detectChanges();
      
      if (this.currentStep < this.loadingSteps.length) {
        const step = this.loadingSteps[this.currentStep];
        if (progress >= step.progress) {
          this.statusText = step.text;
          this.cdr.detectChanges();
          this.currentStep++;
        }
      }
      
      if (progress < 100) {
        setTimeout(updateProgress, 16);
      } else {
        this.statusText = 'Welcome';
        this.cdr.detectChanges();
        this.isFadingOut = true;
        
        setTimeout(() => {
          this.hidden.emit();
        }, 800);
      }
    };
    
    setTimeout(updateProgress, 16);
  }

  hide() {
    this.isFadingOut = true;
    
    setTimeout(() => {
      this.isHidden = true;
      this.hostHidden = true;
      this.hidden.emit();
      
      const hostEl = document.querySelector('app-preloader');
      if (hostEl?.parentElement) {
        hostEl.parentElement.removeChild(hostEl);
      }
      
      window.scrollTo(0, 0);
      document.body.classList.remove('preloader-active');
    }, 1200);
  }
}