import { NextRequest, NextResponse } from 'next/server';
import {
  convertBackendBlocksToPuck,
  convertPuckToBackend,
  validateBackendElements,
  validatePuckComponents
} from '@easey-ai/page-builder/lib/converters';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'backend-to-puck': {
        const backendElementsB2P = data.elements;
        const validationB2P = validateBackendElements(backendElementsB2P);
        
        if (validationB2P.invalid.length > 0) {
          return NextResponse.json({
            success: false,
            error: 'Invalid backend elements',
            details: validationB2P.invalid
          }, { status: 400 });
        }

        const puckComponentsB2P = convertBackendBlocksToPuck(validationB2P.valid, {
          enableCache: true,
          preserveOriginalData: true
        });

        return NextResponse.json({
          success: true,
          data: {
            puckComponents: puckComponentsB2P,
            originalCount: backendElementsB2P.length,
            convertedCount: puckComponentsB2P.length
          }
        });
      }

      case 'puck-to-backend': {
        const puckComponentsP2B = data.components;
        const puckValidationP2B = validatePuckComponents(puckComponentsP2B);
        
        if (puckValidationP2B.invalid.length > 0) {
          return NextResponse.json({
            success: false,
            error: 'Invalid puck components',
            details: puckValidationP2B.invalid
          }, { status: 400 });
        }

        const backendElementsP2B = convertPuckToBackend(puckValidationP2B.valid, {
          preserveOriginalData: true,
          generateIds: true
        });

        return NextResponse.json({
          success: true,
          data: {
            backendElements: backendElementsP2B,
            originalCount: puckComponentsP2B.length,
            convertedCount: backendElementsP2B.length
          }
        });
      }

      case 'validate-backend': {
        const backendValidationVB = validateBackendElements(data.elements);
        return NextResponse.json({
          success: true,
          data: backendValidationVB
        });
      }

      case 'validate-puck': {
        const puckValidationVP = validatePuckComponents(data.components);
        return NextResponse.json({
          success: true,
          data: puckValidationVP
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Converter API is running',
    endpoints: {
      'POST /api/convert': {
        description: 'Convert between backend and puck formats',
        actions: [
          'backend-to-puck',
          'puck-to-backend',
          'validate-backend',
          'validate-puck'
        ]
      }
    }
  });
}
