/**
 * Shortcode Detector
 * Backend'den gelen shortcode'ları tespit eder ve tipini belirler
 */

/**
 * Shortcode tiplerini tespit eder
 */
export function detectShortcodeType(element: any): string {
  // _original_shortcode field'ından tip tespit et
  if (element._original_shortcode) {
    return detectTypeFromShortcode(element._original_shortcode);
  }

  // Content'ten tip tespit et
  if (element.content) {
    const typeFromContent = detectTypeFromContent(element.content);
    if (typeFromContent) {
      return typeFromContent;
    }
  }

  // Element type'ından tip tespit et
  if (element.type) {
    return detectTypeFromElementType(element.type);
  }

  return 'shortcode';
}

/**
 * Shortcode string'inden tip tespit eder
 */
function detectTypeFromShortcode(shortcode: string): string {
  if (!shortcode || typeof shortcode !== 'string') {
    return 'shortcode';
  }

  const shortcodeLower = shortcode.toLowerCase();

  // Contact Forms
  if (shortcodeLower.includes('contact-form-7') || shortcodeLower.includes('cf7')) {
    return 'contact-form';
  }
  
  if (shortcodeLower.includes('gravityforms') || shortcodeLower.includes('gravity_forms')) {
    return 'gravity-forms';
  }
  
  if (shortcodeLower.includes('wpforms')) {
    return 'wpforms';
  }

  // WooCommerce
  if (shortcodeLower.includes('woocommerce_cart')) {
    return 'woocommerce-cart';
  }
  
  if (shortcodeLower.includes('woocommerce_checkout')) {
    return 'woocommerce-checkout';
  }
  
  if (shortcodeLower.includes('woocommerce_my_account')) {
    return 'woocommerce-account';
  }
  
  if (shortcodeLower.includes('products') || shortcodeLower.includes('product_list')) {
    return 'woocommerce-products';
  }

  // Social Media
  if (shortcodeLower.includes('social') || shortcodeLower.includes('share')) {
    return 'social-share';
  }

  // Sliders & Carousels
  if (shortcodeLower.includes('slider') || shortcodeLower.includes('carousel')) {
    return 'slider';
  }

  // Galleries
  if (shortcodeLower.includes('gallery')) {
    return 'gallery';
  }

  // Maps
  if (shortcodeLower.includes('map') || shortcodeLower.includes('google_map')) {
    return 'map';
  }

  // Videos
  if (shortcodeLower.includes('video') || shortcodeLower.includes('youtube') || shortcodeLower.includes('vimeo')) {
    return 'video';
  }

  // Testimonials
  if (shortcodeLower.includes('testimonial')) {
    return 'testimonial';
  }

  // Countdown
  if (shortcodeLower.includes('countdown') || shortcodeLower.includes('timer')) {
    return 'countdown';
  }

  // Accordion
  if (shortcodeLower.includes('accordion') || shortcodeLower.includes('toggle')) {
    return 'accordion';
  }

  // Tabs
  if (shortcodeLower.includes('tab')) {
    return 'tabs';
  }

  // Progress Bar
  if (shortcodeLower.includes('progress')) {
    return 'progress-bar';
  }

  // Counter
  if (shortcodeLower.includes('counter') || shortcodeLower.includes('number')) {
    return 'counter';
  }

  // Icon Box
  if (shortcodeLower.includes('icon') && shortcodeLower.includes('box')) {
    return 'icon-box';
  }

  // Newsletter
  if (shortcodeLower.includes('newsletter') || shortcodeLower.includes('mailchimp')) {
    return 'newsletter';
  }

  // Pricing Table
  if (shortcodeLower.includes('pricing') || shortcodeLower.includes('price')) {
    return 'pricing-table';
  }

  // Team
  if (shortcodeLower.includes('team') || shortcodeLower.includes('member')) {
    return 'team';
  }

  // Portfolio
  if (shortcodeLower.includes('portfolio')) {
    return 'portfolio';
  }

  // Blog
  if (shortcodeLower.includes('blog') || shortcodeLower.includes('post')) {
    return 'blog';
  }

  // Events
  if (shortcodeLower.includes('event') || shortcodeLower.includes('calendar')) {
    return 'events';
  }

  // FAQ
  if (shortcodeLower.includes('faq')) {
    return 'faq';
  }

  // Generic shortcode
  return 'shortcode';
}

