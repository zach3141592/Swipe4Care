import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const HeartIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>❤️</span>
);

export const RefreshIcon: React.FC<IconProps> = ({ size = 20 }) => (
  <span style={{ fontSize: size, lineHeight: 1, display: 'inline-block', transform: 'rotate(0deg)', transition: 'transform 0.3s ease' }}>🔄</span>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>🏠</span>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>📍</span>
);

export const DollarSignIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>💰</span>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>👥</span>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>⏰</span>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>🔗</span>
);