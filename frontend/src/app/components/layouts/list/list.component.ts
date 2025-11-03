import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

// Define the spacing token type
export declare type SpacingToken =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl';

// Mapping from tokens to CSS values
// Static mapping to CSS custom properties from SCSS
const LIST_GAP_MAP: Record<SpacingToken, string> = {
  none: 'var(--spacing-none)',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  xxl: 'var(--spacing-xxl)',
};

@Component({
  selector: 'fluv-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'list',
    '[style.overflow]': 'overflow()',
    '[style.gap]': 'getGap()',
  },
})
export class List {
  readonly overflow? = input<string>('hidden');
  readonly gap = input<SpacingToken | string>('none');

  // Computed property to resolve gap value
  readonly getGap = computed(() => {
    const gap = this.gap();

    if (typeof gap === 'string' && gap in LIST_GAP_MAP) {
      return LIST_GAP_MAP[gap as SpacingToken];
    }

    // Allow custom values
    return gap;
  });
}
