import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch, FaFire, FaBars, FaTimes, FaMusic } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: rgba(0, 0, 0, 0.95);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

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
  color: #1db954;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #1ed760;
    transform: scale(1.05);
  }

  svg {
    font-size: 28px;
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
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    height: 100vh;
    width: 70%;
    max-width: 300px;
    background: rgba(0, 0, 0, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    padding: 40px 20px;
    transition: right 0.3s ease;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
    z-index: 1001;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: ${props => props.active ? '#1db954' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 15px;
  border-radius: 25px;
  background: ${props => props.active ? 'rgba(29, 185, 84, 0.15)' : 'transparent'};
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
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #1db954;
    background: rgba(29, 185, 84, 0.1);

    &::before {
      transform: translateX(0);
    }
  }

  svg {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    padding: 15px 25px;
    font-size: 16px;
  }
`;

const MenuButton = styled.button`
  display: none;
  font-size: 24px;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1002;
  transition: all 0.3s ease;

  &:hover {
    color: #1db954;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: block;
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
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
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

        <Nav isOpen={mobileMenuOpen}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              active={location.pathname === item.path ? 'true' : undefined}
              onClick={closeMenu}
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

      <Overlay isOpen={mobileMenuOpen} onClick={closeMenu} />
    </>
  );
};

export default Header;