/**
 * Content'ten tip tespit eder
 */
function detectTypeFromContent(content: any): string | null {
  if (!content || typeof content !== 'object') {
    return null;
  }

  // Content'te shortcode pattern'leri ara
  const contentString = JSON.stringify(content).toLowerCase();

  // Contact Forms
  if (contentString.includes('contact-form-7') || contentString.includes('cf7')) {
    return 'contact-form';
  }

  // WooCommerce
  if (contentString.includes('woocommerce')) {
    return 'woocommerce';
  }

  // Social Media
  if (contentString.includes('social') || contentString.includes('share')) {
    return 'social-share';
  }

  // Sliders
  if (contentString.includes('slider') || contentString.includes('carousel')) {
    return 'slider';
  }

  // Galleries
  if (contentString.includes('gallery')) {
    return 'gallery';
  }

  // Videos
  if (contentString.includes('video') || contentString.includes('youtube') || contentString.includes('vimeo')) {
    return 'video';
  }

  return null;
}

/**
 * Element type'ından tip tespit eder
 */
function detectTypeFromElementType(type: string): string {
  if (!type || typeof type !== 'string') {
    return 'shortcode';
  }

  const typeLower = type.toLowerCase();

  // Shortcode types
  if (typeLower.includes('shortcode')) {
    return 'shortcode';
  }

  // Custom types
  if (typeLower.includes('custom')) {
    return 'custom';
  }

  // HTML types
  if (typeLower.includes('html')) {
    return 'html';
  }

  // Widget types
  if (typeLower.includes('widget')) {
    return 'widget';
  }

  return 'shortcode';
}

/**
 * Shortcode parametrelerini parse eder
 */
export function parseShortcodeParams(shortcode: string): {
  name: string;
  params: Record<string, any>;
} {
  if (!shortcode || typeof shortcode !== 'string') {
    return { name: 'shortcode', params: {} };
  }

  // Shortcode pattern: [name param1="value1" param2="value2"]
  const match = shortcode.match(/\[([^\s\]]+)([^\]]*)\]/);
  
  if (!match) {
    return { name: 'shortcode', params: {} };
  }

  const name = match[1];
  const paramString = match[2];

  const params: Record<string, any> = {};

  // Parametreleri parse et
  if (paramString) {
    const paramMatches = paramString.matchAll(/(\w+)=["']([^"']*)["']/g);
    
    for (const paramMatch of paramMatches) {
      const [, key, value] = paramMatch;
      params[key] = parseParamValue(value);
    }
  }

  return { name, params };
}

/**
 * Parametre değerini parse eder
 */
function parseParamValue(value: string): any {
  // Boolean değerler
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Numeric değerler
  if (/^\d+$/.test(value)) return parseInt(value);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
  
  // String değerler
  return value;
}

/**
 * Shortcode'u render edilebilir formata dönüştürür
 */
export function convertShortcodeToRenderable(shortcode: string): {
  type: string;
  props: Record<string, any>;
} {
  const { name, params } = parseShortcodeParams(shortcode);
  const type = detectTypeFromShortcode(name);

  return {
    type,
    props: {
      shortcode: shortcode,
      shortcodeName: name,
      ...params
    }
  };
}

/**
 * Desteklenen shortcode tiplerini döndürür
 */
export function getSupportedShortcodeTypes(): string[] {
  return [
    'shortcode',
    'contact-form',
    'gravity-forms',
    'wpforms',
    'woocommerce-cart',
    'woocommerce-checkout',
    'woocommerce-account',
    'woocommerce-products',
    'social-share',
    'slider',
    'gallery',
    'map',
    'video',
    'testimonial',
    'countdown',
    'accordion',
    'tabs',
    'progress-bar',
    'counter',
    'icon-box',
    'newsletter',
    'pricing-table',
    'team',
    'portfolio',
    'blog',
    'events',
    'faq',
    'custom',
    'html',
    'widget'
  ];
}

/**
 * Shortcode tipinin desteklenip desteklenmediğini kontrol eder
 */
export function isSupportedShortcodeType(type: string): boolean {
  return getSupportedShortcodeTypes().includes(type);
}
