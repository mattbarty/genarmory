// components/DrawCanvas.tsx
"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const DrawCanvas = forwardRef((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [penColour, setPenColour] = useState('black');

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(devicePixelRatio, devicePixelRatio);
        setContext(ctx);
      }
    }
  };

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    if (context) {
      context.strokeStyle = penColour;
      context.lineWidth = 10;
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || !context) return;

    const { offsetX, offsetY } = nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  useImperativeHandle(ref, () => ({
    getCanvasDataURL: () => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : '';
    },
  }));

  return (
    <>
      <div className='flex flex-col aspect-square'>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ border: '1px solid black', cursor: 'crosshair', aspectRatio: '1 / 1' }}
        />
      </div>
      <div className='flex space-x-2 p-2'>
        <div
          className='aspect-square w-8 bg-white border'
          onClick={() => setPenColour('white')}></div>
        <div
          className='aspect-square w-8 bg-black border'
          onClick={() => setPenColour('black')}
        ></div>
      </div>
    </>
  );
});

export default DrawCanvas;