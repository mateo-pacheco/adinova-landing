import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../environments/environment';
import * as THREE from 'three';

@Component({
  selector: 'app-testimonios-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './testimonios-contact.html',
  styleUrl: './testimonios-contact.css',
})
export class TestimoniosContact implements AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private fb = new FormBuilder();
  protected contactForm: FormGroup;
  protected isSubmitting = false;
  protected submitStatus: 'idle' | 'success' | 'error' = 'idle';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private animationId!: number;
  private time = 0;
  private isBrowser: boolean;
  private boundResize = this.onWindowResize.bind(this);

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

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
          company: (form.company || '').trim() || 'No especificado',
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
    } catch (error: unknown) {
      console.error('EmailJS error:', error);
      this.submitStatus = 'error';
      setTimeout(() => this.submitStatus = 'idle', 5000);
    } finally {
      this.isSubmitting = false;
    }
  }

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

    const mainLight = new THREE.DirectionalLight(0x36A8A8, 1.0);
    mainLight.position.set(3, 3, 5);
    this.scene.add(mainLight);

    this.createParticles(isMobile);
  }

  private createParticles(isMobile: boolean) {
    const particleCount = isMobile ? 50 : 100;
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

    this.particles.rotation.y = this.time * 0.05;
    this.particles.rotation.x = this.time * 0.02;

    this.renderer.render(this.scene, this.camera);
  }
}
