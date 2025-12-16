// src/app/components/ItchioEmbed.tsx
'use client';

import React, { useEffect, useRef } from 'react';

interface ItchioEmbedProps {
  src: string;
  width?: string | number;
  height?: string | number;
  title: string;
}

const ItchioEmbed: React.FC<ItchioEmbedProps> = ({ src, width = '552', height = '167', title }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    console.log('ItchioEmbed useEffect is running on the client.'); // Add this line for verification
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      width={width}
      height={height}
      title={title}
      style={{ border: '0px', overflow: 'hidden' }}
    >
      <a href={src}>{title}</a>
    </iframe>
  );
};

export default ItchioEmbed;