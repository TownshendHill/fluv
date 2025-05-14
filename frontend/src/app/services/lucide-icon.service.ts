import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root',
})
export class LucideIconService {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.registerLucideIcons();
  }

  private registerLucideIcons() {
    const namespace = 'fluv'; // Define the namespace for Lucide icons

    // Use the correct method for adding icons to a namespace
    this.iconRegistry.addSvgIconSetInNamespace(
      namespace,
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/fluv-sprite.svg',
      ),
    );
  }
}
