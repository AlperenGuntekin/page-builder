/**
 * Responsive Converter
 * Backend responsive data'yı Puck formatına dönüştürür
 */

import { BREAKPOINTS, Breakpoint } from './types';

/**
 * Responsive data'yı dönüştürür
 */
export function convertResponsiveData(responsive: {
  mobile?: Record<string, any>;
  tablet?: Record<string, any>;
  desktop?: Record<string, any>;
}): Record<string, any> {
  const props: Record<string, any> = {};

  // Desktop data'yı temel props olarak kullan
  if (responsive.desktop) {
    Object.assign(props, convertBreakpointData(responsive.desktop, 'desktop'));
  }

  // Tablet ve mobile için responsive props ekle
  if (responsive.tablet) {
    props.tablet = convertBreakpointData(responsive.tablet, 'tablet');
  }

  if (responsive.mobile) {
    props.mobile = convertBreakpointData(responsive.mobile, 'mobile');
  }

  return props;
}

/**
 * Breakpoint data'yı dönüştürür
 */
function convertBreakpointData(
  data: Record<string, any>,
  breakpoint: Breakpoint
): Record<string, any> {
  const converted: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    const convertedKey = convertPropertyKey(key, breakpoint);
    const convertedValue = convertPropertyValue(key, value, breakpoint);
    
    if (convertedKey && convertedValue !== undefined) {
      converted[convertedKey] = convertedValue;
    }
  });

  return converted;
}

/**
 * Property key'ini dönüştürür
 */
function convertPropertyKey(key: string, breakpoint: Breakpoint): string {
  // Typography properties
  if (key.startsWith('typography_')) {
    const prop = key.replace('typography_', '');
    switch (prop) {
      case 'font_family':
        return 'fontFamily';
      case 'font_size':
        return 'fontSize';
      case 'font_weight':
        return 'fontWeight';
      case 'line_height':
        return 'lineHeight';
      case 'letter_spacing':
        return 'letterSpacing';
      case 'word_spacing':
        return 'wordSpacing';
      default:
        return prop;
    }
  }

  // Spacing properties
  if (key.startsWith('_padding') || key.startsWith('_margin')) {
    return key.replace('_', '');
  }

  // Background properties
  if (key.startsWith('background_')) {
    const prop = key.replace('background_', '');
    switch (prop) {
      case 'color':
        return 'backgroundColor';
      case 'image':
        return 'backgroundImage';
      case 'position':
        return 'backgroundPosition';
      case 'size':
        return 'backgroundSize';
      case 'repeat':
        return 'backgroundRepeat';
      case 'gradient_angle':
        return 'backgroundGradientAngle';
      case 'color_b':
        return 'backgroundGradientColor';
      default:
        return prop;
    }
  }

  // Button properties
  if (key.startsWith('button_')) {
    const prop = key.replace('button_', '');
    switch (prop) {
      case 'text':
        return 'label';
      case 'link':
        return 'href';
      case 'type':
        return 'variant';
      case 'size':
        return 'size';
      case 'color':
        return 'backgroundColor';
      case 'text_color':
        return 'textColor';
      case 'border_radius':
        return 'borderRadius';
      default:
        return prop;
    }
  }

  // Image properties
  if (key.startsWith('image_')) {
    const prop = key.replace('image_', '');
    switch (prop) {
      case 'link':
        return 'href';
      case 'size':
        return 'size';
      case 'border_radius':
        return 'borderRadius';
      case 'width':
        return 'width';
      case 'height':
        return 'height';
      default:
        return prop;
    }
  }

  // Gallery properties
  if (key.startsWith('gallery_')) {
    const prop = key.replace('gallery_', '');
    switch (prop) {
      case 'gap':
        return 'gap';
      case 'columns':
        return 'columns';
      default:
        return prop;
    }
  }

  // Slider properties
  if (key.startsWith('slider_')) {
    const prop = key.replace('slider_', '');
    switch (prop) {
      case 'nav_style':
        return 'navStyle';
      case 'nav_position':
        return 'navPosition';
      default:
        return prop;
    }
  }

  // Generic conversions
  switch (key) {
    case 'title':
      return 'text';
    case 'header_size':
      return 'level';
    case 'align':
      return 'align';
    case 'text_color':
      return 'color';
    case 'title_color':
      return 'color';
    case 'editor':
      return 'text';
    case 'height':
      return 'size';
    default:
      return key;
  }
}

