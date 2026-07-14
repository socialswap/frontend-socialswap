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

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 5rem;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileSidebarHeader = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    display: flex;
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
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: rgba(124, 58, 237, 0.05);
    color: var(--purple-primary);
  }

  &.active {
    background: rgba(124, 58, 237, 0.1);
    color: var(--purple-primary);
    font-weight: 600;
    border-left: 4px solid var(--purple-primary);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #ef4444;
  font-weight: 500;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  margin-top: 1rem;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
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
    { path: '/profile', label: 'Profile', icon: <UserOutlined /> },
    { path: '/my-channels', label: 'My Channels', icon: <VideoCameraOutlined /> },
    { path: '/transactions', label: 'My Deals', icon: <TransactionOutlined /> },
    { path: '/orders', label: 'Orders', icon: <ShoppingOutlined /> },
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
      {/* Mobile Drawer Trigger */}
      <MobileSidebarHeader>
        <h2 className="text-xl font-bold text-text-primary">
          {navLinks.find(link => link.path === location.pathname)?.label || 'Dashboard'}
        </h2>
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          onClick={() => setDrawerVisible(true)} 
          style={{ color: 'var(--text-primary)' }}
        />
      </MobileSidebarHeader>

      {/* Desktop Sidebar */}
      <Sidebar>
        <SidebarContent />
      </Sidebar>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
        styles={{ body: { padding: '1rem' } }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Content */}
      <ContentArea>
        {children}
      </ContentArea>
    </LayoutContainer>
  );
};

export default ProfileLayout;
