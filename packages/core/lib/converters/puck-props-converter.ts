/**
 * Puck Props Converter
 * Puck component props'larını backend formatına dönüştürür
 */

/**
 * Puck props'larını backend formatına dönüştürür
 */
export function convertPuckPropsToBackend(
  props: Record<string, any>,
  componentType: string
): {
  content: Record<string, any>;
  responsive: {
    desktop?: Record<string, any>;
    tablet?: Record<string, any>;
    mobile?: Record<string, any>;
  };
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: {
    desktop?: Record<string, any>;
    tablet?: Record<string, any>;
    mobile?: Record<string, any>;
  } = {};
  const cssData: Record<string, any> = {};

  // Component tipine göre dönüştürme yap
  switch (componentType) {
    case 'heading':
      return convertHeadingPropsToBackend(props);
    
    case 'text':
      return convertTextPropsToBackend(props);
    
    case 'button':
      return convertButtonPropsToBackend(props);
    
    case 'image':
      return convertImagePropsToBackend(props);
    
    case 'section':
      return convertSectionPropsToBackend(props);
    
    case 'column':
      return convertColumnPropsToBackend(props);
    
    case 'container':
      return convertContainerPropsToBackend(props);
    
    case 'spacer':
      return convertSpacerPropsToBackend(props);
    
    case 'break':
      return convertBreakPropsToBackend(props);
    
    case 'video':
      return convertVideoPropsToBackend(props);
    
    case 'gallery':
      return convertGalleryPropsToBackend(props);
    
    case 'slider':
      return convertSliderPropsToBackend(props);
    
    case 'shortcode':
      return convertShortcodePropsToBackend(props);
    
    default:
      return convertGenericPropsToBackend(props);
  }
}

/**
 * Heading props dönüştürme
 */
function convertHeadingPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.text) {
    content.text = props.text;
    responsive.desktop.title = props.text;
  }
  
  if (props.level) {
    content.tag = props.level;
    responsive.desktop.header_size = props.level;
  }
  
  if (props.align) {
    content.alignment = props.align;
    responsive.desktop.align = props.align;
  }

  // Responsive
  if (props.color) {
    responsive.desktop.title_color = props.color;
  }
  
  if (props.size) {
    responsive.desktop.typography_font_size = convertSizeToFontSize(props.size);
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Text props dönüştürme
 */
function convertTextPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.text) {
    content.html = props.text;
    content.text = props.text;
    responsive.desktop.editor = props.text;
  }
  
  if (props.align) {
    content.alignment = props.align;
    responsive.desktop.align = props.align;
  }

  // Responsive
  if (props.color) {
    responsive.desktop.text_color = props.color;
  }
  
  if (props.size) {
    responsive.desktop.typography_font_size = convertSizeToFontSize(props.size);
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Button props dönüştürme
 */
function convertButtonPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.label) {
    content.text = props.label;
    responsive.desktop.button_text = props.label;
  }
  
  if (props.href) {
    content.link = {
      url: props.href,
      is_external: props.href.startsWith('http'),
      nofollow: false
    };
    responsive.desktop.button_link = {
      url: props.href,
      is_external: props.href.startsWith('http'),
      nofollow: false
    };
  }
  
  if (props.variant) {
    content.type = convertVariantToType(props.variant);
    responsive.desktop.button_type = convertVariantToType(props.variant);
  }

  // Responsive
  if (props.backgroundColor) {
    responsive.desktop.button_color = props.backgroundColor;
  }
  
  if (props.textColor) {
    responsive.desktop.button_text_color = props.textColor;
  }
  
  if (props.size) {
    responsive.desktop.button_size = props.size;
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Image props dönüştürme
 */
function convertImagePropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.src) {
    content.image = {
      url: props.src,
      alt: props.alt || '',
      title: props.title || ''
    };
    responsive.desktop.image = {
      url: props.src,
      alt: props.alt || '',
      title: props.title || ''
    };
  }
  
  if (props.href) {
    content.link = {
      url: props.href,
      is_external: props.href.startsWith('http'),
      nofollow: false
    };
    responsive.desktop.image_link = {
      url: props.href,
      is_external: props.href.startsWith('http'),
      nofollow: false
    };
  }

  // Responsive
  if (props.width) {
    responsive.desktop.image_width = convertSizeToSizeObject(props.width);
  }
  
  if (props.height) {
    responsive.desktop.image_height = convertSizeToSizeObject(props.height);
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Section props dönüştürme
 */
function convertSectionPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.layout) {
    content.layout = props.layout;
  }

  // Responsive
  if (props.backgroundColor) {
    responsive.desktop.background_color = props.backgroundColor;
  }
  
  if (props.backgroundImage) {
    responsive.desktop.background_image = {
      url: props.backgroundImage
    };
  }
  
  if (props.padding) {
    responsive.desktop._padding = convertSpacingToSpacingObject(props.padding);
  }
  
  if (props.margin) {
    responsive.desktop._margin = convertSpacingToSpacingObject(props.margin);
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Column props dönüştürme
 */
function convertColumnPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.width) {
    content.width = convertSizeToSizeObject(props.width);
  }

  // Responsive
  if (props.padding) {
    responsive.desktop._padding = convertSpacingToSpacingObject(props.padding);
  }
  
  if (props.margin) {
    responsive.desktop._margin = convertSpacingToSpacingObject(props.margin);
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Container props dönüştürme
 */
function convertContainerPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content - tüm props'ları content'e kopyala
  Object.assign(content, props);

  // Responsive
  if (props.padding) {
    responsive.desktop._padding = convertSpacingToSpacingObject(props.padding);
  }
  
  if (props.margin) {
    responsive.desktop._margin = convertSpacingToSpacingObject(props.margin);
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Spacer props dönüştürme
 */
function convertSpacerPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.size) {
    content.attributes = {
      height: props.size
    };
    responsive.desktop.height = props.size;
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Break props dönüştürme
 */
function convertBreakPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = {};
  const cssData: Record<string, any> = {};

  // Content
  if (props.style) {
    content.style = props.style;
  }
  
  if (props.width) {
    content.width = props.width;
  }
  
  if (props.height) {
    content.height = props.height;
  }
  
  if (props.color) {
    content.color = props.color;
  }

  return { content, responsive, cssData };
}

/**
 * Video props dönüştürme
 */
function convertVideoPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.videoUrl) {
    content.video_url = props.videoUrl;
    content.video_type = props.videoType || 'youtube';
    content.autoplay = props.autoplay || false;
    content.controls = props.controls !== false;
    content.mute = props.mute || false;
  }

  // Responsive
  if (props.width) {
    responsive.desktop.video_width = convertSizeToSizeObject(props.width);
  }
  
  if (props.height) {
    responsive.desktop.video_height = convertSizeToSizeObject(props.height);
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Gallery props dönüştürme
 */
function convertGalleryPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.images) {
    content.images = props.images;
  }
  
  if (props.columns) {
    content.columns = props.columns;
  }
  
  if (props.size) {
    content.size = props.size;
  }

  // Responsive
  if (props.gap) {
    responsive.desktop.gallery_gap = props.gap;
  }
  
  if (props.columns) {
    responsive.desktop.gallery_columns = props.columns;
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Slider props dönüştürme
 */
function convertSliderPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = { desktop: {} };
  const cssData: Record<string, any> = {};

  // Content
  if (props.type) {
    content.type = props.type;
  }
  
  if (props.autoplay !== undefined) {
    content.autoplay = props.autoplay;
  }
  
  if (props.interval) {
    content.interval = props.interval;
  }
  
  if (props.showDots !== undefined) {
    content.show_dots = props.showDots;
  }
  
  if (props.showArrows !== undefined) {
    content.show_arrows = props.showArrows;
  }
  
  if (props.sliders) {
    content.sliders = props.sliders;
  }

  // Responsive
  if (props.navStyle) {
    responsive.desktop.slider_nav_style = props.navStyle;
  }
  
  if (props.navPosition) {
    responsive.desktop.slider_nav_position = props.navPosition;
  }

  // Tablet ve mobile responsive data
  if (props.tablet) {
    responsive.tablet = convertResponsiveProps(props.tablet, 'tablet');
  }
  
  if (props.mobile) {
    responsive.mobile = convertResponsiveProps(props.mobile, 'mobile');
  }

  return { content, responsive, cssData };
}

