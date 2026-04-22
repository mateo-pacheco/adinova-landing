import { Component, AfterViewChecked, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimationsService } from './utils/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewChecked {
  private animations = inject(AnimationsService);
  private initialized = false;

  ngAfterViewChecked(): void {
    if (!this.initialized) {
      this.initialized = true;
      this.animations.init();
    }
  }
}
