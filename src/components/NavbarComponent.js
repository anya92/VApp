import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { firebaseApp } from '../firebase';

const NavbarComponent = (props) => {
  const signOut = () => {
    firebaseApp.auth().signOut();
  };

  const { user } = props;
  return (
    <div>
      <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
          <LinkContainer to="/">
            <Navbar.Brand>
              VApp
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/top">
              <NavItem eventKey={1}>Popularne</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem eventKey={2}>O projekcie</NavItem>
            </LinkContainer>
          </Nav>
          
            {
              user 
              ? (
                  <Nav pullRight>
                    <NavDropdown eventKey={1} title={user.displayName || user.email} id="basic-nav-dropdown">
                      <LinkContainer to="/profil">
                        <MenuItem eventKey={1.1}>Twój profil</MenuItem>
                      </LinkContainer>
                      <LinkContainer to='/ustawienia'>
                        <MenuItem eventKey={1.2}>Ustawienia</MenuItem>
                      </LinkContainer>
                      <LinkContainer to='/ulubione'>
                        <MenuItem eventKey={1.3}>Ulubione</MenuItem>
                      </LinkContainer>
                      <MenuItem divider />
                      <MenuItem eventKey={1.4} onClick={() => signOut()}>Wyloguj się</MenuItem>
                    </NavDropdown>
                    <LinkContainer to="/dodaj" className="special">
                      <NavItem eventKey={2}>Dodaj</NavItem>
                    </LinkContainer>
                  </Nav>
                )
              : (
                  <Nav pullRight>
                    <LinkContainer to="/login">
                      <NavItem eventKey={1}>Zaloguj się</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/signup" className="special">
                      <NavItem eventKey={1}>Zarejestruj się</NavItem>
                    </LinkContainer>
                  </Nav>
                )
            }
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
