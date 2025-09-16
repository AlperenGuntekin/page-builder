/**
 * Converter Usage Examples
 * Backend to Puck ve Puck to Backend converter'larının kullanım örnekleri
 */

import {
  convertBackendBlocksToPuck,
  convertPuckToBackend,
  validateBackendElements,
  validatePuckComponents,
  detectShortcodeType,
  getCanonicalType
} from '../index';
import { BackendElement, PuckComponentProps } from '../types';

/**
 * Backend to Puck Conversion Examples
 */

// Example 1: Basic Heading Conversion
export function exampleBasicHeadingConversion() {
  const backendElement: BackendElement = {
    id: 'heading-1',
    type: 'heading',
    depth: 2,
    content: {
      text: 'Welcome to Our Website',
      tag: 'h1'
    },
    responsive: {
      desktop: {
        title: 'Welcome to Our Website',
        header_size: 'h1',
        title_color: '#2c3e50',
        align: 'center',
        typography_font_size: {
          size: 48,
          unit: 'px'
        },
        typography_font_weight: 'bold'
      },
      tablet: {
        typography_font_size: {
          size: 40,
          unit: 'px'
        }
      },
      mobile: {
        typography_font_size: {
          size: 32,
          unit: 'px'
        }
      }
    }
  };

  const result = convertBackendBlocksToPuck([backendElement]);
  console.log('Basic Heading Conversion:', result);
  return result;
}

// Example 2: Complex Section with Children
export function exampleComplexSectionConversion() {
  const backendElement: BackendElement = {
    id: 'hero-section',
    type: 'section',
    depth: 0,
    content: {
      layout: {
        structure: '20', // 2 columns
        content_width: {
          size: 1200,
          unit: 'px'
        }
      }
    },
    responsive: {
      desktop: {
        background_color: '#f8f9fa',
        background_image: {
          url: 'https://example.com/hero-bg.jpg',
          id: 123
        },
        background_position: 'center',
        background_size: 'cover',
        _padding: {
          top: 80,
          bottom: 80,
          left: 32,
          right: 32
        }
      }
    },
    children: [
      {
        id: 'hero-content',
        type: 'column',
        depth: 1,
        content: {
          width: {
            size: 60,
            unit: '%'
          }
        },
        children: [
          {
            id: 'hero-title',
            type: 'heading',
            depth: 2,
            content: {
              text: 'Build Amazing Websites',
              tag: 'h1'
            },
            responsive: {
              desktop: {
                title: 'Build Amazing Websites',
                header_size: 'h1',
                title_color: '#2c3e50',
                align: 'left',
                typography_font_size: {
                  size: 56,
                  unit: 'px'
                }
              }
            }
          },
          {
            id: 'hero-text',
            type: 'text',
            depth: 2,
            content: {
              text: '<p>Create stunning websites with our drag-and-drop page builder. No coding required!</p>',
              alignment: 'left'
            },
            responsive: {
              desktop: {
                editor: '<p>Create stunning websites with our drag-and-drop page builder. No coding required!</p>',
                text_color: '#6c757d',
                align: 'left',
                typography_font_size: {
                  size: 18,
                  unit: 'px'
                }
              }
            }
          },
          {
            id: 'hero-button',
            type: 'button',
            depth: 2,
            content: {
              text: 'Get Started',
              link: {
                url: 'https://example.com/get-started',
                is_external: false
              }
            },
            responsive: {
              desktop: {
                button_text: 'Get Started',
                button_link: {
                  url: 'https://example.com/get-started',
                  is_external: false
                },
                button_type: 'filled',
                button_color: '#007bff',
                button_text_color: '#ffffff',
                button_border_radius: {
                  size: 8,
                  unit: 'px'
                }
              }
            }
          }
        ]
      },
      {
        id: 'hero-image',
        type: 'column',
        depth: 1,
        content: {
          width: {
            size: 40,
            unit: '%'
          }
        },
        children: [
          {
            id: 'hero-img',
            type: 'image',
            depth: 2,
            content: {
              image: {
                url: 'https://example.com/hero-image.jpg',
                alt: 'Hero Image',
                title: 'Amazing Website Builder'
              }
            },
            responsive: {
              desktop: {
                image: {
                  url: 'https://example.com/hero-image.jpg',
                  alt: 'Hero Image',
                  title: 'Amazing Website Builder'
                },
                image_width: {
                  size: 100,
                  unit: '%'
                },
                image_border_radius: {
                  size: 12,
                  unit: 'px'
                }
              }
            }
          }
        ]
      }
    ]
  };

  const result = convertBackendBlocksToPuck([backendElement]);
  console.log('Complex Section Conversion:', result);
  return result;
}

