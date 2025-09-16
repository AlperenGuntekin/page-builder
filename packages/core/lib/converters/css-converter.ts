/**
 * CSS Converter
 * Backend CSS data'yı React style objelerine dönüştürür
 */

/**
 * Custom CSS data'yı dönüştürür
 */
export function convertCustomCSS(cssData: Record<string, any>): Record<string, any> {
  const styles: Record<string, any> = {};

  if (!cssData || typeof cssData !== 'object') {
    return styles;
  }

  Object.entries(cssData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const cssProperty = convertCSSKeyToReactStyle(key);
      const cssValue = convertCSSValue(value);
      
      if (cssProperty && cssValue !== undefined) {
        styles[cssProperty] = cssValue;
      }
    }
  });

  return styles;
}

/**
 * CSS string'ini parse eder ve React style objesine dönüştürür
 */
export function parseCustomCSS(cssString: string): Record<string, any> {
  const styles: Record<string, any> = {};

  if (!cssString || typeof cssString !== 'string') {
    return styles;
  }

  try {
    // Basit CSS parser (property: value; formatı için)
    const rules = cssString.split(';').filter(rule => rule.trim());
    
    rules.forEach(rule => {
      const [property, value] = rule.split(':').map(part => part.trim());
      
      if (property && value) {
        const reactProperty = convertCSSKeyToReactStyle(property);
        const reactValue = convertCSSValue(value);
        
        if (reactProperty && reactValue !== undefined) {
          styles[reactProperty] = reactValue;
        }
      }
    });
  } catch (error) {
    console.warn('Error parsing CSS string:', error);
  }

  return styles;
}

/**
 * CSS key'ini React style property'ye dönüştürür
 */
function convertCSSKeyToReactStyle(cssKey: string): string {
  // Kebab-case to camelCase conversion
  return cssKey.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * CSS value'yu React style value'ya dönüştürür
 */
function convertCSSValue(value: any): any {
  if (typeof value === 'string') {
    // String değerleri temizle
    const cleanValue = value.trim().replace(/['"]/g, '');
    
    // Numeric değerleri kontrol et
    if (/^\d+(\.\d+)?(px|em|rem|%|vh|vw)$/.test(cleanValue)) {
      return cleanValue;
    }
    
    // Color değerleri
    if (/^#[0-9a-fA-F]{3,6}$/.test(cleanValue) || 
        /^rgb\(/.test(cleanValue) || 
        /^rgba\(/.test(cleanValue) ||
        /^hsl\(/.test(cleanValue) ||
        /^hsla\(/.test(cleanValue)) {
      return cleanValue;
    }
    
    // Boolean değerler
    if (cleanValue === 'true') return true;
    if (cleanValue === 'false') return false;
    
    // Numeric değerler
    if (/^\d+(\.\d+)?$/.test(cleanValue)) {
      return parseFloat(cleanValue);
    }
    
    return cleanValue;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  return value;
}

/**
 * React style objesini CSS string'e dönüştürür
 */
export function convertReactStyleToCSS(styles: Record<string, any>): string {
  const cssProperties: string[] = [];

  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const cssProperty = convertReactStyleToCSSKey(key);
      const cssValue = convertReactStyleToCSSValue(value);
      
      if (cssProperty && cssValue !== undefined) {
        cssProperties.push(`${cssProperty}: ${cssValue};`);
      }
    }
  });

  return cssProperties.join(' ');
}

/**
 * React style key'ini CSS property'ye dönüştürür
 */
function convertReactStyleToCSSKey(reactKey: string): string {
  // camelCase to kebab-case conversion
  return reactKey.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * React style value'yu CSS value'ya dönüştürür
 */
function convertReactStyleToCSSValue(value: any): string {
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

/**
 * CSS class'larını parse eder
 */
export function parseCustomClasses(customClasses: string[]): string[] {
  if (!Array.isArray(customClasses)) {
    return [];
  }
  
  return customClasses.filter(className => 
    typeof className === 'string' && className.trim().length > 0
  ).map(className => className.trim());
}

/**
 * CSS class'larını string'e dönüştürür
 */
export function convertCustomClassesToString(customClasses: string[]): string {
  return parseCustomClasses(customClasses).join(' ');
}

/**
 * Element'ten custom CSS'leri çıkarır
 */
export function extractCustomCSS(element: any): {
  styles: Record<string, any>;
  classes: string[];
  cssString: string;
} {
  const result = {
    styles: {} as Record<string, any>,
    classes: [] as string[],
    cssString: ''
  };

  // CSS data'dan styles çıkar
  if (element.css_data) {
    result.styles = convertCustomCSS(element.css_data);
  }

  // Custom classes'ları çıkar
  if (element.custom_classes) {
    result.classes = parseCustomClasses(element.custom_classes);
  }

  // Custom classes CSS'ini çıkar
  if (element.custom_classes_css) {
    result.cssString = convertCustomClassesCSS(element.custom_classes_css);
  }

  return result;
}

/**
 * Custom classes CSS'ini dönüştürür
 */
function convertCustomClassesCSS(customClassesCSS: Record<string, any>): string {
  const cssRules: string[] = [];

  Object.entries(customClassesCSS).forEach(([className, styles]) => {
    if (styles && typeof styles === 'object') {
      const cssProperties: string[] = [];
      
      Object.entries(styles).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const cssProperty = convertCSSKeyToReactStyle(key);
          const cssValue = convertCSSValue(value);
          
          if (cssProperty && cssValue !== undefined) {
            cssProperties.push(`${cssProperty}: ${cssValue};`);
          }
        }
      });
      
      if (cssProperties.length > 0) {
        cssRules.push(`.${className} { ${cssProperties.join(' ')} }`);
      }
    }
  });

  return cssRules.join('\n');
}

/**
 * CSS'i React component'e uygular
 */
export function applyCustomCSS(
  element: any,
  baseStyles: Record<string, any> = {}
): {
  style: Record<string, any>;
  className: string;
} {
  const extracted = extractCustomCSS(element);
  
  return {
    style: {
      ...baseStyles,
      ...extracted.styles
    },
    className: extracted.classes.join(' ')
  };
}

/**
 * CSS validation
 */
export function validateCSS(cssString: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (typeof cssString !== 'string') {
    errors.push('CSS must be a string');
    return { isValid: false, errors };
  }
  
  try {
    // Basit CSS syntax kontrolü
    const rules = cssString.split(';').filter(rule => rule.trim());
    
    rules.forEach((rule, index) => {
      const [property, value] = rule.split(':').map(part => part.trim());
      
      if (!property || !value) {
        errors.push(`Invalid CSS rule at position ${index}: ${rule}`);
      }
    });
  } catch (error) {
    errors.push(`CSS parsing error: ${error}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
