import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import SwipeStack from './components/SwipeStack';
import LikedView from './components/LikedView';
import { Opportunity } from './types';
import { apiService } from './services/api';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f8f9fa;
    color: #000;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  overflow-y: auto;
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.h2`
  font-size: 24px;
  color: #000;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  padding: 0 20px;
  position: relative;
  z-index: 100;

  @media (max-width: 480px) {
    gap: 30px;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 3px solid #000;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.reject {
    background: #fff;
    color: #000;
    
    &:hover {
      background: #f8f9fa;
      transform: scale(1.1);
    }
  }
  
  &.like {
    background: #000;
    color: #fff;
    
    &:hover {
      background: #333;
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ButtonLabel = styled.span`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #666;
  white-space: nowrap;
`;

function App() {
  const [currentView, setCurrentView] = useState<'swipe' | 'liked'>('swipe');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [likedCount, setLikedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swipeStackRef = useRef<any>(null);

  useEffect(() => {
    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load opportunities and trigger initial scrape if needed
      const [existingOpportunities] = await Promise.all([
        apiService.getOpportunities(),
        loadLikedCount()
      ]);

      if (existingOpportunities.length === 0) {
        // No opportunities exist, trigger initial scrape
        console.log('No opportunities found, triggering initial scrape...');
        await apiService.scrapeNewOpportunities();
        const newOpportunities = await apiService.getOpportunities();
        setOpportunities(newOpportunities);
      } else {
        setOpportunities(existingOpportunities);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLikedCount = async () => {
    try {
      const liked = await apiService.getLikedOpportunities();
      setLikedCount(liked.length);
    } catch (error) {
      console.error('Error loading liked count:', error);
    }
  };

  const handleSwipe = (opportunityId: number, direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLikedCount(prev => prev + 1);
    }
  };

  const handleNeedMore = async () => {
    try {
      const newOpportunities = await apiService.getOpportunities();
      setOpportunities(newOpportunities);
    } catch (error) {
      console.error('Error loading more opportunities:', error);
    }
  };

  const handleRefresh = async () => {
    if (currentView === 'swipe') {
      await loadInitialData();
    } else {
      await loadLikedCount();
    }
  };

  const handleLikeClick = () => {
    if (swipeStackRef.current && opportunities.length > 0) {
      swipeStackRef.current.swipeCard('right');
    }
  };

  const handleRejectClick = () => {
    if (swipeStackRef.current && opportunities.length > 0) {
      swipeStackRef.current.swipeCard('left');
    }
  };

  if (loading) {
    return (
      <AppContainer>
        <GlobalStyle />
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          onRefresh={handleRefresh}
          likedCount={likedCount}
        />
        <MainContent>
          <LoadingScreen>
            <LoadingSpinner />
            <LoadingText>Finding healthcare opportunities...</LoadingText>
          </LoadingScreen>
        </MainContent>
      </AppContainer>
    );
  }

  if (error) {
    return (
      <AppContainer>
        <GlobalStyle />
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          onRefresh={handleRefresh}
          likedCount={likedCount}
        />
        <MainContent>
          <LoadingScreen>
            <LoadingText>{error}</LoadingText>
          </LoadingScreen>
        </MainContent>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <GlobalStyle />
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onRefresh={handleRefresh}
        likedCount={likedCount}
      />
      
      <MainContent>
        {currentView === 'swipe' ? (
          <div>
            <SwipeStack
              ref={swipeStackRef}
              opportunities={opportunities}
              onSwipe={handleSwipe}
              onNeedMore={handleNeedMore}
            />
            <ActionButtons>
              <ActionButton 
                className="reject" 
                style={{ position: 'relative' }}
                onClick={handleRejectClick}
              >
                ✕
                <ButtonLabel>Pass</ButtonLabel>
              </ActionButton>
              <ActionButton 
                className="like" 
                style={{ position: 'relative' }}
                onClick={handleLikeClick}
              >
                ❤️
                <ButtonLabel>Like</ButtonLabel>
              </ActionButton>
            </ActionButtons>
          </div>
        ) : (
          <LikedView onLikedCountChange={loadLikedCount} />
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;