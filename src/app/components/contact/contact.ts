import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import * as THREE from 'three';

interface ContactItem {
  label: string;
  value: string;
  href: string;
}

interface StatusCopy {
  title: string;
  copy: string;
  tone: 'success' | 'error';
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private fb = inject(FormBuilder);
  private touchTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private validationTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphere!: THREE.Mesh;
  private innerSphere!: THREE.Mesh;
  private particles!: THREE.Points;
  private animationId!: number;
  private scrollProgress = 0;
  private targetScrollProgress = 0;
  private time = 0;

  protected contactItems: ContactItem[] = [
    { label: 'Correo', value: 'hola@adinova.studio', href: 'mailto:hola@adinova.studio' },
    { label: 'Telefono', value: '+593 99 000 0000', href: 'tel:+593990000000' },
    { label: 'Ubicacion', value: 'Quito, Ecuador', href: '#' },
  ];

  protected schedules = [
    'Lunes a viernes / 09:00 - 18:00',
    'Reuniones presenciales y virtuales',
  ];

  protected contactForm: FormGroup;
  protected isSubmitting = false;
  protected submitStatus: 'idle' | 'success' | 'error' = 'idle';
  protected touchedFields = new Set<string>();
  protected dirtyFields = new Set<string>();
  protected fieldFocus = new Set<string>();
  protected showErrors = new Set<string>();

