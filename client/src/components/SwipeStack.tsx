import React, { useState, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';
import { Opportunity } from '../types';
import { apiService } from '../services/api';

interface SwipeStackProps {
  opportunities: Opportunity[];
  onSwipe: (opportunityId: number, direction: 'left' | 'right') => void;
  onNeedMore: () => void;
}

const StackContainer = styled.div`
  position: relative;
  width: 350px;
  height: 500px;
  margin: 0 auto;
  margin-bottom: 30px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 20px;
`;

const EmptyTitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #000;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 24px 0;
`;

const RefreshButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SwipeStack = forwardRef<any, SwipeStackProps>(({ opportunities, onSwipe, onNeedMore }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    swipeCard: (direction: 'left' | 'right') => {
      handleSwipe(direction);
    }
  }));

  const handleSwipe = async (direction: 'left' | 'right') => {
    // Filter valid opportunities
    const validOpportunities = opportunities?.filter(opportunity => opportunity && opportunity.id) || [];
    
    // Validate that we have a valid opportunity at currentIndex
    if (currentIndex >= validOpportunities.length || !validOpportunities[currentIndex]) {
      console.warn('No valid opportunity to swipe at index:', currentIndex, 'of', validOpportunities.length);
      return;
    }
    
    const opportunity = validOpportunities[currentIndex];
    
    try {
      await apiService.recordSwipe({
        opportunityId: opportunity.id,
        direction,
      });
      
      onSwipe(opportunity.id, direction);
      setCurrentIndex(prev => prev + 1);
      
      // Load more opportunities when we're down to the last 2 cards
      if (currentIndex >= validOpportunities.length - 2) {
        onNeedMore();
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await apiService.scrapeNewOpportunities();
      onNeedMore();
    } catch (error) {
      console.error('Error refreshing opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter valid opportunities first
  const validOpportunities = opportunities?.filter(opportunity => opportunity && opportunity.id) || [];
  
  // Show empty state when no more cards or when opportunities array is empty
  if (!validOpportunities || validOpportunities.length === 0 || currentIndex >= validOpportunities.length) {
    return (
      <StackContainer>
        <EmptyState>
          <EmptyTitle>🎉</EmptyTitle>
          <EmptyTitle>All caught up!</EmptyTitle>
          <EmptyText>
            You've reviewed all available opportunities. 
            Check back later or refresh to find new ones.
          </EmptyText>
          <RefreshButton onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? 'Finding opportunities...' : 'Find new opportunities'}
          </RefreshButton>
        </EmptyState>
      </StackContainer>
    );
  }

  const visibleOpportunities = validOpportunities.slice(currentIndex, currentIndex + 3);

  return (
    <StackContainer>
      <AnimatePresence>
        {visibleOpportunities.map((opportunity, index) => (
          <SwipeCard
            key={`${opportunity.id}-${currentIndex}-${index}`}
            opportunity={opportunity}
            onSwipe={handleSwipe}
            isTop={index === 0}
            ref={index === 0 ? (ref as any) : null}
          />
        ))}
      </AnimatePresence>
    </StackContainer>
  );
});

export default SwipeStack;