// services/breakpoint.service.ts
import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BREAKPOINTS } from '@constants/layout/breakpoints';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  isDesktop = toSignal(
    this.breakpointObserver
      .observe([BREAKPOINTS.laptopAndAbove])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  isMobile = toSignal(
    this.breakpointObserver
      .observe([BREAKPOINTS.mobile])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  isTablet = toSignal(
    this.breakpointObserver
      .observe([BREAKPOINTS.tablet])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );
}
