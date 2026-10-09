"use client";

import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_TEXT_ELEMENTS } from '@/data/posterData';

export default function PosterGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [texts, setTexts] = useState<string[]>(
    INITIAL_TEXT_ELEMENTS.map((el) => el.defaultMsg)
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const posterImgRef = useRef<HTMLImageElement | null>(null);

  const FONT_HEIGHT = 16;

  useEffect(() => {
    const img = new window.Image();
    img.src = "/base.png";
    img.onload = () => {
      posterImgRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!imageLoaded||!posterImgRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(posterImgRef.current, 0, 0);

    INITIAL_TEXT_ELEMENTS.forEach((el, index) => {
      const currentText = texts[index] !== "" ? texts[index] : el.defaultMsg;
      drawMessage(ctx, el.posX, el.posY, el.fontSize, el.fontColor, currentText, el.isCenter);
    });
  }, [texts, imageLoaded]);

  const drawMessage = (
    ctx: CanvasRenderingContext2D,
    posX: number,
    posY: number,
    fontSize: number,
    fontColor: string,
    str: string,
    isCenter: boolean
  ) => {
    const msgs: string[] = [];
    let mstr = str + "<br>";
    const regex = /(.*?)<br>(.*$)/;
    let match;
    while ((match = mstr.match(regex))) {
      msgs.push(match[1]);
      mstr = match[2];
    }

    const maxHeight = FONT_HEIGHT * (msgs.length + 1);
    const msgsWidth: number[] = [];

    ctx.font = `bold ${fontSize}px 'MS Pゴシック', sans-serif`;
    ctx.fillStyle = fontColor;

    for (let i = 0; i < msgs.length; i++) {
      const metrics = ctx.measureText(msgs[i]);
      msgsWidth.push(metrics.width);
    }

    const baseY = posY - maxHeight / 2;
    let y = baseY;

    for (let i = 0; i < msgs.length; i++) {
      let x = posX;
      if (isCenter) {
        x = posX - msgsWidth[i] / 2;
      }
      ctx.fillText(msgs[i], x, y);
      y += FONT_HEIGHT;
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "bad-spiral.png";
    link.click();
  };

  return (
   <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">悪循環画像ジェネレータ</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_TEXT_ELEMENTS.map((el, i) => (
          <div key={i} className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">
              項目 {i + 1}
            </label>
            <input
              type="text"
              value={texts[i]}
              onChange={(e) => handleInputChange(i, e.target.value)}
              placeholder={el.defaultMsg.replace(/<br>/g, " ")}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4 pt-4">
        <div className="shadow-md bg-white p-2">
          <canvas
            ref={canvasRef}
            width={515}
            height={645}
            className="max-w-full h-auto"
          />
        </div>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          画像をダウンロード
        </button>
      </div>
    </div>
  )
}