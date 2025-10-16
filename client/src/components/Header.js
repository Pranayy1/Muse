import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch, FaFire, FaBars, FaTimes, FaMusic } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.85);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(56, 189, 248, 0.1);
  animation: slideDown 0.5s ease;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #0284c7;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #0369a1;
    transform: scale(1.05);
  }

  svg {
    font-size: 28px;
    color: #38bdf8;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @media (max-width: 768px) {
    font-size: 20px;
    
    svg {
      font-size: 24px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: ${props => props.active ? '#0284c7' : '#64748b'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 15px;
  border-radius: 25px;
  background: ${props => props.active ? 'rgba(56, 189, 248, 0.15)' : 'transparent'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(56, 189, 248, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #0284c7;
    background: rgba(56, 189, 248, 0.1);

    &::before {
      transform: translateX(0);
    }
  }

  svg {
    font-size: 18px;
  }
`;

const MenuButton = styled.button`
  display: none;
  font-size: 24px;
  color: #0284c7;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1002;
  transition: all 0.3s ease;

  &:hover {
    color: #0369a1;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(30px);
    padding: 20px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
    z-index: 1001;
    border-top: 2px solid rgba(56, 189, 248, 0.3);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    box-shadow: 0 -10px 40px rgba(56, 189, 248, 0.2);
    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.2);
`;

const MobileNavTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #0284c7;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #38bdf8;
  }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.1);
  border: none;
  color: #64748b;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.2);
    color: #0284c7;
    transform: rotate(90deg);
  }
`;

const MobileNavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const MobileNavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 15px;
  border-radius: 16px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.15))'
    : 'rgba(241, 245, 249, 0.5)'};
  border: 1px solid ${props => props.active ? 'rgba(56, 189, 248, 0.4)' : 'transparent'};
  box-shadow: ${props => props.active ? '0 4px 15px rgba(56, 189, 248, 0.2)' : 'none'};
  color: ${props => props.active ? '#0284c7' : '#64748b'};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  svg {
    font-size: 24px;
    transition: transform 0.3s ease;
  }

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(14, 165, 233, 0.2))'
      : 'rgba(56, 189, 248, 0.1)'};
    color: #0284c7;
    transform: translateY(-2px);

    svg {
      transform: scale(1.1);
    }
  }
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/trending', icon: FaFire, label: 'Trending' },
  ];

  return (
    <>
      <HeaderContainer>
        <Logo to="/" onClick={closeMenu}>
          <FaMusic />
          <span>Muse</span>
        </Logo>

        <Nav>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              active={location.pathname === item.path ? 'true' : undefined}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </Nav>

        <MenuButton onClick={toggleMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>
      </HeaderContainer>

      <MobileNav isOpen={mobileMenuOpen}>
        <MobileNavHeader>
          <MobileNavTitle>
            <FaMusic />
            <span>Menu</span>
          </MobileNavTitle>
          <CloseButton onClick={closeMenu}>
            <FaTimes />
          </CloseButton>
        </MobileNavHeader>
        
        <MobileNavGrid>
          {navItems.map(item => (
            <MobileNavLink
              key={item.path}
              to={item.path}
              active={location.pathname === item.path ? 'true' : undefined}
              onClick={closeMenu}
            >
              <item.icon />
              <span>{item.label}</span>
            </MobileNavLink>
          ))}
        </MobileNavGrid>
      </MobileNav>

      <Overlay isOpen={mobileMenuOpen} onClick={closeMenu} />
    </>
  );
};

export default Header;
