import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ExternalLinkIcon, MapPinIcon, DollarSignIcon, ClockIcon } from './Icons';
import { Opportunity } from '../types';
import { apiService } from '../services/api';

const LikedContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 0 0 40px 0;
  color: #000;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyTitle = styled.h2`
  font-size: 24px;
  margin: 0 0 16px 0;
  color: #000;
`;

const EmptyText = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const OpportunityCard = styled.div`
  background: #fff;
  border: 2px solid #000;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  
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

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #000;
`;

const Organization = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const ViewButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const RemoveButton = styled.button<{ isRemoving: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.isRemoving ? '#ccc' : '#dc3545'};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: ${props => props.isRemoving ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.isRemoving ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-2px);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

interface LikedViewProps {
  onLikedCountChange?: () => void;
}

const LikedView: React.FC<LikedViewProps> = ({ onLikedCountChange }) => {
  const [likedOpportunities, setLikedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadLikedOpportunities();
  }, []);

  const loadLikedOpportunities = async () => {
    try {
      const opportunities = await apiService.getLikedOpportunities();
      setLikedOpportunities(opportunities);
    } catch (error) {
      console.error('Error loading liked opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOpportunity = async (opportunityId: number) => {
    if (removingIds.has(opportunityId)) return; // Prevent double-clicking
    
    try {
      setRemovingIds(prev => new Set(prev).add(opportunityId));
      await apiService.removeLikedOpportunity(opportunityId);
      
      // Remove from local state immediately for better UX
      setLikedOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
      
      // Update the liked count in the parent component
      if (onLikedCountChange) {
        onLikedCountChange();
      }
    } catch (error) {
      console.error('Error removing opportunity:', error);
      // Could add a toast notification here
      alert('Failed to remove opportunity. Please try again.');
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(opportunityId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <LikedContainer>
        <Title>Loading your liked opportunities...</Title>
      </LikedContainer>
    );
  }

  if (likedOpportunities.length === 0) {
    return (
      <LikedContainer>
        <EmptyState>
          <EmptyTitle>💔 No liked opportunities yet</EmptyTitle>
          <EmptyText>
            Start swiping on opportunities to see them here!<br />
            Swipe right on opportunities you're interested in.
          </EmptyText>
        </EmptyState>
      </LikedContainer>
    );
  }

  return (
    <LikedContainer>
      <Title>❤️ Your Liked Opportunities ({likedOpportunities.length})</Title>
      
      {likedOpportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id}>
          <CardHeader>
            <div>
              <TypeBadge type={opportunity.type}>
                {opportunity.type.replace('_', ' ')}
              </TypeBadge>
            </div>
          </CardHeader>
          
          <CardTitle>{opportunity.title}</CardTitle>
          <Organization>{opportunity.organization}</Organization>
          <Description>{opportunity.description}</Description>
          
          <InfoGrid>
            <InfoItem>
              <MapPinIcon />
              <span>{opportunity.location}</span>
            </InfoItem>
            
            <InfoItem>
              <DollarSignIcon />
              <span>{opportunity.compensation || 'Not specified'}</span>
            </InfoItem>
          </InfoGrid>
          
          <InfoItem style={{ marginBottom: '20px' }}>
            <ClockIcon />
            <span>{opportunity.requirements}</span>
          </InfoItem>
          
          <ButtonGroup>
            <ViewButton 
              href={opportunity.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon />
              View Details
            </ViewButton>
            
            <RemoveButton
              onClick={() => handleRemoveOpportunity(opportunity.id)}
              disabled={removingIds.has(opportunity.id)}
              isRemoving={removingIds.has(opportunity.id)}
            >
              {removingIds.has(opportunity.id) ? (
                <>⏳ Removing...</>
              ) : (
                <>🗑️ Remove</>
              )}
            </RemoveButton>
          </ButtonGroup>
        </OpportunityCard>
      ))}
    </LikedContainer>
  );
};

export default LikedView;