import React from 'react';
import './navbar.css'
import Logo from '../../assets/images/stackline_logo.svg';

const navbar = () => 
<nav className="uk-navbar-container" uk-navbar="">
    <div className="uk-navbar-left">
        <img className="uk-navbar-item" width="100%" alt="stackline logo" src={Logo}/>
    </div>
</nav>

export default navbar;