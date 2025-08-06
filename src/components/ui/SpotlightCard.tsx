'use client';

import React, { useRef, useState, useEffect } from 'react';

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  hoverEffect?: boolean;
  borderRadius?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.1)',
  spotlightSize = 200,
  hoverEffect = true,
  borderRadius = '12px',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
    setIsClicked(true);

    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 600);
  };

  const spotlightStyle = {
    background: `radial-gradient(circle ${spotlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent)`,
    opacity: (isHovered && hoverEffect) || isClicked ? 1 : 0,
    transition: isClicked ? 'opacity 0.1s ease' : 'opacity 0.3s ease',
  };

  const flashStyle = {
    background: `radial-gradient(circle ${spotlightSize * 1.5}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4), transparent)`,
    opacity: isClicked ? 1 : 0,
    transition: 'opacity 0.6s ease-out',
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        position: 'relative',
        borderRadius,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Spotlight overlay */}
      <div
        className="spotlight-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1,
          ...spotlightStyle,
        }}
      />

      {/* Flash effect on click */}
      <div
        className="flash-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 2,
          ...flashStyle,
        }}
      />
      
      {/* Card content */}
      <div
        className="spotlight-content"
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
