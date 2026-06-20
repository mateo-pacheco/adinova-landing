import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../environments/environment';
import * as THREE from 'three';

@Component({
  selector: 'app-legal-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './legal-contact.html',
  styleUrl: './legal-contact.css',
})
export class LegalContact implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private fb = new FormBuilder();
  protected contactForm: FormGroup;
  protected isSubmitting = false;
  protected submitStatus: 'idle' | 'success' | 'error' = 'idle';

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
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
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

  ngOnDestroy() {
    if (!this.isBrowser) return;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.boundResize);
    this.renderer?.dispose();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);
    if (!control || !control.errors || !control.touched) return '';
    if (control.errors['required']) {
      const labels: Record<string, string> = {
        name: 'El nombre es obligatorio',
        email: 'El correo es obligatorio',
        message: 'El mensaje es obligatorio',
      };
      return labels[field] || 'Este campo es obligatorio';
    }
    if (control.errors['email']) return 'Ingresa un correo válido';
    if (control.errors['minlength']) return 'Mínimo ' + control.errors['minlength'].requiredLength + ' caracteres';
    return '';
  }

  onFieldFocus(field: string): void {}
  onFieldBlur(field: string): void {
    this.contactForm.get(field)?.markAsTouched();
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }
    this.isSubmitting = true;
    this.submitStatus = 'idle';
    try {
      const form = this.contactForm.value;
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        {
          name: (form.name || '').trim(),
          email: (form.email || '').trim().toLowerCase(),
          phone: (form.phone || '').trim() || 'No especificado',
          message: (form.message || '').trim(),
        },
        environment.emailjs.publicKey
      );
      this.submitStatus = 'success';
      this.contactForm.reset();
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsUntouched();
      });
      setTimeout(() => this.submitStatus = 'idle', 5000);
    } catch {
      this.submitStatus = 'error';
      setTimeout(() => this.submitStatus = 'idle', 5000);
    } finally {
      this.isSubmitting = false;
    }
  }

  protected readonly clients = [
    {
      id: '01',
      name: 'Corporativo Omega',
      text: 'Su equipo nos ayudo a regularizar nuestra propiedad industrial de manera eficiente. Recomendados.',
      role: 'Director General'
    },
    {
      id: '02',
      name: 'Desarrollos Vistta',
      text: 'Asesoría excelente. Cierre de compraventa en tiempo récord.',
      role: 'Director de Proyectos'
    },
    {
      id: '03',
      name: 'Inmobiliaria Horizon',
      text: 'Profesionalismo y conocimiento profundo del tema inmobiliario.',
      role: 'Socio Director'
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


