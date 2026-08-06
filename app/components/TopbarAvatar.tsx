'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TopbarAvatarProps {
  name: string | null;
  image: string | null;
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function TopbarAvatar({ name, image }: TopbarAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = image && !imgError;

  return (
    <Link href="/settings" className="topbar-avatar-link">
      {showImage ? (
        <img
          src={image}
          alt={name ?? 'User'}
          className="topbar-avatar-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="topbar-avatar">
          {getInitials(name)}
        </div>
      )}
    </Link>
  );
}
