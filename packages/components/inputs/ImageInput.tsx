import React, { useRef, useState } from 'react';

import { UploadIcon } from '../icons';

export interface ImageInputProps {
  onChange: (e: File) => void;
}

const style =
  'border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500 hover:bg-gray-800';
const onDragStyle = `${style} border-blue-500 bg-gray-800`;

export function ImageInput({ onChange }: ImageInputProps) {
  const [onDrag, setOnDrag] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputFile.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let files: File[] | undefined;

    switch (true) {
      case 'target' in e && 'files' in e.target:
        files = e.target.files as unknown as File[];
        break;
      case 'dataTransfer' in e && 'files' in e.dataTransfer:
        files = e.dataTransfer.files as unknown as File[];
        break;
    }

    const file = files?.[0];

    if (file) {
      onChange(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOnDrag(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOnDrag(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOnDrag(false);
    handleFile(e);
  };

  return (
    <div
      className={`${
        onDrag ? onDragStyle : style
      } p-6 text-center transition-all cursor-pointer group`}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={inputFile}
        onChange={handleFile}
      />

      <div className="text-gray-400 group-hover:text-blue-400 mb-2">
        <UploadIcon className="w-10 h-10 mx-auto" />
      </div>

      <p className="text-sm text-gray-300">
        Drag and drop an image or
        <span className="text-blue-500 font-medium"> click to browse</span>
      </p>

      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP</p>
    </div>
  );
}