/**
 * Property value'yu dönüştürür
 */
function convertPropertyValue(
  key: string,
  value: any,
  breakpoint: Breakpoint
): any {
  // Size objects (font-size, width, height, etc.)
  if (value && typeof value === 'object' && 'size' in value && 'unit' in value) {
    return `${value.size}${value.unit}`;
  }

  // Padding/Margin objects
  if (key.startsWith('_padding') || key.startsWith('_margin')) {
    if (value && typeof value === 'object') {
      const { top, right, bottom, left, unit = 'px' } = value;
      if (top === right && right === bottom && bottom === left) {
        return `${top}${unit}`;
      }
      return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`;
    }
  }

  // Background image objects
  if (key === 'background_image' && value && typeof value === 'object') {
    return value.url || value;
  }

  // Link objects
  if (key.includes('link') && value && typeof value === 'object') {
    return value.url || value;
  }

  // Color values
  if (key.includes('color') && typeof value === 'string') {
    return value;
  }

  // Boolean values
  if (typeof value === 'boolean') {
    return value;
  }

  // Number values
  if (typeof value === 'number') {
    return value;
  }

  // String values
  if (typeof value === 'string') {
    return value;
  }

  // Array values
  if (Array.isArray(value)) {
    return value;
  }

  // Object values
  if (value && typeof value === 'object') {
    return value;
  }

  return value;
}

/**
 * Responsive breakpoint'leri döndürür
 */
export function getResponsiveBreakpoints(): typeof BREAKPOINTS {
  return BREAKPOINTS;
}

/**
 * Breakpoint'e göre media query oluşturur
 */
export function createMediaQuery(breakpoint: Breakpoint): string {
  const { min, max } = BREAKPOINTS[breakpoint];
  
  if (max === Infinity) {
    return `@media (min-width: ${min}px)`;
  }
  
  return `@media (min-width: ${min}px) and (max-width: ${max}px)`;
}

/**
 * Responsive props'ları CSS'e dönüştürür
 */
export function convertResponsivePropsToCSS(props: Record<string, any>): string {
  const cssRules: string[] = [];

  // Desktop styles (base)
  const desktopProps = { ...props };
  delete desktopProps.tablet;
  delete desktopProps.mobile;

  if (Object.keys(desktopProps).length > 0) {
    const desktopCSS = convertPropsToCSS(desktopProps);
    if (desktopCSS) {
      cssRules.push(desktopCSS);
    }
  }

  // Tablet styles
  if (props.tablet) {
    const tabletCSS = convertPropsToCSS(props.tablet);
    if (tabletCSS) {
      cssRules.push(`${createMediaQuery('tablet')} { ${tabletCSS} }`);
    }
  }

  // Mobile styles
  if (props.mobile) {
    const mobileCSS = convertPropsToCSS(props.mobile);
    if (mobileCSS) {
      cssRules.push(`${createMediaQuery('mobile')} { ${mobileCSS} }`);
    }
  }

  return cssRules.join('\n');
}

/**
 * Props'ları CSS'e dönüştürür
 */
function convertPropsToCSS(props: Record<string, any>): string {
  const cssProperties: string[] = [];

  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const cssProperty = convertKeyToCSSProperty(key);
      const cssValue = convertValueToCSSValue(value);
      
      if (cssProperty && cssValue) {
        cssProperties.push(`${cssProperty}: ${cssValue};`);
      }
    }
  });

  return cssProperties.join(' ');
}

/**
 * Key'i CSS property'ye dönüştürür
 */
function convertKeyToCSSProperty(key: string): string {
  // Camel case to kebab case
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Value'yu CSS value'ya dönüştürür
 */
function convertValueToCSSValue(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  
  return String(value);
}
