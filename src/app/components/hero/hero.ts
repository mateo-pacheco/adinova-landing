import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private cubeWireframe!: THREE.Mesh;
  private particles!: THREE.Points;
  private wavePlane!: THREE.Mesh;
  private cursorFollower!: THREE.Mesh;
  private animationId!: number;
  private scrollProgress = 0;
  private targetScrollProgress = 0;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private windowHalfX = 0;
  private windowHalfY = 0;
  private time = 0;
  private isBrowser: boolean;

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
    const heroSection = document.getElementById('inicio');
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const heroHeight = heroSection.offsetHeight;
      const scrolled = windowHeight - rect.top;
      const totalScrollable = windowHeight + heroHeight;
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
    this.windowHalfX = width / 2;
    this.windowHalfY = height / 2;

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    this.scene = new THREE.Scene();

    const fov = isMobile ? 60 : isTablet ? 55 : 50;
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    
    const cameraZ = isMobile ? 5 : isTablet ? 5.5 : 6;
    this.camera.position.z = cameraZ;

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

    const mainLight = new THREE.DirectionalLight(0x36A8A8, isMobile ? 1.0 : 1.5);
    mainLight.position.set(3, 3, 5);
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x36A8A8, isMobile ? 0.4 : 0.6);
    fillLight.position.set(-3, -2, 3);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, isMobile ? 0.5 : 0.8);
    rimLight.position.set(0, 3, -3);
    this.scene.add(rimLight);

    this.createCube(isMobile);
    this.createParticles(isMobile);
    this.createWavePlane();
    
    if (!isMobile) {
      this.createCursorFollower();
    }
  }

  private createCube(isMobile: boolean) {
    const size = isMobile ? 1.6 : 2.2;
    const geometry = new THREE.BoxGeometry(size, size, size);
    
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x36A8A8,
      roughness: 0.15,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.95,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(1.8, 0, 0);
    this.scene.add(this.cube);

    const wireGeometry = new THREE.BoxGeometry(2.3, 2.3, 2.3);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x36A8A8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    this.cubeWireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    this.cube.add(this.cubeWireframe);
  }

  private createParticles(isMobile: boolean) {
    const particleCount = isMobile ? 80 : 200;
    const spread = isMobile ? 8 : 15;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * (spread * 0.7);
      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0x36A8A8,
      size: isMobile ? 0.04 : 0.03,
      transparent: true,
      opacity: isMobile ? 0.3 : 0.4,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createWavePlane() {
    const geometry = new THREE.PlaneGeometry(8, 8, 64, 64);
    
    const vertexShader = `
      uniform float uTime;
      uniform float uMouseX;
      uniform float uMouseY;
      varying vec2 vUv;
      varying float vElevation;
      
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float noise1 = snoise(vec2(pos.x * 0.5 + uTime * 0.2, pos.y * 0.5 + uTime * 0.15));
        float noise2 = snoise(vec2(pos.x * 1.0 - uTime * 0.1, pos.y * 1.0 + uTime * 0.1));
        
        float mouseInfluence = distance(vec2(uMouseX, uMouseY), pos.xy) * 0.3;
        mouseInfluence = 1.0 - min(mouseInfluence, 1.0);
        
        float elevation = (noise1 * 0.3 + noise2 * 0.15) * (1.0 + mouseInfluence * 0.5);
        
        pos.z += elevation;
        vElevation = elevation;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        float alpha = 0.08 + abs(vElevation) * 0.15;
        vec3 color = vec3(0.211, 0.659, 0.659);
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouseX: { value: 0 },
        uMouseY: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.wavePlane = new THREE.Mesh(geometry, material);
    this.wavePlane.position.set(0, 0, -3);
    this.wavePlane.rotation.x = -Math.PI * 0.3;
    this.scene.add(this.wavePlane);
  }

  private createCursorFollower() {
    const geometry = new THREE.SphereGeometry(0.08, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x36A8A8,
      transparent: true,
      opacity: 0.6,
    });
    this.cursorFollower = new THREE.Mesh(geometry, material);
    this.cursorFollower.position.set(0, 0, 2);
    this.scene.add(this.cursorFollower);
  }

  private onWindowResize() {
    const container = this.canvasRef.nativeElement.parentElement!;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.windowHalfX = width / 2;
    this.windowHalfY = height / 2;
    
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

    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.06;

    const easeProgress = this.easeOutCubic(this.scrollProgress);
    const fastScroll = easeProgress * Math.PI * 3;
    
    const width = window.innerWidth;
    const isMobile = width < 768;
    
    this.cube.rotation.x = Math.sin(fastScroll + this.time) * 0.8 + this.mouseY * 0.2;
    this.cube.rotation.y = fastScroll * 1.2 + this.time * 0.5 + this.mouseX * 0.2;
    this.cube.rotation.z = Math.cos(fastScroll * 0.7) * 0.3;

    const scale = 1 - easeProgress * 0.6;
    this.cube.scale.setScalar(scale);

    const startX = isMobile ? 0 : 1.8;
    const endX = isMobile ? 0 : -2;
    const currentX = startX + (endX - startX) * easeProgress;
    this.cube.position.x = currentX + Math.sin(this.time * 0.5) * 0.1;
    
    const startY = 0;
    const endY = isMobile ? 0.5 : 2;
    this.cube.position.y = startY + (endY - startY) * easeProgress;

    const startZ = 0;
    const endZ = isMobile ? -1 : -3;
    this.cube.position.z = startZ + (endZ - startZ) * easeProgress;

    const material = this.cube.material as THREE.MeshPhysicalMaterial;
    material.opacity = 0.95 - easeProgress * 0.8;

    const wireMaterial = this.cubeWireframe.material as THREE.MeshBasicMaterial;
    wireMaterial.opacity = 0.15 + Math.sin(this.time * 2) * 0.1;

    this.particles.rotation.y = this.time * 0.05 + this.mouseX * 0.2;
    this.particles.rotation.x = this.time * 0.02 + this.mouseY * 0.2;
    const particlesMaterial = this.particles.material as THREE.PointsMaterial;
    particlesMaterial.opacity = (isMobile ? 0.3 : 0.4) - easeProgress * 0.2;

    if (this.wavePlane) {
      const waveMaterial = this.wavePlane.material as THREE.ShaderMaterial;
      waveMaterial.uniforms['uTime'].value = this.time;
      waveMaterial.uniforms['uMouseX'].value = this.mouseX;
      waveMaterial.uniforms['uMouseY'].value = this.mouseY;
      this.wavePlane.rotation.z = this.time * 0.02;
    }

    if (this.cursorFollower) {
      this.cursorFollower.position.x = this.mouseX * 3;
      this.cursorFollower.position.y = this.mouseY * 2;
      this.cursorFollower.position.z = 2;
      const followerMaterial = this.cursorFollower.material as THREE.MeshBasicMaterial;
      followerMaterial.opacity = 0.4 + Math.sin(this.time * 3) * 0.2;
    }

    if (!isMobile) {
      this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x) * 0.05;
      this.camera.position.y += (this.mouseY * 0.3 - this.camera.position.y) * 0.05;
      
      const cameraPathY = Math.sin(easeProgress * Math.PI) * 1.5;
      const cameraPathZ = 6 - easeProgress * 3;
      this.camera.position.y += cameraPathY * 0.3;
      this.camera.position.z = cameraPathZ;
    }
    this.camera.lookAt(this.cube.position);

    this.renderer.render(this.scene, this.camera);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}
