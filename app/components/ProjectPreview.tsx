'use client';

import { useState } from 'react';

type ProjectPreviewProps = {
  title: string;
  placeholder: string;
  src?: string;
  isPlaceholder?: boolean;
};

export function ProjectPreview({
  title,
  placeholder,
  src,
  isPlaceholder = false
}: ProjectPreviewProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (isPlaceholder || hasError || !src) {
    return (
      <div className={`preview-box ${isPlaceholder ? 'placeholder' : ''}`}>
        <span>{placeholder}</span>
      </div>
    );
  }

  return (
    <div className="preview-box">
      {!isLoaded && <div className="preview-fallback">{placeholder}</div>}
      <img
        src={src}
        alt={`Preview ${title}`}
        className="preview-image"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
}
