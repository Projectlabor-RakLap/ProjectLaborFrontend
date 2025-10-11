import React from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from './PillNav';
import logo from '../../../logo.png';

function PillNavFull() {
  const location = useLocation(); // <- ez adja az aktuális URL-t, pl. "/warehouse"

  return (
    <PillNav
      logo={logo}
      logoAlt="Company Logo"
      items={[
        { label: 'Home', href: '/' },
        { label: 'Warehouse', href: '/warehouse' },
        { label: 'Stock Change', href: '/stock-change' },
        { label: 'Products', href: '/products' },
        { label: 'Statistics', href: '/statistics' },
        { label: 'Admin', href: '/admin' },
        { label: 'Profile', href: '/profile' }
      ]}
      activeHref={location.pathname} // <- dinamikusan az aktuális útvonal
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="#000000"
      pillColor="#ffffff"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#000000"
    />
  );
}

export default PillNavFull;
