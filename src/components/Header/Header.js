import { Navbar, NavDropdown, Container, Nav } from "react-bootstrap";
import PClogo from "../../images/pc-logo.png";
import "./Header.css";
import React from "react";
import { useState } from "react";

export default function Header() {
  const [color, setColor] = useState(false);
  const changeColor = () => {
    if (window.scrollY >= 90) {
      setColor(true);
    } else {
      setColor(false);
    }
  };
  window.addEventListener("scroll", changeColor);
  return (
    <Navbar
      className={
        color
          ? "navbar navbar-expand-lg navbar-light sticky-top"
          : "navbar navbar-expand-lg navbar-dark sticky-top"
      }
      expand="lg"
      bg={color ? "white" : ""}
      // bg="light"
      // variant="light"
    >
      <Container>
        <Navbar.Brand className="logoname" href="/">
          <img
            height="80"
            width="80"
            className="site-logo"
            alt="processchamp"
            src={PClogo}
          ></img>
          ProcessChamp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className="headeroption fs-5 fw-light" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="headeroption fs-5 fw-light" href="/about">
              About
            </Nav.Link>
            <NavDropdown
              title={
                <span className="headeroption fs-5 fw-light">
                  Products & Services
                </span>
              }
              id="products-dropdown"
            >
              <NavDropdown.Item href="/geosetai">Geoset AI</NavDropdown.Item>
              <NavDropdown.Item href="/geofitai">Geofit AI</NavDropdown.Item>
              <NavDropdown.Item href="/geoinspectai">
                Geoinspect AI
              </NavDropdown.Item>
              <NavDropdown.Item href="/geopredictai">
                Geopredict AI
              </NavDropdown.Item>
              <NavDropdown.Item href="/engineering-services">
                Engineering Services
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link className="headeroption fs-5 fw-light" href="/contact">
              Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
