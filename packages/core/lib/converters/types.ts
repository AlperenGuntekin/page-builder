/**
 * Backend Element Interface
 * Dökümantasyonda belirtilen backend'den gelecek veri yapısı
 */

export interface BackendElement {
  id: string;                    // Benzersiz element ID'si (zorunlu)
  type: string;                  // Element tipi (zorunlu)
  depth: number;                 // DOM derinliği (zorunlu)
  styles?: {                     // CSS stilleri (opsiyonel)
    mobile?: Array<{ property: string; value: string }>;
    tablet?: Array<{ property: string; value: string }>;
    desktop?: Array<{ property: string; value: string }>;
  };
  content?: Record<string, any>; // Element içeriği (opsiyonel)
  children?: BackendElement[];   // Alt elementler (opsiyonel)
  responsive?: {                 // Responsive özellikler (opsiyonel)
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
  layout_data?: Record<string, any>;     // Layout verileri (opsiyonel)
  html_pattern?: Record<string, any>;    // HTML pattern (opsiyonel)
  css_data?: Record<string, any>;        // CSS verileri (opsiyonel)
  _original_tag?: string;                // Orijinal HTML tag (opsiyonel)
  _original_shortcode?: string;          // Orijinal shortcode (opsiyonel)
  _uxbuilder_version?: string;           // UX Builder versiyonu (opsiyonel)
  _original_attributes?: Record<string, any>; // Orijinal attributeler (opsiyonel)
}

/**
 * Puck Component Props Interface
 * Puck component'lerinin beklediği props yapısı
 */
export interface PuckComponentProps {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: PuckComponentProps[];
}

/**
 * Converter Options
 */
export interface ConverterOptions {
  enableCache?: boolean;
  preserveOriginalData?: boolean;
  customMappings?: Record<string, string>;
  parentIndex?: number;
}

/**
 * Cache Entry
 */
export interface CacheEntry {
  element: BackendElement;
  converted: PuckComponentProps;
  timestamp: number;
}

/**
 * Responsive Breakpoints
 */
export const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1199 },
  desktop: { min: 1200, max: Infinity }
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