  protected readonly serviceOptions = [
    'Arquitectura residencial',
    'Arquitectura comercial',
    'Interiorismo',
    'Diseno conceptual',
  ];

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.pattern(/^0\d{2}\s?\d{3}\s?\d{4}$/)]],
      service: ['Arquitectura residencial'],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.setupFieldListeners();
  }

  ngOnDestroy(): void {
    this.clearAllTimeouts();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
  }

  ngAfterViewInit() {
    this.initThreeJS();
    this.animate();
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementById('contacto');
    if (section) {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight;
      const scrolled = windowHeight - rect.top;
      const totalScrollable = windowHeight + sectionHeight;
      this.targetScrollProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
    }
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

    this.createSphere();
    this.createParticles();
  }

  private createSphere() {
    const geometry = new THREE.SphereGeometry(1.3, 32, 32);
    
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x36A8A8,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.set(2, 0, 0);
    this.scene.add(this.sphere);

    const innerGeometry = new THREE.SphereGeometry(0.9, 24, 24);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x36A8A8,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    this.innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    this.sphere.add(this.innerSphere);
  }

  private createParticles() {
    const particleCount = 60;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x36A8A8,
      size: 0.06,
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

    const easeProgress = this.easeOutCubic(this.scrollProgress);

    this.sphere.rotation.x = this.time * 0.4;
    this.sphere.rotation.y = this.time * 0.6;
    
    this.innerSphere.rotation.x = -this.time * 0.8;
    this.innerSphere.rotation.y = -this.time * 1.2;

    this.sphere.position.x = 2 + Math.sin(this.time * 0.3) * 0.15;
    this.sphere.position.y = Math.cos(this.time * 0.4) * 0.1;

    const scale = 1 - easeProgress * 0.3;
    this.sphere.scale.setScalar(scale);

    const material = this.sphere.material as THREE.MeshPhysicalMaterial;
    material.opacity = 0.8 - easeProgress * 0.4;

    this.particles.rotation.y = this.time * 0.06;
    
    const particlesMaterial = this.particles.material as THREE.PointsMaterial;
    particlesMaterial.opacity = 0.4 - easeProgress * 0.2;

    this.renderer.render(this.scene, this.camera);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private clearAllTimeouts(): void {
    this.touchTimeouts.forEach(t => clearTimeout(t));
    this.validationTimeouts.forEach(t => clearTimeout(t));
    this.touchTimeouts.clear();
    this.validationTimeouts.clear();
  }

  private setupFieldListeners(): void {
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      if (!control) return;

      control.valueChanges.subscribe(() => {
        if (control.dirty && !this.dirtyFields.has(field)) {
          this.dirtyFields.add(field);
        }
        if (!control.pristine && !this.dirtyFields.has(field)) {
          this.dirtyFields.add(field);
        }
        this.scheduleValidation(field);
      });
    });
  }

  private scheduleValidation(field: string): void {
    const existing = this.validationTimeouts.get(field);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      this.contactForm.get(field)?.updateValueAndValidity();
      this.validationTimeouts.delete(field);
    }, 300);

    this.validationTimeouts.set(field, timeout);
  }

  onFieldFocus(field: string): void {
    this.fieldFocus.add(field);
  }

  onFieldBlur(field: string): void {
    this.fieldFocus.delete(field);
    this.markAsTouched(field);
  }

  private markAsTouched(field: string): void {
    if (this.touchTimeouts.has(field)) return;

    const timeout = setTimeout(() => {
      this.contactForm.get(field)?.markAsTouched();
      this.touchedFields.add(field);
      this.showErrors.add(field);
      this.touchTimeouts.delete(field);
    }, 100);

    this.touchTimeouts.set(field, timeout);
  }

  getFieldState(field: string): 'idle' | 'invalid' | 'valid' {
    if (this.showErrors.has(field) && this.isFieldInvalid(field)) return 'invalid';
    if (this.touchedFields.has(field) || this.dirtyFields.has(field)) {
      if (this.isFieldValid(field)) return 'valid';
    }
    return 'idle';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  isFieldValid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.valid && (control.touched || control.dirty));
  }

  isFieldActive(field: string): boolean {
    return this.fieldFocus.has(field);
  }

  isFieldEmpty(field: string): boolean {
    const control = this.contactForm.get(field);
    const value = control?.value;
    return !value || (typeof value === 'string' && !value.trim());
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

    if (control.errors['email']) {
      return 'Ingresa un correo valido';
    }

    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      if (field === 'name') return `Minimo ${min} caracteres`;
      if (field === 'message') return `Minimo ${min} caracteres para enviar`;
      return `Minimo ${min} caracteres`;
    }

    if (control.errors['maxlength']) {
      return 'Excediste el limite de caracteres';
    }

    if (control.errors['pattern']) {
      return 'Formato: 09X XXX XXXX';
    }

    return '';
  }

  getErrorId(field: string): string {
    return `${field}-error`;
  }

  getStatusCopy(): StatusCopy | null {
    if (this.submitStatus === 'success') {
      return {
        title: 'Mensaje enviado',
        copy: 'Recibimos tu consulta y te contactaremos pronto con una respuesta clara.',
        tone: 'success',
      };
    }

    if (this.submitStatus === 'error') {
      return {
        title: 'No se pudo enviar',
        copy: 'Hubo un problema al procesar tu mensaje. Intentalo nuevamente en unos segundos.',
        tone: 'error',
      };
    }

    return null;
  }

  getCharacterCount(field: string): { current: number; max: number } {
    const control = this.contactForm.get(field);
    const value = control?.value || '';
    const current = typeof value === 'string' ? value.length : 0;
    const max = field === 'message' ? 1000 : field === 'name' ? 100 : 150;
    return { current, max };
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.pending) {
      this.contactForm.updateValueAndValidity();
    }

    this.showAllErrors();
    this.markAllAsTouched();

    if (this.contactForm.invalid) {
      const firstInvalid = Object.keys(this.contactForm.controls).find(
        key => this.contactForm.get(key)?.invalid
      );
      if (firstInvalid) {
        const element = document.querySelector(`[formControlName="${firstInvalid}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
          service: form.service || 'No especificado',
          message: (form.message || '').trim(),
        },
        environment.emailjs.publicKey
      );

      this.submitStatus = 'success';
      this.resetForm();
      setTimeout(() => this.submitStatus = 'idle', 5000);
    } catch (error: unknown) {
      console.error('EmailJS error:', error);
      this.submitStatus = 'error';
      setTimeout(() => this.submitStatus = 'idle', 5000);
    } finally {
      this.isSubmitting = false;
    }
  }

  private showAllErrors(): void {
    Object.keys(this.contactForm.controls).forEach(field => {
      this.showErrors.add(field);
    });
  }

  private markAllAsTouched(): void {
    Object.keys(this.contactForm.controls).forEach(field => {
      this.contactForm.get(field)?.markAsTouched();
      this.touchedFields.add(field);
    });
  }

  private resetForm(): void {
    this.contactForm.reset({ service: 'Arquitectura residencial' });
    this.contactForm.markAsUntouched();
    this.contactForm.markAsPristine();
    this.touchedFields.clear();
    this.dirtyFields.clear();
    this.showErrors.clear();
    this.fieldFocus.clear();
  }
}