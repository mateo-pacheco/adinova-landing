import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

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
export class Contact implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private touchTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private validationTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

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