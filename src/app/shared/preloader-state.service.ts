import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PreloaderStateService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  hasShownPreloader(): boolean {
    if (!this.isBrowser) return false;
    try {
      return sessionStorage.getItem('adinova_preloader_shown') === 'true';
    } catch {
      return false;
    }
  }

  markPreloaderShown(): void {
    if (!this.isBrowser) return;
    try {
      sessionStorage.setItem('adinova_preloader_shown', 'true');
    } catch {}
  }

  shouldSkipAnimation(): boolean {
    return this.hasShownPreloader();
  }
}
