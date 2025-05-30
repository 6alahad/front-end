import React, { useRef, useState, useEffect } from 'react';
import './Canvas.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

function DrawingCanvas({ userName }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    contextRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
  };

  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = async () => {
    const canvas = canvasRef.current;

    if (!userName) {
      alert("User not logged in!");
      return;
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Failed to create image blob.");
        return;
      }

      const formData = new FormData();
      formData.append("image", blob, "drawing.png");
      formData.append("userName", userName);

      try {
        const response = await fetch("http://localhost:5000/upload-image", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Canvas saved successfully!");
        } else {
          alert("Failed to save canvas.");
        }
      } catch (error) {
        console.error("Error saving canvas:", error);
        alert("Server error.");
      }
    }, "image/png");
  };

  return (
    <div className="drawing-container">
      <div className="controls">
        <div className="controls-left">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isEraser}
          />

          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </div>

        <div className="controls-right">
          <button
            onClick={toggleEraser}
            className={`eraser-button ${isEraser ? 'active' : ''}`}
            title="Toggle Eraser"
          >
            <FontAwesomeIcon icon={faEraser} size="lg" />
          </button>

          <button onClick={clearCanvas}>Clear</button>

          <button onClick={saveCanvas}>Save</button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

export default DrawingCanvas;