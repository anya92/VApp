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
            <NavItem eventKey={2} href="#">Link</NavItem>
            {/*<NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <LinkContainer to="/somewhere">
                <MenuItem eventKey={3.3}>Separated link</MenuItem>
                
              </LinkContainer>
            </NavDropdown>*/}
          </Nav>
          
            {
              user 
              ? (
                  <Nav pullRight>
                    <NavDropdown eventKey={1} title={user.displayName || user.email} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <MenuItem eventKey={1.1}>MÓJ PROFIL</MenuItem>
                      </LinkContainer>
                      <MenuItem eventKey={1.2}>Another action</MenuItem>
                      <MenuItem eventKey={1.3}>Something else here</MenuItem>
                      <MenuItem divider />
                      <MenuItem eventKey={1.3} onClick={() => signOut()}>WYLOGUJ SIĘ</MenuItem>
                    </NavDropdown>
                    <LinkContainer to="/add"  className="special">
                      <NavItem eventKey={2}>DODAJ</NavItem>
                    </LinkContainer>
                  </Nav>
                )
              : (
                  <Nav pullRight>
                    <LinkContainer to="/login">
                      <NavItem eventKey={1}>Zaloguj się</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/signup">
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
