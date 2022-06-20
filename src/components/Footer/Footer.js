import "./Footer.css";
import linkedin from "../../images/linkedin.jpg";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/fontawesome-free-brands";

export default function Footer() {
  return (
    <footer className="text-center text-lg-start bg-light text-muted">
      <section className="d-flex justify-content-center p-4 border-bottom">
        <div className="linkedin">
          <span>Click to get connected with us: </span>
          <a href="https://www.linkedin.com/company/processchamp/">
            <img
              height="30rem"
              width="30rem"
              src={linkedin}
              alt="linkedin"
            ></img>
          </a>
        </div>

        <Button
          style={{ backgroundColor: "#0b3866" }}
          className="demo ml-2 bg-light round border"
          href="/contact"
        >
          Book A Demo!
        </Button>
      </section>

      <section className="">
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3" style={{ textAlign: "center" }}>
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <i className="fas fa-gem me-3"></i>ProcessChamp
              </h6>
              <p></p>
            </div>

            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Products</h6>
              <p>
                <a href="/geosetai" className="text-reset">
                  Geoset AI
                </a>
              </p>
              <p>
                <a href="/geofitai" className="text-reset">
                  Geofit AI
                </a>
              </p>
              <p>
                <a href="geoinspectai" className="text-reset">
                  Geoinspect AI
                </a>
              </p>
              <p>
                <a href="geopredictai" className="text-reset">
                  Geopredict AI
                </a>
              </p>
              <p>
                <a href="engineering-services" className="text-reset">
                  Engineering Services
                </a>
              </p>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              <p>
                <a href="#!" className="text-reset">
                  Pricing
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Settings
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Orders
                </a>
              </p>
              <p>
                <a href="#!" className="text-reset">
                  Help
                </a>
              </p>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p className="contact-text">
                <i className="fas fa-home me-3"></i> Ohio, US
              </p>
              <p className="contact-text">
                <i className="fas fa-home me-3"></i> Michigan, US
              </p>
              <p className="contact-text">
                <i className="fas fa-envelope me-3"></i>
                admin@processchamp.com
              </p>
              <p className="contact-text">
                <i className="fas fa-phone me-3"></i> +01 614-778-7035
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center p-4">
        © 2021 Copyright | All Rights Reserved
      </div>
    </footer>
  );
}
