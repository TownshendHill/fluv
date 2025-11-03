// types/navigation.types.ts
import { PageConfig } from '@model/page_config';

// Menu item for rendering
export interface MenuItem {
  config: PageConfig;
  label: string;
  path: string;
  children?: MenuItem[];
}
