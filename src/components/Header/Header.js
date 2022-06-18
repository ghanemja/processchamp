import { Navbar, NavDropdown, Container, Nav } from "react-bootstrap";
import PClogo from "../../images/pc-logo.png";
import "./Header.css";

export default function Header() {
  return (
    <Navbar
      className="navbar navbar-expand-lg navbar-dark shadow-5-strong"
      expand="lg"
      // bg="light"
      // variant="light"
    >
      <Container>
        <Navbar.Brand className="text-light logoname" href="/">
          <img className="site-logo" alt="processchamp" src={PClogo}></img>
          ProcessChamp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              className="text-light headeroption fs-5 fw-light"
              href="/"
            >
              Home
            </Nav.Link>
            <Nav.Link
              className="text-light headeroption fs-5 fw-light"
              href="/about"
            >
              About
            </Nav.Link>
            <NavDropdown
              title={
                <span className="text-light headeroption fs-5 fw-light">
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
            <Nav.Link
              className="text-light headeroption fs-5 fw-light"
              href="/contact"
            >
              Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
