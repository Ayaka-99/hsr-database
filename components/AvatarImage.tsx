'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function AvatarImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-600">
        {/* 人形剪影 */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2 opacity-30">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
        <span className="text-xs opacity-40">即將推出</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
