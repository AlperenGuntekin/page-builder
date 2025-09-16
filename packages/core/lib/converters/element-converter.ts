/**
 * Element Converter
 * Tek bir backend element'ini Puck formatına dönüştürür
 */

import { BackendElement, PuckComponentProps, ConverterOptions, CacheEntry } from './types';
import { getCanonicalType } from './type-aliases';
import { convertResponsiveData } from './responsive-converter';
import { convertCustomCSS } from './css-converter';

// Cache for converted elements
const elementCache = new Map<string, CacheEntry>();

/**
 * Cache'li element dönüştürme
 */
export function convertElementWithCache(
  element: BackendElement,
  options: ConverterOptions = {}
): PuckComponentProps | null {
  const { enableCache = true, preserveOriginalData = false } = options;

  // Cache kontrolü
  if (enableCache && elementCache.has(element.id)) {
    const cached = elementCache.get(element.id)!;
    // Cache'in güncel olup olmadığını kontrol et (5 dakika)
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.converted;
    }
  }

  try {
    const converted = convertSingleElement(element, options);
    
    if (converted && enableCache) {
      elementCache.set(element.id, {
        element,
        converted,
        timestamp: Date.now()
      });
    }

    return converted;
  } catch (error) {
    console.error(`Error converting element ${element.id}:`, error);
    return null;
  }
}

/**
 * Tek element dönüştürme
 */
function convertSingleElement(
  element: BackendElement,
  options: ConverterOptions = {}
): PuckComponentProps | null {
  const { preserveOriginalData = false } = options;

  try {
    // Canonical type'ı al
    const canonicalType = getCanonicalType(element.type);
    
    // Element tipine göre dönüştürme yap
    const props = convertElementProps(element, canonicalType, options);
    
    // Children'ları dönüştür
    const children = element.children?.map(child => 
      convertElementWithCache(child, options)
    ).filter(Boolean) as PuckComponentProps[] || [];

    const result: PuckComponentProps = {
      id: element.id,
      type: canonicalType,
      props: {
        ...props,
        // Original data'yı koru (debug için)
        ...(preserveOriginalData && {
          _original: {
            type: element.type,
            depth: element.depth,
            content: element.content,
            responsive: element.responsive
          }
        })
      }
    };

    // Children varsa ekle
    if (children.length > 0) {
      result.children = children;
    }

    return result;
  } catch (error) {
    console.error(`Error converting element ${element.id}:`, error);
    return null;
  }
}

/**
 * Element props'larını dönüştürür
 */
function convertElementProps(
  element: BackendElement,
  canonicalType: string,
  options: ConverterOptions
): Record<string, any> {
  const props: Record<string, any> = {};

  // Content'ten temel props'ları al
  if (element.content) {
    Object.assign(props, element.content);
  }

  // Responsive data'yı dönüştür
  if (element.responsive) {
    const responsiveProps = convertResponsiveData(element.responsive);
    Object.assign(props, responsiveProps);
  }

  // Custom CSS'i dönüştür
  if (element.css_data) {
    const cssProps = convertCustomCSS(element.css_data);
    Object.assign(props, cssProps);
  }

  // Layout data'yı ekle
  if (element.layout_data) {
    props.layout = element.layout_data;
  }

  // Element tipine özel dönüştürme
  const typeSpecificProps = convertTypeSpecificProps(element, canonicalType);
  Object.assign(props, typeSpecificProps);

  return props;
}

/**
 * Element tipine özel props dönüştürme
 */
function convertTypeSpecificProps(
  element: BackendElement,
  canonicalType: string
): Record<string, any> {
  const props: Record<string, any> = {};

  switch (canonicalType) {
    case 'heading':
      return convertHeadingProps(element);
    
    case 'text':
      return convertTextProps(element);
    
    case 'button':
      return convertButtonProps(element);
    
    case 'image':
      return convertImageProps(element);
    
    case 'section':
      return convertSectionProps(element);
    
    case 'column':
      return convertColumnProps(element);
    
    case 'container':
      return convertContainerProps(element);
    
    case 'spacer':
      return convertSpacerProps(element);
    
    case 'break':
      return convertBreakProps(element);
    
    case 'video':
      return convertVideoProps(element);
    
    case 'gallery':
      return convertGalleryProps(element);
    
    case 'slider':
      return convertSliderProps(element);
    
    case 'shortcode':
      return convertShortcodeProps(element);
    
    default:
      // Generic conversion
      return convertGenericProps(element);
  }
}

/**
 * Heading props dönüştürme
 */
function convertHeadingProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.responsive?.desktop) {
    const desktop = element.responsive.desktop;
    
    props.text = desktop.title || element.content?.text || 'Heading';
    props.level = desktop.header_size || element.content?.tag || 'h2';
    props.align = desktop.align || element.content?.alignment || 'left';
    props.size = getHeadingSize(desktop.typography_font_size);
    
    if (desktop.title_color) {
      props.color = desktop.title_color;
    }
  }

  return props;
}

/**
 * Text props dönüştürme
 */
function convertTextProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.responsive?.desktop) {
    const desktop = element.responsive.desktop;
    
    props.text = desktop.editor || element.content?.html || element.content?.text || 'Text';
    props.align = desktop.align || element.content?.alignment || 'left';
    props.size = getTextSize(desktop.typography_font_size);
    
    if (desktop.text_color) {
      props.color = desktop.text_color;
    }
  }

  return props;
}

/**
 * Button props dönüştürme
 */
function convertButtonProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.responsive?.desktop) {
    const desktop = element.responsive.desktop;
    
    props.label = desktop.button_text || element.content?.text || 'Button';
    props.href = desktop.button_link?.url || element.content?.link?.url || '#';
    props.variant = getButtonVariant(desktop.button_type || element.content?.type);
    
    if (desktop.button_color) {
      props.backgroundColor = desktop.button_color;
    }
    if (desktop.button_text_color) {
      props.textColor = desktop.button_text_color;
    }
  }

  return props;
}

/**
 * Image props dönüştürme
 */
function convertImageProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.responsive?.desktop) {
    const desktop = element.responsive.desktop;
    
    if (desktop.image) {
      props.src = desktop.image.url;
      props.alt = desktop.image.alt || '';
      props.title = desktop.image.title || '';
    }
    
    if (desktop.image_link?.url) {
      props.href = desktop.image_link.url;
    }
  }

  return props;
}

/**
 * Section props dönüştürme
 */
function convertSectionProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content?.layout) {
    props.layout = element.content.layout;
  }

  if (element.responsive?.desktop) {
    const desktop = element.responsive.desktop;
    
    if (desktop.background_color) {
      props.backgroundColor = desktop.background_color;
    }
    
    if (desktop.background_image) {
      props.backgroundImage = desktop.background_image.url;
    }
  }

  return props;
}

/**
 * Column props dönüştürme
 */
function convertColumnProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content?.width) {
    props.width = element.content.width;
  }

  return props;
}

/**
 * Container props dönüştürme
 */
function convertContainerProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content) {
    Object.assign(props, element.content);
  }

  return props;
}

/**
 * Spacer props dönüştürme
 */
function convertSpacerProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.responsive?.desktop?.height) {
    props.size = element.responsive.desktop.height;
  } else if (element.content?.attributes?.height) {
    props.size = element.content.attributes.height;
  } else {
    props.size = '36px';
  }

  return props;
}

/**
 * Break props dönüştürme
 */
function convertBreakProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content) {
    props.style = element.content.style || 'solid';
    props.width = element.content.width || '100%';
    props.height = element.content.height || '1px';
    props.color = element.content.color || '#e0e0e0';
  }

  return props;
}

/**
 * Video props dönüştürme
 */
function convertVideoProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content && Array.isArray(element.content)) {
    const videoData = element.content[0];
    if (videoData) {
      props.videoUrl = videoData.video_url;
      props.videoType = videoData.video_type;
      props.autoplay = videoData.autoplay || false;
      props.controls = videoData.controls !== false;
      props.mute = videoData.mute || false;
    }
  }

  return props;
}

/**
 * Gallery props dönüştürme
 */
function convertGalleryProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content) {
    props.images = element.content.images || [];
    props.columns = element.content.columns || 3;
    props.size = element.content.size || 'medium';
  }

  return props;
}

/**
 * Slider props dönüştürme
 */
function convertSliderProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content) {
    props.type = element.content.type || 'fade';
    props.autoplay = element.content.autoplay || false;
    props.interval = element.content.interval || 3000;
    props.showDots = element.content.show_dots || false;
    props.showArrows = element.content.show_arrows || true;
    props.sliders = element.content.sliders || [];
  }

  return props;
}

/**
 * Shortcode props dönüştürme
 */
function convertShortcodeProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element._original_shortcode) {
    props.shortcode = element._original_shortcode;
  }

  if (element.content) {
    Object.assign(props, element.content);
  }

  return props;
}

/**
 * Generic props dönüştürme
 */
function convertGenericProps(element: BackendElement): Record<string, any> {
  const props: Record<string, any> = {};

  if (element.content) {
    Object.assign(props, element.content);
  }

  return props;
}

/**
 * Helper functions
 */
function getHeadingSize(fontSize: any): string {
  if (!fontSize || !fontSize.size) return 'm';
  
  const size = parseInt(fontSize.size);
  if (size >= 48) return 'xxxl';
  if (size >= 40) return 'xxl';
  if (size >= 32) return 'xl';
  if (size >= 24) return 'l';
  if (size >= 20) return 'm';
  if (size >= 16) return 's';
  return 'xs';
}

function getTextSize(fontSize: any): string {
  if (!fontSize || !fontSize.size) return 'm';
  
  const size = parseInt(fontSize.size);
  if (size >= 18) return 'l';
  if (size >= 16) return 'm';
  return 's';
}

function getButtonVariant(type: string): string {
  switch (type) {
    case 'filled':
    case 'primary':
      return 'primary';
    case 'outline':
    case 'secondary':
      return 'secondary';
    default:
      return 'primary';
  }
}
