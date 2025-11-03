import {
  RedirectFunction,
  Data as RouteData,
  Params as RouteParams,
} from '@angular/router';
import { NavButtonConfig } from '@model/shared/button';

export abstract class PageConfig {
  // Routh path segment
  abstract pathSegment: string;

  // Page title
  abstract pageTitle: string;

  // Nav button config, if not defined, the nav button will be skipped
  abstract navButtonConfig?: NavButtonConfig;

  // Parent page config
  abstract parent?: PageConfig;

  // abstract routeData?: RouteData;

  // Router parameter key
  paramKey?: string;

  // Redirect to parent page
  redirectTo?: string | RedirectFunction;

  // Whether to include in sitemap
  skipInNav?: boolean;
}
