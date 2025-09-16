/**
 * Converter Tests
 * Backend to Puck converter'larını test eder
 */

import {
  convertBackendBlocksToPuck,
  convertSingleElement,
  validateBackendElements,
  detectShortcodeType,
  getCanonicalType
} from '../index';
import { BackendElement } from '../types';

describe('Backend to Puck Converters', () => {
  describe('convertBackendBlocksToPuck', () => {
    it('should convert basic heading element', () => {
      const backendElement: BackendElement = {
        id: 'heading-1',
        type: 'heading',
        depth: 2,
        content: {
          text: 'Test Heading',
          tag: 'h1'
        },
        responsive: {
          desktop: {
            title: 'Test Heading',
            header_size: 'h1',
            title_color: '#000000',
            align: 'center'
          }
        }
      };

      const result = convertBackendBlocksToPuck([backendElement]);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('heading-1');
      expect(result[0].type).toBe('heading');
      expect(result[0].props.text).toBe('Test Heading');
      expect(result[0].props.level).toBe('h1');
      expect(result[0].props.color).toBe('#000000');
      expect(result[0].props.align).toBe('center');
    });

    it('should convert text element', () => {
      const backendElement: BackendElement = {
        id: 'text-1',
        type: 'text',
        depth: 2,
        content: {
          text: '<p>Test paragraph</p>',
          alignment: 'left'
        },
        responsive: {
          desktop: {
            editor: '<p>Test paragraph</p>',
            text_color: '#333333',
            align: 'left',
            typography_font_size: {
              size: 16,
              unit: 'px'
            }
          }
        }
      };

      const result = convertBackendBlocksToPuck([backendElement]);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('text-1');
      expect(result[0].type).toBe('text');
      expect(result[0].props.text).toBe('<p>Test paragraph</p>');
      expect(result[0].props.color).toBe('#333333');
      expect(result[0].props.align).toBe('left');
    });

    it('should convert button element', () => {
      const backendElement: BackendElement = {
        id: 'button-1',
        type: 'button',
        depth: 2,
        content: {
          text: 'Click Me',
          link: {
            url: 'https://example.com',
            is_external: false
          }
        },
        responsive: {
          desktop: {
            button_text: 'Click Me',
            button_link: {
              url: 'https://example.com',
              is_external: false
            },
            button_type: 'filled',
            button_color: '#007bff',
            button_text_color: '#ffffff'
          }
        }
      };

      const result = convertBackendBlocksToPuck([backendElement]);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('button-1');
      expect(result[0].type).toBe('button');
      expect(result[0].props.label).toBe('Click Me');
      expect(result[0].props.href).toBe('https://example.com');
      expect(result[0].props.variant).toBe('primary');
      expect(result[0].props.backgroundColor).toBe('#007bff');
      expect(result[0].props.textColor).toBe('#ffffff');
    });

    it('should convert section with children', () => {
      const backendElement: BackendElement = {
        id: 'section-1',
        type: 'section',
        depth: 0,
        content: {
          layout: {
            structure: '20',
            content_width: {
              size: 1200,
              unit: 'px'
            }
          }
        },
        responsive: {
          desktop: {
            background_color: '#f8f9fa',
            _padding: {
              top: 64,
              bottom: 64,
              left: 32,
              right: 32
            }
          }
        },
        children: [
          {
            id: 'heading-1',
            type: 'heading',
            depth: 1,
            content: {
              text: 'Section Title',
              tag: 'h2'
            },
            responsive: {
              desktop: {
                title: 'Section Title',
                header_size: 'h2',
                title_color: '#000000'
              }
            }
          }
        ]
      };

      const result = convertBackendBlocksToPuck([backendElement]);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('section-1');
      expect(result[0].type).toBe('section');
      expect(result[0].props.backgroundColor).toBe('#f8f9fa');
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children![0].id).toBe('heading-1');
      expect(result[0].children![0].type).toBe('heading');
    });
  });

  describe('convertSingleElement', () => {
    it('should convert single element', () => {
      const backendElement: BackendElement = {
        id: 'image-1',
        type: 'image',
        depth: 2,
        content: {
          image: {
            url: 'https://example.com/image.jpg',
            alt: 'Test image'
          }
        },
        responsive: {
          desktop: {
            image: {
              url: 'https://example.com/image.jpg',
              alt: 'Test image',
              title: 'Image title'
            },
            image_width: {
              size: 100,
              unit: '%'
            }
          }
        }
      };

      const result = convertSingleElement(backendElement);
      
      expect(result).not.toBeNull();
      expect(result!.id).toBe('image-1');
      expect(result!.type).toBe('image');
      expect(result!.props.src).toBe('https://example.com/image.jpg');
      expect(result!.props.alt).toBe('Test image');
      expect(result!.props.title).toBe('Image title');
    });
  });

  describe('validateBackendElements', () => {
    it('should validate correct elements', () => {
      const validElements: BackendElement[] = [
        {
          id: 'element-1',
          type: 'heading',
          depth: 2,
          content: { text: 'Test' }
        },
        {
          id: 'element-2',
          type: 'text',
          depth: 2,
          content: { text: 'Test' }
        }
      ];

      const result = validateBackendElements(validElements);
      
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(0);
    });

    it('should detect invalid elements', () => {
      const invalidElements: BackendElement[] = [
        {
          id: '',
          type: 'heading',
          depth: 2,
          content: { text: 'Test' }
        },
        {
          id: 'element-2',
          type: '',
          depth: 2,
          content: { text: 'Test' }
        },
        {
          id: 'element-3',
          type: 'heading',
          depth: 'invalid' as any,
          content: { text: 'Test' }
        }
      ];

      const result = validateBackendElements(invalidElements);
      
      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(3);
    });
  });

  describe('detectShortcodeType', () => {
    it('should detect contact form shortcode', () => {
      const element = {
        _original_shortcode: 'contact-form-7',
        content: {}
      };

      const result = detectShortcodeType(element);
      expect(result).toBe('contact-form');
    });

    it('should detect woocommerce shortcode', () => {
      const element = {
        _original_shortcode: 'woocommerce_cart',
        content: {}
      };

      const result = detectShortcodeType(element);
      expect(result).toBe('woocommerce-cart');
    });

    it('should detect social share shortcode', () => {
      const element = {
        _original_shortcode: 'social_share',
        content: {}
      };

      const result = detectShortcodeType(element);
      expect(result).toBe('social-share');
    });
  });

  describe('getCanonicalType', () => {
    it('should convert UX Builder types', () => {
      expect(getCanonicalType('ux_text')).toBe('text');
      expect(getCanonicalType('ux_slider')).toBe('slider');
      expect(getCanonicalType('ux_gallery')).toBe('gallery');
    });

    it('should convert Gutenberg types', () => {
      expect(getCanonicalType('core/heading')).toBe('heading');
      expect(getCanonicalType('core/paragraph')).toBe('text');
      expect(getCanonicalType('core/image')).toBe('image');
    });

    it('should convert Elementor types', () => {
      expect(getCanonicalType('elementskit-heading')).toBe('heading');
      expect(getCanonicalType('elementskit-text-editor')).toBe('text');
      expect(getCanonicalType('elementskit-button')).toBe('button');
    });

    it('should return original type if not found', () => {
      expect(getCanonicalType('unknown-type')).toBe('unknown-type');
    });
  });
});
