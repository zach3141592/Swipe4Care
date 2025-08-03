import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapPinIcon, DollarSignIcon, UsersIcon } from './Icons';
import { Opportunity } from '../types';

interface SwipeCardProps {
  opportunity: Opportunity;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  ref?: React.Ref<any>;
}

const CardContainer = styled(motion.div)<{ isTop: boolean }>`
  position: absolute;
  width: 350px;
  height: 500px;
  background: ${props => props.isTop ? '#ffffff' : '#f8f9fa'};
  border: 2px solid ${props => props.isTop ? '#000000' : '#e9ecef'};
  border-radius: 20px;
  padding: 0;
  cursor: ${props => props.isTop ? 'grab' : 'default'};
  user-select: none;
  overflow: hidden;
  box-shadow: ${props => props.isTop ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 5px 15px rgba(0, 0, 0, 0.1)'};
  z-index: ${props => props.isTop ? 10 : 1};
  display: flex;
  flex-direction: column;
  
  &:active {
    cursor: ${props => props.isTop ? 'grabbing' : 'default'};
  }
`;

const CardImage = styled.div<{ imageUrl?: string }>`
  width: 100%;
  height: 140px;
  background: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'linear-gradient(135deg, #000 0%, #333 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 140px);
  justify-content: space-between;
  overflow-y: auto;
`;

const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 8px;
  width: fit-content;
  
  ${props => {
    switch (props.type) {
      case 'clinical_trial':
        return 'background: #000; color: #fff;';
      case 'volunteer':
        return 'background: #fff; color: #000; border: 2px solid #000;';
      case 'research':
        return 'background: #f8f9fa; color: #000; border: 2px solid #000;';
      default:
        return 'background: #000; color: #fff;';
    }
  }}
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 6px 0;
  color: #000;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 13px;
  color: #333;
  line-height: 1.3;
  margin: 0;
  margin-bottom: 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
  
  span:first-child {
    margin-right: 6px;
    flex-shrink: 0;
    width: 14px;
  }
`;

const Organization = styled.div`
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
  font-size: 13px;
`;

const SwipeHint = styled.div<{ direction: 'left' | 'right' | null }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  padding: 20px;
  border-radius: 10px;
  opacity: ${props => props.direction ? 0.8 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
  
  ${props => props.direction === 'right' && `
    color: #fff;
    background: #000;
  `}
  
  ${props => props.direction === 'left' && `
    color: #000;
    background: #fff;
    border: 3px solid #000;
  `}
`;

const SwipeCard = React.forwardRef<any, SwipeCardProps>(({ opportunity, onSwipe, isTop }, ref) => {
  const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right' | null>(null);

  React.useImperativeHandle(ref, () => ({
    triggerSwipe: (direction: 'left' | 'right') => {
      triggerSwipe(direction);
    }
  }));

  const handleDragEnd = (event: any, info: any) => {
    if (!isTop) return;
    
    const threshold = 100;
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      const direction = offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  const triggerSwipe = (direction: 'left' | 'right') => {
    if (!isTop) return;
    onSwipe(direction);
  };

  const handleDrag = (event: any, info: any) => {
    if (!isTop) return;
    
    const threshold = 50;
    if (info.offset.x > threshold) {
      setSwipeDirection('right');
    } else if (info.offset.x < -threshold) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  return (
    <CardContainer
      isTop={isTop}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: -300, right: 300 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{ 
        x: swipeDirection === 'right' ? 1000 : -1000,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
    >
      <CardImage imageUrl={opportunity.image_url}>
        {!opportunity.image_url && opportunity.title.split(' ').slice(0, 2).join(' ')}
      </CardImage>
      
      <CardContent>
        <div>
          <TypeBadge type={opportunity.type}>
            {opportunity.type.replace('_', ' ')}
          </TypeBadge>
          
          <Title>{opportunity.title}</Title>
          
          <Organization>{opportunity.organization}</Organization>
          
          <Description>{opportunity.description}</Description>
        </div>
        
        <div>
          <InfoRow>
            <MapPinIcon />
            <span>{opportunity.location}</span>
          </InfoRow>
          
          <InfoRow>
            <DollarSignIcon />
            <span>{opportunity.compensation || 'Not specified'}</span>
          </InfoRow>
          
          <InfoRow>
            <UsersIcon />
            <span>{opportunity.requirements}</span>
          </InfoRow>
        </div>
      </CardContent>
      
      <SwipeHint direction={swipeDirection}>
        {swipeDirection === 'right' ? '❤️' : swipeDirection === 'left' ? '✕' : ''}
      </SwipeHint>
    </CardContainer>
  );
});

export default SwipeCard;