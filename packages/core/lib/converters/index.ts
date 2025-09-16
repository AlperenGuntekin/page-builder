/**
 * Backend to Puck Converters
 * Ana export dosyası
 */

// Types
export type {
  BackendElement,
  PuckComponentProps,
  ConverterOptions,
  CacheEntry,
  Breakpoint
} from './types';

export { BREAKPOINTS } from './types';

// Main converter functions
export {
  convertBackendBlocksToPuck,
  convertSingleElement,
  clearConverterCache,
  getCacheStats,
  convertBatch,
  validateBackendElements,
  sortElementsByDepth,
  buildElementHierarchy
} from './blocks-to-puck';

// Element converter
export {
  convertElementWithCache
} from './element-converter';

// Responsive converter
export {
  convertResponsiveData,
  getResponsiveBreakpoints,
  createMediaQuery,
  convertResponsivePropsToCSS
} from './responsive-converter';

// CSS converter
export {
  convertCustomCSS,
  parseCustomCSS,
  convertReactStyleToCSS,
  parseCustomClasses,
  convertCustomClassesToString,
  extractCustomCSS,
  applyCustomCSS,
  validateCSS
} from './css-converter';

// Shortcode detector
export {
  detectShortcodeType,
  parseShortcodeParams,
  convertShortcodeToRenderable,
  getSupportedShortcodeTypes,
  isSupportedShortcodeType
} from './shortcode-detector';

// Type aliases
export {
  TYPE_ALIASES,
  REVERSE_TYPE_ALIASES,
  getCanonicalType,
  getBackendType,
  isSupportedType
} from './type-aliases';

// Puck to Backend converter
export {
  convertPuckToBackend,
  convertPuckComponentToBackend,
  createTemplateData,
  convertPuckBatch,
  validatePuckComponents,
  sortPuckComponentsByDepth,
  buildPuckHierarchy,
  optimizePuckComponents,
  compressPuckComponents,
  decompressPuckComponents
} from './puck-to-backend';