// Example 3: Shortcode Detection
export function exampleShortcodeDetection() {
  const shortcodeElements = [
    {
      _original_shortcode: 'contact-form-7',
      content: { form_id: '123' }
    },
    {
      _original_shortcode: 'woocommerce_cart',
      content: {}
    },
    {
      _original_shortcode: 'social_share',
      content: { platforms: ['facebook', 'twitter'] }
    }
  ];

  const results = shortcodeElements.map(element => ({
    element,
    detectedType: detectShortcodeType(element)
  }));

  console.log('Shortcode Detection Results:', results);
  return results;
}

// Example 4: Type Alias Conversion
export function exampleTypeAliasConversion() {
  const backendTypes = [
    'ux_text',
    'core/heading',
    'elementskit-button',
    'brxe-container',
    'ct_heading',
    'fl-rich-text'
  ];

  const results = backendTypes.map(type => ({
    originalType: type,
    canonicalType: getCanonicalType(type)
  }));

  console.log('Type Alias Conversion Results:', results);
  return results;
}

/**
 * Puck to Backend Conversion Examples
 */

// Example 5: Basic Puck to Backend Conversion
export function examplePuckToBackendConversion() {
  const puckComponent: PuckComponentProps = {
    id: 'heading-1',
    type: 'heading',
    props: {
      text: 'Hello World',
      level: 'h2',
      align: 'center',
      color: '#333333',
      size: 'l'
    }
  };

  const result = convertPuckToBackend([puckComponent]);
  console.log('Puck to Backend Conversion:', result);
  return result;
}

// Example 6: Complex Puck Component with Children
export function exampleComplexPuckToBackendConversion() {
  const puckComponent: PuckComponentProps = {
    id: 'card-1',
    type: 'card',
    props: {
      title: 'Feature Card',
      description: 'This is a feature description',
      icon: 'star',
      variant: 'elevated'
    },
    children: [
      {
        id: 'card-button',
        type: 'button',
        props: {
          label: 'Learn More',
          href: 'https://example.com',
          variant: 'primary',
          size: 'm'
        }
      }
    ]
  };

  const result = convertPuckToBackend([puckComponent]);
  console.log('Complex Puck to Backend Conversion:', result);
  return result;
}

/**
 * Validation Examples
 */

// Example 7: Backend Element Validation
export function exampleBackendValidation() {
  const validElements: BackendElement[] = [
    {
      id: 'element-1',
      type: 'heading',
      depth: 2,
      content: { text: 'Valid Heading' }
    },
    {
      id: 'element-2',
      type: 'text',
      depth: 2,
      content: { text: 'Valid Text' }
    }
  ];

  const invalidElements: BackendElement[] = [
    {
      id: '',
      type: 'heading',
      depth: 2,
      content: { text: 'Invalid - No ID' }
    },
    {
      id: 'element-3',
      type: '',
      depth: 2,
      content: { text: 'Invalid - No Type' }
    }
  ];

  const validResult = validateBackendElements(validElements);
  const invalidResult = validateBackendElements(invalidElements);

  console.log('Valid Elements Result:', validResult);
  console.log('Invalid Elements Result:', invalidResult);

  return { validResult, invalidResult };
}

// Example 8: Puck Component Validation
export function examplePuckValidation() {
  const validComponents: PuckComponentProps[] = [
    {
      id: 'component-1',
      type: 'heading',
      props: { text: 'Valid Component' }
    },
    {
      id: 'component-2',
      type: 'text',
      props: { text: 'Another Valid Component' }
    }
  ];

  const invalidComponents: PuckComponentProps[] = [
    {
      id: '',
      type: 'heading',
      props: { text: 'Invalid - No ID' }
    },
    {
      id: 'component-3',
      type: '',
      props: { text: 'Invalid - No Type' }
    }
  ];

  const validResult = validatePuckComponents(validComponents);
  const invalidResult = validatePuckComponents(invalidComponents);

  console.log('Valid Components Result:', validResult);
  console.log('Invalid Components Result:', invalidResult);

  return { validResult, invalidResult };
}

/**
 * Real-world Usage Examples
 */