/**
 * Shortcode props dönüştürme
 */
function convertShortcodePropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = {};
  const cssData: Record<string, any> = {};

  // Content - tüm props'ları content'e kopyala
  Object.assign(content, props);

  return { content, responsive, cssData };
}

/**
 * Generic props dönüştürme
 */
function convertGenericPropsToBackend(props: Record<string, any>): {
  content: Record<string, any>;
  responsive: any;
  cssData: Record<string, any>;
} {
  const content: Record<string, any> = {};
  const responsive: any = {};
  const cssData: Record<string, any> = {};

  // Content - tüm props'ları content'e kopyala
  Object.assign(content, props);

  return { content, responsive, cssData };
}

/**
 * Helper functions
 */
function convertSizeToFontSize(size: string): { size: number; unit: string } {
  const sizeMap: Record<string, number> = {
    'xs': 12,
    's': 14,
    'm': 16,
    'l': 18,
    'xl': 20,
    'xxl': 24,
    'xxxl': 32
  };

  return {
    size: sizeMap[size] || 16,
    unit: 'px'
  };
}

function convertVariantToType(variant: string): string {
  switch (variant) {
    case 'primary':
      return 'filled';
    case 'secondary':
      return 'outline';
    case 'outline':
      return 'outline';
    case 'ghost':
      return 'ghost';
    default:
      return 'filled';
  }
}

function convertSizeToSizeObject(size: string | number): { size: number; unit: string } {
  if (typeof size === 'number') {
    return { size, unit: 'px' };
  }
  
  if (typeof size === 'string') {
    const match = size.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (match) {
      return {
        size: parseFloat(match[1]),
        unit: match[2] || 'px'
      };
    }
  }
  
  return { size: 100, unit: '%' };
}

function convertSpacingToSpacingObject(spacing: string | number | object): any {
  if (typeof spacing === 'object') {
    return spacing;
  }
  
  if (typeof spacing === 'number') {
    return {
      top: spacing,
      right: spacing,
      bottom: spacing,
      left: spacing
    };
  }
  
  if (typeof spacing === 'string') {
    const values = spacing.split(' ').map(v => parseInt(v) || 0);
    if (values.length === 1) {
      return {
        top: values[0],
        right: values[0],
        bottom: values[0],
        left: values[0]
      };
    } else if (values.length === 2) {
      return {
        top: values[0],
        right: values[1],
        bottom: values[0],
        left: values[1]
      };
    } else if (values.length === 4) {
      return {
        top: values[0],
        right: values[1],
        bottom: values[2],
        left: values[3]
      };
    }
  }
  
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function convertResponsiveProps(props: Record<string, any>, breakpoint: string): Record<string, any> {
  const converted: Record<string, any> = {};
  
  Object.entries(props).forEach(([key, value]) => {
    const backendKey = convertReactKeyToBackendKey(key);
    converted[backendKey] = value;
  });
  
  return converted;
}

function convertReactKeyToBackendKey(key: string): string {
  // camelCase to snake_case conversion
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}
