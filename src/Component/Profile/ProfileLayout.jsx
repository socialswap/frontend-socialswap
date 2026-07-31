import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  VideoCameraOutlined,
  TransactionOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Drawer, Button } from 'antd';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  max-width: 1280px;
  margin: 6rem auto 2rem;
  padding: 0 1rem;
  gap: 2rem;
  color: var(--text-primary);

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 5rem;
  }
`;

const Sidebar = styled.div`
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 7rem;
  align-self: flex-start;
  height: max-content;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  padding: 1.25rem;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);

  .dark & {
    background: rgba(17, 12, 31, 0.45);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileTopNav = styled.div`
  display: none;
  overflow-x: auto;
  white-space: nowrap;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border);

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  background: var(--bg-secondary);
  transition: all 0.2s ease;
  text-decoration: none;

  &.active {
    background: var(--purple-primary);
    color: white;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 14px;
  color: #64748b;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 0.95rem;

  .dark & {
    color: #94a3b8;
  }

  &:hover {
    background: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
    transform: translateX(4px);
  }

  .dark &:hover {
    background: rgba(168, 85, 247, 0.15);
    color: #a855f7;
  }

  &.active {
    background: linear-gradient(to right, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.02));
    color: #7c3aed;
    box-shadow: inset 3px 0 0 0 #7c3aed;
  }
  
  .dark &.active {
    background: linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.02));
    color: #a855f7;
    box-shadow: inset 3px 0 0 0 #a855f7;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 14px;
  color: #ef4444;
  font-weight: 600;
  font-size: 0.95rem;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  margin-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.05);

  .dark & {
    border-top-color: rgba(255,255,255,0.05);
  }

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: translateX(4px);
  }
`;

const ProfileLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { path: '/user/profile', label: 'Profile', icon: <UserOutlined /> },
    { path: '/user/my-channels', label: 'My Channels', icon: <VideoCameraOutlined /> },
    { path: '/user/transactions', label: 'My Deals', icon: <TransactionOutlined /> },
    { path: '/user/orders', label: 'Orders', icon: <ShoppingOutlined /> },
  ];

  const SidebarContent = () => (
    <>
      <NavList>
        {navLinks.map((link) => (
          <NavItem 
            key={link.path} 
            to={link.path}
            onClick={() => setDrawerVisible(false)}
          >
            {link.icon}
            {link.label}
          </NavItem>
        ))}
      </NavList>
      <LogoutButton onClick={handleLogout}>
        <LogoutOutlined />
        Logout
      </LogoutButton>
    </>
  );

  return (
    <LayoutContainer>
      {/* Mobile Top Navigation */}
      <MobileTopNav>
        {navLinks.map((link) => (
          <MobileNavItem key={link.path} to={link.path}>
            {link.icon}
            {link.label}
          </MobileNavItem>
        ))}
      </MobileTopNav>

      {/* Desktop Sidebar */}
      <Sidebar>
        <SidebarContent />
      </Sidebar>

      {/* Main Content */}
      <ContentArea>
        {children}
      </ContentArea>
    </LayoutContainer>
  );
};

export default ProfileLayout;
