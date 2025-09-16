'use client';

import { useState } from 'react';
import { Button } from '@/core';

export default function ConverterTestPage() {
  const [backendData, setBackendData] = useState('');
  const [puckData, setPuckData] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleBackendData = {
    elements: [
      {
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
            }
          }
        }
      },
      {
        id: 'text-1',
        type: 'text',
        depth: 2,
        content: {
          text: '<p>This is a sample paragraph text.</p>',
          alignment: 'left'
        },
        responsive: {
          desktop: {
            editor: '<p>This is a sample paragraph text.</p>',
            text_color: '#333333',
            align: 'left',
            typography_font_size: {
              size: 16,
              unit: 'px'
            }
          }
        }
      }
    ]
  };

  const samplePuckData = {
    components: [
      {
        id: 'heading-1',
        type: 'heading',
        props: {
          text: 'Hello World',
          level: 'h2',
          align: 'center',
          color: '#333333',
          size: 'l'
        }
      },
      {
        id: 'button-1',
        type: 'button',
        props: {
          label: 'Click Me',
          href: 'https://example.com',
          variant: 'primary',
          size: 'm'
        }
      }
    ]
  };

  const handleBackendToPuck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = JSON.parse(backendData || JSON.stringify(sampleBackendData));
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'backend-to-puck',
          data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setResult(result.data);
        setPuckData(JSON.stringify(result.data.puckComponents, null, 2));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handlePuckToBackend = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = JSON.parse(puckData || JSON.stringify(samplePuckData));
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'puck-to-backend',
          data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setResult(result.data);
        setBackendData(JSON.stringify(result.data.backendElements, null, 2));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateBackend = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = JSON.parse(backendData || JSON.stringify(sampleBackendData));
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'validate-backend',
          data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setResult(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleValidatePuck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = JSON.parse(puckData || JSON.stringify(samplePuckData));
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'validate-puck',
          data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setResult(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setBackendData(JSON.stringify(sampleBackendData, null, 2));
    setPuckData(JSON.stringify(samplePuckData, null, 2));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Converter Test Page</h1>
      <p>Test the Backend to Puck and Puck to Backend converters</p>

      <div style={{ marginBottom: '20px' }}>
        <Button onClick={loadSampleData} variant="secondary">
          Load Sample Data
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h2>Backend Data</h2>
          <textarea
            value={backendData}
            onChange={(e) => setBackendData(e.target.value)}
            placeholder="Enter backend elements JSON..."
            style={{
              width: '100%',
              height: '300px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <div style={{ marginTop: '10px' }}>
            <Button onClick={handleBackendToPuck} disabled={loading}>
              Backend → Puck
            </Button>
            <Button onClick={handleValidateBackend} disabled={loading} variant="secondary">
              Validate Backend
            </Button>
          </div>
        </div>

        <div>
          <h2>Puck Data</h2>
          <textarea
            value={puckData}
            onChange={(e) => setPuckData(e.target.value)}
            placeholder="Enter puck components JSON..."
            style={{
              width: '100%',
              height: '300px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <div style={{ marginTop: '10px' }}>
            <Button onClick={handlePuckToBackend} disabled={loading}>
              Puck → Backend
            </Button>
            <Button onClick={handleValidatePuck} disabled={loading} variant="secondary">
              Validate Puck
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Processing...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          border: '1px solid #fcc', 
          borderRadius: '4px', 
          padding: '10px', 
          marginBottom: '20px' 
        }}>
          <h3>Error:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {result && (
        <div>
          <h2>Result</h2>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            padding: '10px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
