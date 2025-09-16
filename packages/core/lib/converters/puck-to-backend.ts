/**
 * Puck to Backend Converter
 * Puck formatındaki verileri backend formatına dönüştürür
 */

import { PuckComponentProps, BackendElement } from './types';
import { getBackendType } from './type-aliases';
import { convertPuckPropsToBackend } from './puck-props-converter';

/**
 * Puck component'lerini backend formatına dönüştürür
 */
export function convertPuckToBackend(
  puckComponents: PuckComponentProps[],
  options: {
    preserveOriginalData?: boolean;
    generateIds?: boolean;
  } = {}
): BackendElement[] {
  const { preserveOriginalData = false, generateIds = false } = options;

  try {
    const backendElements = puckComponents.map((component, index) => {
      return convertPuckComponentToBackend(component, {
        preserveOriginalData,
        generateIds,
        parentIndex: index
      });
    });

    return backendElements.filter(Boolean) as BackendElement[];
  } catch (error) {
    console.error('Error converting Puck to backend:', error);
    return [];
  }
}

/**
 * Tek bir Puck component'ini backend formatına dönüştürür
 */
export function convertPuckComponentToBackend(
  component: PuckComponentProps,
  options: {
    preserveOriginalData?: boolean;
    generateIds?: boolean;
    parentIndex?: number;
    depth?: number;
  } = {}
): BackendElement | null {
  const {
    preserveOriginalData = false,
    generateIds = false,
    parentIndex = 0,
    depth = 0
  } = options;

  try {
    // Backend type'ı al
    const backendType = getBackendType(component.type);
    
    // Props'ları backend formatına dönüştür
    const { content, responsive, cssData } = convertPuckPropsToBackend(
      component.props,
      component.type
    );

    // Children'ları dönüştür
    const children = component.children?.map((child, index) => 
      convertPuckComponentToBackend(child, {
        preserveOriginalData,
        generateIds,
        parentIndex: index,
        depth: depth + 1
      })
    ).filter(Boolean) as BackendElement[] || [];

    const result: BackendElement = {
      id: component.id,
      type: backendType,
      depth: depth,
      content: content,
      responsive: responsive,
      css_data: cssData,
      children: children.length > 0 ? children : undefined
    };

    // Original data'yı koru (debug için)
    if (preserveOriginalData) {
      result._original_attributes = {
        puckType: component.type,
        puckProps: component.props
      };
    }

    return result;
  } catch (error) {
    console.error(`Error converting Puck component ${component.id}:`, error);
    return null;
  }
}

/**
 * Puck data'yı template formatına dönüştürür
 */
export function createTemplateData(
  puckComponents: PuckComponentProps[],
  templateName: string = 'Template'
): {
  name: string;
  elements: BackendElement[];
  metadata: {
    created: string;
    updated: string;
    version: string;
  };
} {
  const elements = convertPuckToBackend(puckComponents, {
    preserveOriginalData: true,
    generateIds: true
  });

  return {
    name: templateName,
    elements: elements,
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

/**
 * Puck component'lerini batch olarak dönüştürür
 */
export function convertPuckBatch(
  components: PuckComponentProps[],
  batchSize: number = 10,
  options: {
    preserveOriginalData?: boolean;
    generateIds?: boolean;
  } = {}
): Promise<BackendElement[]> {
  return new Promise((resolve, reject) => {
    try {
      const results: BackendElement[] = [];
      
      for (let i = 0; i < components.length; i += batchSize) {
        const batch = components.slice(i, i + batchSize);
        const convertedBatch = convertPuckToBackend(batch, options);
        results.push(...convertedBatch);
      }
      
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Puck component'lerinin geçerliliğini kontrol eder
 */
export function validatePuckComponents(components: PuckComponentProps[]): {
  valid: PuckComponentProps[];
  invalid: { component: PuckComponentProps; error: string }[];
} {
  const valid: PuckComponentProps[] = [];
  const invalid: { component: PuckComponentProps; error: string }[] = [];

  components.forEach(component => {
    const errors: string[] = [];

    // Zorunlu alanları kontrol et
    if (!component.id) {
      errors.push('Missing required field: id');
    }
    if (!component.type) {
      errors.push('Missing required field: type');
    }
    if (!component.props || typeof component.props !== 'object') {
      errors.push('Missing or invalid field: props');
    }

    // ID benzersizliğini kontrol et
    if (valid.some(c => c.id === component.id)) {
      errors.push(`Duplicate component ID: ${component.id}`);
    }

    // Children'ları recursive olarak kontrol et
    if (component.children) {
      const childrenValidation = validatePuckComponents(component.children);
      if (childrenValidation.invalid.length > 0) {
        errors.push(`Invalid children: ${childrenValidation.invalid.length} errors`);
      }
    }

    if (errors.length > 0) {
      invalid.push({
        component,
        error: errors.join(', ')
      });
    } else {
      valid.push(component);
    }
  });

  return { valid, invalid };
}

/**
 * Puck component'lerini derinlik sırasına göre sıralar
 */
export function sortPuckComponentsByDepth(components: PuckComponentProps[]): PuckComponentProps[] {
  const flattenComponents = (comps: PuckComponentProps[], depth: number = 0): Array<{ component: PuckComponentProps; depth: number }> => {
    const result: Array<{ component: PuckComponentProps; depth: number }> = [];
    
    comps.forEach(comp => {
      result.push({ component: comp, depth });
      if (comp.children) {
        result.push(...flattenComponents(comp.children, depth + 1));
      }
    });
    
    return result;
  };

  const flattened = flattenComponents(components);
  return flattened
    .sort((a, b) => a.depth - b.depth)
    .map(item => item.component);
}

/**
 * Puck component'lerini hiyerarşik yapıya dönüştürür
 */
export function buildPuckHierarchy(components: PuckComponentProps[]): PuckComponentProps[] {
  const sorted = sortPuckComponentsByDepth(components);
  const hierarchy: PuckComponentProps[] = [];
  const parentMap = new Map<string, PuckComponentProps[]>();

  // Root level components (depth 0)
  const rootComponents = sorted.filter(comp => {
    // Root component'ler genellikle section, container gibi layout component'lerdir
    return ['section', 'container', 'hero'].includes(comp.type);
  });

  rootComponents.forEach(root => {
    hierarchy.push(root);
    parentMap.set(root.id, []);
  });

  // Children'ları parent'lara ata
  const assignChildren = (parent: PuckComponentProps, depth: number) => {
    const children = parentMap.get(parent.id) || [];
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

/**
 * Puck component'lerini optimize eder
 */
export function optimizePuckComponents(components: PuckComponentProps[]): PuckComponentProps[] {
  return components.map(component => {
    const optimized = { ...component };
    
    // Boş props'ları temizle
    if (optimized.props) {
      optimized.props = Object.fromEntries(
        Object.entries(optimized.props).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );
    }

    // Children'ları recursive olarak optimize et
    if (optimized.children) {
      optimized.children = optimizePuckComponents(optimized.children);
    }

    return optimized;
  });
}

/**
 * Puck component'lerini compress eder
 */
export function compressPuckComponents(components: PuckComponentProps[]): string {
  try {
    return JSON.stringify(components, null, 0);
  } catch (error) {
    console.error('Error compressing Puck components:', error);
    return '';
  }
}

/**
 * Compressed Puck component'lerini decompress eder
 */
export function decompressPuckComponents(compressed: string): PuckComponentProps[] {
  try {
    return JSON.parse(compressed);
  } catch (error) {
    console.error('Error decompressing Puck components:', error);
    return [];
  }
}
