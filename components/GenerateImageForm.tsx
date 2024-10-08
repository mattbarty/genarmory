"use client";
// components/GenerateImageForm.tsx
import { useState, useRef } from 'react';
import DrawCanvas from './DrawCanvas';

export default function GenerateImageForm() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(6);
  const canvasRef = useRef<{
    clearCanvas(): unknown; getCanvasDataURL: () => string;
  }>(null);

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

  const handleResetCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  return (
    <div className="container flex">
      <div>
        <div>
          <button
            onClick={handleResetCanvas}
            className='mt-2 px-2 py-1 bg-red-500 rounded-sm text-white'
          >
            Reset Canvas
          </button>
          <div className='max-w-sm aspect-[7/5] border'>
            <DrawCanvas ref={canvasRef} penColour={selectedColor} lineWidth={lineWidth} />
          </div>
          <div className='flex'>
            <div className='aspect-square bg-white w-8 border m-2'
              onClick={() => setSelectedColor('white')}></div>
            <div className='aspect-square bg-black w-8 border m-2'
              onClick={() => setSelectedColor('black')}></div>
          </div>
          {/* <div className="mt-4">
          <label htmlFor="brushSize">Brush Size:</label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="50"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="ml-2"
          />
        </div> */}

        </div>
        <div className='mt-16'>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="prompt">Prompt:</label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className='border'
              />
            </div>
            <button type="submit" disabled={loading} className='px-2 py-1 bg-blue-500 rounded-sm text-white'>
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>
      </div>
      {output && (
        <div>
          <div className='border rounded-lg flex flex-col aspect-[5/7] p-4 max-w-sm'>
            <div className='flex justify-between text-2xl'>
              <h1 className=''>Sword of swords</h1>
              <p className=''>100</p>
            </div>
            <img src={output[1]} alt="Generated" className=' aspect-[7/5] border' />
            <div>
              <p className='mt-1'>This is a description of this legendary sword</p>
              <div className='flex justify-between w-full text-lg items-center mt-4'>
                <p className=''>This is the description of a totally epic move. Very very epic !</p>
                <p className=''>30</p>
              </div>
              <div className='flex justify-between w-full text-lg items-center mt-4'>
                <p className=''>This is the description of a totally epic move. Very very epic !</p>
                <p className=''>30</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
