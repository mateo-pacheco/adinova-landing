import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  mapActive = signal(false);

  activateMap(event?: Event) {
    event?.preventDefault();
    this.mapActive.set(true);
  }
}
