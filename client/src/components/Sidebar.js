import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaSearch, 
  FaFire, 
  FaMusic, 
  FaHeart,
  FaList
} from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 240px;
  background: #000;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  padding: 0 20px 30px;
  font-size: 24px;
  font-weight: bold;
  color: #1db954;
`;

const NavSection = styled.div`
  margin-bottom: 30px;
`;

const NavTitle = styled.h3`
  padding: 0 20px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #b3b3b3;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: ${props => props.active ? '#1db954' : '#b3b3b3'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    margin-right: 15px;
    font-size: 20px;
  }
`;

const PlaylistSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
`;

const PlaylistItem = styled.div`
  padding: 8px 0;
  color: #b3b3b3;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: white;
  }
`;

const Sidebar = () => {
  const location = useLocation();

  const mainNavItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/trending', icon: FaFire, label: 'Trending' },
  ];

  const libraryItems = [
    { icon: FaMusic, label: 'Made For You' },
    { icon: FaHeart, label: 'Liked Songs' },
    { icon: FaList, label: 'Recently Played' },
  ];

  return (
    <SidebarContainer>
      <Logo>Spotify Clone</Logo>
      
      <NavSection>
        {mainNavItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            active={location.pathname === item.path ? 1 : 0}
          >
            <item.icon />
            {item.label}
          </NavItem>
        ))}
      </NavSection>

      <NavSection>
        <NavTitle>Your Library</NavTitle>
        {libraryItems.map((item, index) => (
          <NavItem key={index} to="#" active={0}>
            <item.icon />
            {item.label}
          </NavItem>
        ))}
      </NavSection>

      <PlaylistSection>
        <NavTitle>Playlists</NavTitle>
        <PlaylistItem>Today's Top Hits</PlaylistItem>
        <PlaylistItem>Discover Weekly</PlaylistItem>
        <PlaylistItem>Release Radar</PlaylistItem>
        <PlaylistItem>Chill Hits</PlaylistItem>
        <PlaylistItem>Rock Classics</PlaylistItem>
        <PlaylistItem>Indie Mix</PlaylistItem>
      </PlaylistSection>
    </SidebarContainer>
  );
};

export default Sidebar;
