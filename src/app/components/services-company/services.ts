import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private lines: THREE.Line[] = [];
  private particles!: THREE.Points;
  private noisePlane!: THREE.Mesh;
  private animationId!: number;
  private scrollProgress = 0;
  private targetScrollProgress = 0;
  private time = 0;
  private isBrowser: boolean;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  protected readonly items = [
    {
      index: '01',
      title: 'Arquitectura residencial',
      description:
        'Proyectos que prioritizan la luz natural, la privacidad y la conexion con el entorno. Viviendas pensadas para habitar con quietud.',
      label: 'Residencial',
      image: 'assets/mock/07-night-render.svg',
    },
    {
      index: '02',
      title: 'Arquitectura comercial',
      description:
        'Espacios comerciales que traducen identidad de marca en recorridos claros y memorables. Tiendas, oficinas y locales pensados para generar valor.',
      label: 'Comercial',
      image: 'assets/mock/08-material-board.svg',
    },
    {
      index: '03',
      title: 'Interiorismo',
      description:
        'Diseno de interiores que trabaja con materialidad, atmosfera y detalle. Ambientes sobrios y coherentes con el espacio arquitectura.',
      label: 'Interiorismo',
      image: 'assets/mock/09-perspective.svg',
    },
    {
      index: '04',
      title: 'Diseno conceptual',
      description:
        'Desarrollo de ideas espaciales solidas para orientar decisiones desde el inicio. Volumetrias y esquemas que definen el proyecto.',
      label: 'Conceptual',
      image: 'assets/mock/10-studio-desk.svg',
    },
    {
      index: '05',
      title: 'Direccion de obra',
      description:
        'Supervision tecnica y control de ejecucion para mantener calidad constructiva. Seguimiento desde proyecto hasta entrega final.',
      label: 'Obra',
      image: 'assets/mock/01-hero-facade.svg',
    },
    {
      index: '06',
      title: 'Planificacion espacial',
      description:
        'Organizacion funcional del programa arquitectonico. Optimizacion de flujos, usos y permanencia en cada escala del proyecto.',
      label: 'Programa',
      image: 'assets/mock/02-interior-living.svg',
    },
  ];

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
    const section = document.getElementById('servicios');
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.createFlowingLines();
    this.createParticles();
    this.createNoisePlane();
  }

  private createFlowingLines() {
    const lineCount = 12;
    
    for (let i = 0; i < lineCount; i++) {
      const points: THREE.Vector3[] = [];
      const segments = 50;
      const startX = (Math.random() - 0.5) * 8;
      const startY = (Math.random() - 0.5) * 6;
      const startZ = (Math.random() - 0.5) * 4 - 1;
      
      for (let j = 0; j < segments; j++) {
        const t = j / segments;
        points.push(new THREE.Vector3(
          startX + t * 3 - 1.5,
          startY + Math.sin(t * Math.PI * 2) * 0.3,
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
      line.userData = { offset: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.3 };
      this.lines.push(line);
      this.scene.add(line);
    }
  }

  private createNoisePlane() {
    const geometry = new THREE.PlaneGeometry(10, 6, 80, 60);
    
    const vertexShader = `
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;
      
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float noise1 = snoise(vec2(pos.x * 0.3 + uTime * 0.15, pos.y * 0.3 + uTime * 0.1));
        float noise2 = snoise(vec2(pos.x * 0.6 - uTime * 0.08, pos.y * 0.5 + uTime * 0.12));
        float noise3 = snoise(vec2(pos.x * 1.2 + uTime * 0.2, pos.y * 1.0 - uTime * 0.05));
        
        float elevation = noise1 * 0.4 + noise2 * 0.2 + noise3 * 0.1;
        
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
        float alpha = 0.06 + abs(vElevation) * 0.12;
        
        float dist = length(vUv - 0.5);
        alpha *= 1.0 - smoothstep(0.3, 0.7, dist);
        
        vec3 color = mix(
          vec3(0.15, 0.45, 0.45),
          vec3(0.25, 0.75, 0.75),
          vElevation * 2.0 + 0.5
        );
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.noisePlane = new THREE.Mesh(geometry, material);
    this.noisePlane.position.set(0, 0, -2);
    this.noisePlane.rotation.x = -Math.PI * 0.25;
    this.scene.add(this.noisePlane);
  }

  private createParticles() {
    const particleCount = 100;
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
      size: 0.04,
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

    this.lines.forEach((line, index) => {
      const positions = line.geometry.attributes['position'].array as Float32Array;
      const segments = positions.length / 3;
      const offset = line.userData['offset'];
      const speed = line.userData['speed'];

      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        positions[i * 3] += 0.002;
        positions[i * 3 + 1] += Math.sin(this.time * speed + t * Math.PI + offset) * 0.002;
        
        if (positions[i * 3] > 5) {
          positions[i * 3] = -5;
        }
      }
      line.geometry.attributes['position'].needsUpdate = true;
      
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = 0.15 + Math.sin(this.time + offset) * 0.1;
    });

    this.particles.rotation.y = this.time * 0.1;
    this.particles.rotation.x = this.time * 0.05;

    const noiseMaterial = this.noisePlane.material as THREE.ShaderMaterial;
    noiseMaterial.uniforms['uTime'].value = this.time;
    this.noisePlane.rotation.z = this.time * 0.03;

    const easeProgress = this.easeOutCubic(this.scrollProgress);
    this.scene.position.y = easeProgress * -2;
    this.scene.position.x = easeProgress * 1;

    const particlesMaterial = this.particles.material as THREE.PointsMaterial;
    particlesMaterial.opacity = 0.3 + this.scrollProgress * 0.2;

    this.renderer.render(this.scene, this.camera);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}
