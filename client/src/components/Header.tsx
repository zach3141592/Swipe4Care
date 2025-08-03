import React from 'react';
import styled from 'styled-components';
import { HomeIcon, HeartIcon, RefreshIcon } from './Icons';

interface HeaderProps {
  currentView: 'swipe' | 'liked';
  onViewChange: (view: 'swipe' | 'liked') => void;
  onRefresh: () => void;
  likedCount: number;
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: #fff;
  border-bottom: 2px solid #000;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: #000;
  
  span {
    color: #666;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 16px;
`;

const NavButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #000;
  border-radius: 25px;
  background: ${props => props.active ? '#000' : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#333' : '#f8f9fa'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid #000;
  border-radius: 50%;
  background: #fff;
  color: #000;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px) rotate(90deg);
  }
  
  &:active {
    transform: translateY(0) rotate(90deg);
  }
`;

const Badge = styled.span`
  background: #ff0000;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-left: 4px;
`;

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onRefresh, likedCount }) => {
  return (
    <HeaderContainer>
      <Logo>
        Swipe<span>4</span>Care
      </Logo>
      
      <Navigation>
        <NavButton
          active={currentView === 'swipe'}
          onClick={() => onViewChange('swipe')}
        >
          <HomeIcon size={16} />
          Discover
        </NavButton>
        
        <NavButton
          active={currentView === 'liked'}
          onClick={() => onViewChange('liked')}
        >
          <HeartIcon size={16} />
          Liked
          {likedCount > 0 && <Badge>{likedCount}</Badge>}
        </NavButton>
      </Navigation>
      
      <RefreshButton onClick={onRefresh}>
        <RefreshIcon size={20} />
      </RefreshButton>
    </HeaderContainer>
  );
};

export default Header;