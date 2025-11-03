import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

type SpacingToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Preset configurations - just layout behavior, no gap
const JUSTIFY_USE_GAP: Record<CSSStyleDeclaration['justifyContent'], boolean> =
  {
    'flex-start': true,
    center: true,
    'flex-end': true,
    'space-between': false,
    'space-around': false,
    'space-evenly': false,
  };

// Static mappings to CSS values
const GROUP_GAP_MAP: Record<SpacingToken, string> = {
  none: 'var(--spacing-none)',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  xxl: 'var(--spacing-xxl)',
};

@Component({
  selector: 'fluv-group',
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.gap]': 'getGap()',
    '[style.justify-content]': 'justify()',
    '[style.align-items]': 'align()',
    '[style.flex-wrap]': 'wrap()',
  },
})
export class Group {
  readonly justify = input<CSSStyleDeclaration['justifyContent']>('center');
  readonly gap = input<SpacingToken | string>('none');
  readonly align = input<CSSStyleDeclaration['alignItems']>('flex-start');
  readonly wrap = input<CSSStyleDeclaration['flexWrap']>('nowrap');

  // Computed
  readonly getGap = computed(() => {
    const justifyInput = this.justify();
    const gapInput = this.gap();

    const useGap = JUSTIFY_USE_GAP[justifyInput];
    // If preset doesn't use gap, return 0
    if (!useGap) {
      return '0';
    }

    if (typeof gapInput === 'string' && gapInput in GROUP_GAP_MAP) {
      return GROUP_GAP_MAP[gapInput as SpacingToken];
    }

    return gapInput;
  });
}