// Example 9: WordPress Elementor to Puck Migration
export function exampleWordPressMigration() {
  const elementorData: BackendElement[] = [
    {
      id: 'section-1',
      type: 'section',
      depth: 0,
      content: {
        layout: {
          structure: '30', // 3 columns
          content_width: {
            size: 1200,
            unit: 'px'
          }
        }
      },
      responsive: {
        desktop: {
          background_color: '#ffffff',
          _padding: {
            top: 60,
            bottom: 60,
            left: 20,
            right: 20
          }
        }
      },
      children: [
        {
          id: 'column-1',
          type: 'column',
          depth: 1,
          content: {
            width: {
              size: 33.33,
              unit: '%'
            }
          },
          children: [
            {
              id: 'icon-1',
              type: 'icon',
              depth: 2,
              content: {
                icon: 'fas fa-rocket',
                icon_type: 'fa-solid'
              },
              responsive: {
                desktop: {
                  size: {
                    size: 48,
                    unit: 'px'
                  },
                  primary_color: '#007bff'
                }
              }
            },
            {
              id: 'title-1',
              type: 'heading',
              depth: 2,
              content: {
                text: 'Fast Performance',
                tag: 'h3'
              },
              responsive: {
                desktop: {
                  title: 'Fast Performance',
                  header_size: 'h3',
                  title_color: '#2c3e50',
                  align: 'center'
                }
              }
            },
            {
              id: 'text-1',
              type: 'text',
              depth: 2,
              content: {
                text: '<p>Lightning fast loading times for better user experience.</p>',
                alignment: 'center'
              },
              responsive: {
                desktop: {
                  editor: '<p>Lightning fast loading times for better user experience.</p>',
                  text_color: '#6c757d',
                  align: 'center'
                }
              }
            }
          ]
        }
        // ... more columns
      ]
    }
  ];

  const puckData = convertBackendBlocksToPuck(elementorData);
  console.log('WordPress Migration Result:', puckData);
  return puckData;
}

// Example 10: Round-trip Conversion (Backend -> Puck -> Backend)
export function exampleRoundTripConversion() {
  const originalBackend: BackendElement = {
    id: 'test-element',
    type: 'heading',
    depth: 2,
    content: {
      text: 'Round Trip Test',
      tag: 'h2'
    },
    responsive: {
      desktop: {
        title: 'Round Trip Test',
        header_size: 'h2',
        title_color: '#000000',
        align: 'center'
      }
    }
  };

  // Backend -> Puck
  const puckData = convertBackendBlocksToPuck([originalBackend]);
  console.log('Backend -> Puck:', puckData);

  // Puck -> Backend
  const backToBackend = convertPuckToBackend(puckData);
  console.log('Puck -> Backend:', backToBackend);

  return {
    original: originalBackend,
    puck: puckData,
    backToBackend: backToBackend
  };
}

/**
 * Performance Examples
 */

// Example 11: Batch Processing
export function exampleBatchProcessing() {
  const largeBackendData: BackendElement[] = Array.from({ length: 100 }, (_, i) => ({
    id: `element-${i}`,
    type: 'text',
    depth: 2,
    content: {
      text: `Text content ${i}`
    },
    responsive: {
      desktop: {
        editor: `Text content ${i}`,
        text_color: '#333333'
      }
    }
  }));

  const startTime = performance.now();
  const result = convertBackendBlocksToPuck(largeBackendData);
  const endTime = performance.now();

  console.log(`Batch processing ${largeBackendData.length} elements took ${endTime - startTime} milliseconds`);
  console.log(`Converted ${result.length} elements successfully`);

  return {
    inputCount: largeBackendData.length,
    outputCount: result.length,
    processingTime: endTime - startTime
  };
}

/**
 * Error Handling Examples
 */

// Example 12: Error Handling
export function exampleErrorHandling() {
  const invalidData = [
    {
      id: 'invalid-1',
      type: 'unknown-type',
      depth: 2,
      content: { text: 'Invalid type' }
    },
    {
      id: 'invalid-2',
      type: 'heading',
      depth: 'invalid-depth' as any,
      content: { text: 'Invalid depth' }
    }
  ];

  try {
    const result = convertBackendBlocksToPuck(invalidData as BackendElement[]);
    console.log('Error handling result:', result);
    return result;
  } catch (error) {
    console.error('Error caught:', error);
    return [];
  }
}

/**
 * Export all examples
 */
export const examples = {
  basicHeadingConversion: exampleBasicHeadingConversion,
  complexSectionConversion: exampleComplexSectionConversion,
  shortcodeDetection: exampleShortcodeDetection,
  typeAliasConversion: exampleTypeAliasConversion,
  puckToBackendConversion: examplePuckToBackendConversion,
  complexPuckToBackendConversion: exampleComplexPuckToBackendConversion,
  backendValidation: exampleBackendValidation,
  puckValidation: examplePuckValidation,
  wordPressMigration: exampleWordPressMigration,
  roundTripConversion: exampleRoundTripConversion,
  batchProcessing: exampleBatchProcessing,
  errorHandling: exampleErrorHandling
};
