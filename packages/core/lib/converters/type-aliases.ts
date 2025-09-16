/**
 * Type Aliases Mapping
 * Backend'den gelen element tiplerini Puck formatına dönüştürür
 */

export const TYPE_ALIASES: Record<string, string> = {
  // UX Builder
  'ux_slider': 'slider',
  'ux_text': 'text',
  'ux_banner': 'banner',
  'ux_gallery': 'gallery',
  'ux_products_list': 'product-list',
  
  // Gutenberg
  'core/heading': 'heading',
  'core/paragraph': 'text',
  'core/image': 'image',
  'core/button': 'button',
  'core/columns': 'section',
  'core/column': 'column',
  'core/group': 'container',
  'core/buttons': 'container',
  'core/gallery': 'gallery',
  'core/spacer': 'spacer',
  'core/separator': 'break',
  
  // Elementor
  'elementskit-heading': 'heading',
  'elementskit-text-editor': 'text',
  'elementskit-button': 'button',
  'elementskit-image': 'image',
  'elementskit-icon': 'icon',
  'elementskit-icon-box': 'icon-box',
  'elementskit-media-carousel': 'media-carousel',
  'elementskit-countdown-timer': 'countdown',
  
  // Bricks Builder
  'brxe-section': 'section',
  'brxe-container': 'column',
  'brxe-heading': 'heading',
  'brxe-text-basic': 'text',
  'brxe-button': 'button',
  'brxe-image': 'image',
  
  // Crocoblock
  'ct_section': 'section',
  'ct_div_block': 'container',
  'ct_heading': 'heading',
  'ct_text_block': 'text',
  'ct_button': 'button',
  'ct_image': 'image',
  
  // Beaver Builder
  'fl-row': 'section',
  'fl-col': 'column',
  'fl-heading': 'heading',
  'fl-rich-text': 'text',
  'fl-button': 'button',
  'fl-photo': 'image',
  
  // Visual Composer
  'vc_row': 'section',
  'vc_column': 'column',
  'vc_empty_space': 'spacer',
  'vc_separator': 'break',
  
  // Generic Layout
  'row': 'section',
  'col': 'column',
  'section': 'section',
  'column': 'column',
  'container': 'container',
  'div': 'container',
  
  // Content Types
  'page-title': 'heading',
  'page_header': 'heading',
  'title': 'heading',
  'header': 'heading',
  'text-editor': 'text',
  'paragraph': 'text',
  'gap': 'spacer',
  'spacer': 'spacer',
  'break': 'break',
  'separator': 'break',
  
  // Media
  'image': 'image',
  'photo': 'image',
  'video': 'video',
  'media': 'image',
  
  // Interactive
  'button': 'button',
  'link': 'link',
  'cta': 'button',
  
  // Special
  'shortcode': 'shortcode',
  'custom': 'shortcode',
  'html': 'shortcode',
  
  // E-commerce
  'product-list': 'product-list',
  'products_list': 'product-list',
  'product-grid': 'product-grid',
  'woocommerce_cart': 'shortcode',
  'woocommerce_checkout': 'shortcode',
  
  // Forms
  'contact-form-7': 'shortcode',
  'gravityforms': 'shortcode',
  'wpforms': 'shortcode',
  
  // Social
  'social-share': 'social-share',
  'social-icons': 'social-share',
  
  // Advanced
  'accordion': 'accordion',
  'tabs': 'tabs',
  'testimonial': 'testimonial',
  'counter': 'counter',
  'progress-bar': 'progress-bar',
  'countdown': 'countdown',
  'icon-box': 'icon-box',
  'featured_box': 'icon-box',
  'pp-advanced-accordion': 'accordion',
  
  // Sliders & Carousels
  'slider': 'slider',
  'carousel': 'media-carousel',
  'media-carousel': 'media-carousel',
  'testimonial-slider': 'testimonial-slider',
  
  // Layout Components
  'flex': 'flex',
  'grid': 'grid',
  'space': 'spacer',
  'hero': 'hero',
  'card': 'card',
  'stats': 'stats',
  'logos': 'logos',
  'template': 'template'
};

/**
 * Reverse mapping for Puck to Backend conversion
 */
export const REVERSE_TYPE_ALIASES: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_ALIASES).map(([key, value]) => [value, key])
);

/**
 * Get canonical type from backend type
 */
export function getCanonicalType(backendType: string): string {
  return TYPE_ALIASES[backendType] || backendType;
}

/**
 * Get backend type from canonical type
 */
export function getBackendType(canonicalType: string): string {
  return REVERSE_TYPE_ALIASES[canonicalType] || canonicalType;
}

/**
 * Check if type is supported
 */
export function isSupportedType(type: string): boolean {
  return type in TYPE_ALIASES || Object.values(TYPE_ALIASES).includes(type);
}
