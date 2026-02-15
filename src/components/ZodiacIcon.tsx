import React from 'react';

interface ZodiacIconProps {
  sign: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 고화질 표준 별자리 이미지를 렌더링하는 컴포넌트
 * Iconify API를 통해 Google Noto Emoji 스타일의 아이콘을 가져옵니다.
 */
export const ZodiacIcon: React.FC<ZodiacIconProps> = ({ sign, className = '', style }) => {
  const normalizedSign = sign.toLowerCase().trim();

  // Google Noto Emoji 스타일의 고화질 별자리 아이콘 URL
  const iconUrl = `https://api.iconify.design/noto:${normalizedSign}.svg`;

  return (
    <img 
      src={iconUrl} 
      alt={sign}
      className={className}
      loading="lazy"
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'contain',
        ...style 
      }}
      // 이미지 로드 실패 시 텍스트라도 보여줌
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
};