import { useState } from 'react';
import type { CSSProperties } from 'react';

interface GarmentProps {
  index: number;
  name: string;
  className?: string;
  eager?: boolean;
}

export function Garment({ index, name, className = '', eager = false }: GarmentProps) {
  const [failed, setFailed] = useState(false);
  // Source segments are measured at transparent gaps, not assumed equal quarters.
  const [start, end, center] = [[0, 570, 312], [570, 1084, 834], [1084, 1588, 1336], [1588, 2172, 1860]][index];
  const width = end - start;
  const cropStyle = {
    width: `${width / 543 * 100}%`,
    left: `${(271.5 - (center - start)) / 543 * 100}%`,
    '--sprite-width': `${2172 / width * 100}%`,
    '--sprite-left': `${-start / width * 100}%`,
  } as CSSProperties;
  return <div className={`garment-visual ${className}`}>
    {failed ? <span className="image-fallback">{name}<br />Imagen no disponible</span> :
      <span className="garment-crop" style={cropStyle}><img className="garment-sheet" src="/assets/arkad-editorial-rail-v2.png" width="2172" height="724"
        alt={`${name} ARKAD, vista posterior en percha · visualización editorial`}
        loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} onError={() => setFailed(true)} /></span>}
  </div>;
}
