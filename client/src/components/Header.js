import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaBell, FaUser } from 'react-icons/fa';

const HeaderContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  margin-right: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px 12px 45px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: #1db954;
    box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NotificationButton = styled.button`
  position: relative;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  svg {
    font-size: 18px;
  }
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    font-size: 16px;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <HeaderContainer>
      <SearchContainer>
        <form onSubmit={handleSearch}>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </SearchContainer>
      
      <UserSection>
        <NotificationButton>
          <FaBell />
        </NotificationButton>
        
        <UserButton>
          <FaUser />
          <UserName>User</UserName>
        </UserButton>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
