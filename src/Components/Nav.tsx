import React from 'react';
import { Link } from 'react-router-dom'; 

const Nav: React.FC = () => {
  return (
    <>
      <nav className='nav'>
        <Link to="/" className="nav-btn">Home</Link>
        <Link to="/history" className="nav-btn">History</Link>
      </nav>
    </>
  );
};

export default Nav;
