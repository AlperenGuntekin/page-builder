/**
 * Backend to Puck Converter
 * WordPress/Elementor backend verilerini Puck formatına dönüştürür
 */

import { BackendElement, PuckComponentProps, ConverterOptions, CacheEntry } from './types';
import { getCanonicalType, isSupportedType } from './type-aliases';
import { convertElementWithCache } from './element-converter';
import { detectShortcodeType } from './shortcode-detector';

// Global cache for converted elements
const elementCache = new Map<string, CacheEntry>();

/**
 * Ana dönüştürme fonksiyonu
 * Backend element array'ini Puck formatına dönüştürür
 */
export function convertBackendBlocksToPuck(
  backendElements: BackendElement[],
  options: ConverterOptions = {}
): PuckComponentProps[] {
  const {
    enableCache = true,
    preserveOriginalData = false,
    customMappings = {}
  } = options;

  // Custom mappings'i geçici olarak TYPE_ALIASES'e ekle
  if (Object.keys(customMappings).length > 0) {
    Object.entries(customMappings).forEach(([key, value]) => {
      if (!isSupportedType(key)) {
        console.warn(`Custom mapping for unsupported type: ${key} -> ${value}`);
      }
    });
  }

  try {
    const convertedElements = backendElements.map((element, index) => {
      return convertElementWithCache(element, {
        enableCache,
        preserveOriginalData,
        customMappings,
        parentIndex: index
      });
    });

    return convertedElements.filter(Boolean) as PuckComponentProps[];
  } catch (error) {
    console.error('Error converting backend blocks to Puck:', error);
    return [];
  }
}

/**
 * Tek bir element'i dönüştürür
 */
export function convertSingleElement(
  element: BackendElement,
  options: ConverterOptions = {}
): PuckComponentProps | null {
  try {
    return convertElementWithCache(element, options);
  } catch (error) {
    console.error(`Error converting element ${element.id}:`, error);
    return null;
  }
}

/**
 * Cache'i temizler
 */
export function clearConverterCache(): void {
  elementCache.clear();
}

/**
 * Cache istatistiklerini döndürür
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: elementCache.size,
    entries: Array.from(elementCache.keys())
  };
}

/**
 * Element'leri batch olarak dönüştürür (performans için)
 */
export function convertBatch(
  elements: BackendElement[],
  batchSize: number = 10,
  options: ConverterOptions = {}
): Promise<PuckComponentProps[]> {
  return new Promise((resolve, reject) => {
    try {
      const results: PuckComponentProps[] = [];
      
      for (let i = 0; i < elements.length; i += batchSize) {
        const batch = elements.slice(i, i + batchSize);
        const convertedBatch = convertBackendBlocksToPuck(batch, options);
        results.push(...convertedBatch);
      }
      
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Element'lerin geçerliliğini kontrol eder
 */
export function validateBackendElements(elements: BackendElement[]): {
  valid: BackendElement[];
  invalid: { element: BackendElement; error: string }[];
} {
  const valid: BackendElement[] = [];
  const invalid: { element: BackendElement; error: string }[] = [];

  elements.forEach(element => {
    const errors: string[] = [];

    // Zorunlu alanları kontrol et
    if (!element.id) {
      errors.push('Missing required field: id');
    }
    if (!element.type) {
      errors.push('Missing required field: type');
    }
    if (typeof element.depth !== 'number') {
      errors.push('Missing or invalid field: depth');
    }

    // Tip desteğini kontrol et
    if (!isSupportedType(element.type)) {
      errors.push(`Unsupported element type: ${element.type}`);
    }

    // ID benzersizliğini kontrol et
    if (valid.some(e => e.id === element.id)) {
      errors.push(`Duplicate element ID: ${element.id}`);
    }

    if (errors.length > 0) {
      invalid.push({
        element,
        error: errors.join(', ')
      });
    } else {
      valid.push(element);
    }
  });

  return { valid, invalid };
}

/**
 * Element'leri derinlik sırasına göre sıralar
 */
export function sortElementsByDepth(elements: BackendElement[]): BackendElement[] {
  return [...elements].sort((a, b) => a.depth - b.depth);
}

/**
 * Element'leri hiyerarşik yapıya dönüştürür
 */
export function buildElementHierarchy(elements: BackendElement[]): BackendElement[] {
  const sorted = sortElementsByDepth(elements);
  const hierarchy: BackendElement[] = [];
  const parentMap = new Map<number, BackendElement[]>();

  sorted.forEach(element => {
    if (element.depth === 0) {
      hierarchy.push(element);
    } else {
      const parentDepth = element.depth - 1;
      if (!parentMap.has(parentDepth)) {
        parentMap.set(parentDepth, []);
      }
      parentMap.get(parentDepth)!.push(element);
    }
  });

  // Children'ları parent'lara ata
  const assignChildren = (parent: BackendElement, depth: number) => {
    const children = parentMap.get(depth) || [];
    if (children.length > 0) {
      parent.children = children;
      children.forEach(child => {
        assignChildren(child, depth + 1);
      });
    }
  };

  hierarchy.forEach(root => {
    assignChildren(root, 1);
  });

  return hierarchy;
}
