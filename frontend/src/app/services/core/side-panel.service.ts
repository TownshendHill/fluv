import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidePanelService {
  isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  constructor() {}
}
