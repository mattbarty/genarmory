"use client";
// components/GenerateImageForm.tsx
import { useState, useRef } from 'react';
import DrawCanvas from './DrawCanvas';

export default function GenerateImageForm() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<{ getCanvasDataURL: () => string; }>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let base64Image = '';

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Image = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else if (canvasRef.current) {
      base64Image = canvasRef.current.getCanvasDataURL();
    }

    if (!base64Image) {
      console.error('No image available');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/genWeapon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image, prompt }),
      });

      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        setOutput(data.output);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        console.error('Response text:', responseText);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className='aspect-square w-64'>
        <DrawCanvas ref={canvasRef} />
      </div>
      <h1>Generate Image</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Choose Image:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="prompt">Prompt:</label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {output && (
        <div>
          <h2>Generated Image</h2>
          <img src={output[1]} alt="Generated" />
        </div>
      )}
    </div>
  );
}
