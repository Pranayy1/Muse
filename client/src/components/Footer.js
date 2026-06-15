import React from 'react';
import styled from 'styled-components';
import { FaMusic } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(99, 102, 241, 0.15);
  margin-top: 48px;
  padding: 24px 30px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FooterInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const FooterName = styled.span`
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366F1, #818CF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FooterText = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <FooterBrand>
          <FaMusic style={{ color: '#818CF8', fontSize: '1.3rem' }} />
          <FooterName>Muse</FooterName>
        </FooterBrand>
        <FooterText>© {new Date().getFullYear()} Muse — All Rights Reserved</FooterText>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;
