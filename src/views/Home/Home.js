// import homevideo from "../../images/home.mp4";
// import video1 from "../../images/home.mp4";
import "./Home.css";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";
import { Button } from "react-bootstrap";
import "animate.css/animate.min.css";
// import VisibilitySensor from "react-visibility-sensor";

import {
  faFileCircleCheck,
  faHandHoldingDollar,
  faMaximize,
  faPersonArrowDownToLine,
  faScrewdriverWrench,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <>
      <div className="video-section">
        {/* <VisibilitySensor partialVisibility offset={{ bottom: 100 }}>
          {({ isVisible }) => (
            <div style={{ height: 100, width: "auto" }}>
              {isVisible ? ( */}
        <h1 id="intro-message" className="slide-up">
          Autonomous, AI-driven Manufacturing Like the World Has Never Seen
        </h1>
        {/* ) : null} */}
      </div>
      {/* )}
        </VisibilitySensor>{" "} */}
      {/* <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
          {({ isVisible }) => (
            <div
              style={{
                height: 100,
                width: 600,
                fontSize: "5rem",
                color: "white",
              }}
            >
              {isVisible ? (
                <div style={{}}>
                  {" "}
                  <CountUp end={12} duration={3} />{" "}
                  <p className="text-white fs-2">
                    patents granted and pending in the US and Europe - and
                    counting
                  </p>{" "}
                </div>
              ) : null}
            </div>
          )}
        </VisibilitySensor>{" "} */}
      {/* <video autoPlay loop muted id="video">
          <source src={homevideo} type="video/mp4" />
        </video> */}
      {/* </div> */}
      <div id="benefits">
        <p className="titletext pb-5 pl-1 pr-1">
          We create modular smart work cells with factory mobility without the
          need for skilled labor, resulting in...
        </p>
        {/* <VisibilitySensor partialVisibility offset={{ bottom: 100 }}>
          {({ isVisible }) => (
            <div style={{ height: "500", width: "2000" }}>
              {isVisible ? (
                <div> */}
        <Slide right when={true} appear={true}>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon
                  className="icon"
                  size="3x"
                  icon={faScrewdriverWrench}
                />
              </div>
              <div className="col-6">
                <p className="benefit p-2">Fixtureless Tooling</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide left>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon className="icon" size="3x" icon={faMaximize} />
              </div>
              <div className="col-6">
                <p className="benefit p-2">High Degree of Flexibility</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide right>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon
                  className="icon"
                  size="3x"
                  icon={faPersonArrowDownToLine}
                />
              </div>
              <div className="col-6">
                <p className="benefit p-2">
                  Significant Reduction in Skilled Labor
                </p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide left>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon
                  className="icon"
                  size="3x"
                  icon={faStopwatch}
                />
              </div>
              <div className="col-6">
                <p className="benefit p-2">Reduction in Set-Up Time</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide right>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon
                  className="icon"
                  size="3x"
                  icon={faFileCircleCheck}
                />
              </div>
              <div className="col-6">
                <p className="benefit p-2">Measureable Quality Improvement</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide left>
          <div className="benefit-item slide-right">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon
                  className="icon"
                  size="3x"
                  icon={faHandHoldingDollar}
                />
              </div>
              <div className="col-6">
                <p className="benefit p-2">
                  Reduction in Capital Expenditures and Operating Costs
                </p>
              </div>
            </div>
          </div>
        </Slide>
      </div>
      {/* ) : null}
            </div>
          )}
        </VisibilitySensor>{" "} */}
      {/* </div> */}
      <div className="products">
        <p className="fw-1 fs-1 text-light pt-5" style={{ color: "black" }}>
          Products
        </p>
        <div className="row icons">
          <div className="col-sm-4">
            <Fade>
              <div className="product-item">
                {/* <img className="benefit-image" src={Robot} alt="Robot"></img> */}
                <p>
                  <a
                    className="geo-product"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    href="/geosetai"
                  >
                    Geoset AI
                  </a>
                </p>
              </div>
            </Fade>
            <br></br>
            <Fade>
              <div className="product-item">
                {/* <img className="benefit-image" src={Robot} alt="Robot"></img> */}
                <p>
                  <a
                    className="geo-product"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    href="/geofitai"
                  >
                    Geofit AI
                  </a>
                </p>
              </div>
            </Fade>
          </div>
          <div className="col-sm-4">
            <Fade>
              <div className="product-item">
                {/* <img className="benefit-image" src={Robot} alt="Robot"></img> */}
                <p>
                  <a
                    className="geo-product"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    href="/geoinspectai"
                  >
                    Geoinspect AI
                  </a>
                </p>
              </div>
            </Fade>
            <br></br>
            <Fade>
              <div className="product-item">
                {/* <img className="benefit-image" src={Robot} alt="Robot"></img> */}
                <p>
                  <a
                    className="geo-product"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    href="/geopredictai"
                  >
                    Geopredict AI
                  </a>
                </p>
              </div>
            </Fade>
          </div>
          <div className="col-sm-4">
            <Fade>
              <div className="product-item">
                {/* <img className="benefit-image" src={Robot} alt="Robot"></img> */}
                <p>
                  <a
                    className="geo-product"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    href="/engineering-services"
                  >
                    Engineering Services
                  </a>
                </p>{" "}
              </div>
            </Fade>
            <br></br>
            <Fade>
              <div className="product-item">
                {/* <img className="benefit-image" src={Robot} alt="Robot"></img> */}
                <p>
                  <a
                    className="geo-product"
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    href="/geofitai"
                  >
                    Zinas
                  </a>
                </p>
              </div>
            </Fade>
          </div>
        </div>
      </div>
      <div className="methods h-auto">
        <p className="fw-1 fs-1">How Do We Do It?</p>
        <br></br>
        <p className="fs-1 pb-4">3 simple steps...</p>
        <Accordion className=".bg-light p-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <p className="fw-light fs-1 ms-auto">1. Scan Critical Datums</p>
            </Accordion.Header>
            <Accordion.Body className="p-0">
              <p>insert smart words here</p>
              {/* <video autoPlay loop muted className="videoPlay">
                <source src={video1} type="video/mp4" />
              </video> */}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <p className="fw-light fs-1 ms-auto">
                2. Proprietary AI Analyzes Sensor Data and Instructs Robot
              </p>
            </Accordion.Header>
            <Accordion.Body className="p-0">
              <p>insert smart words here</p>

              {/* <video autoPlay loop muted className="videoPlay">
                <source src={video1} type="video/mp4" />
              </video> */}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <p className="fw-light fs-1 ms-auto">
                3. Optimizes Positions to the Critical Datums
              </p>
            </Accordion.Header>
            <Accordion.Body className="p-0">
              <p>insert smart words here</p>

              {/* <video autoPlay loop muted className="videoPlay">
                <source src={video1} type="video/mp4" />
              </video> */}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="demo">
        <h1 className="demo-title">
          Want to learn more? Contact us and book a demo!
        </h1>
        <Button
          style={{ backgroundColor: "white" }}
          className="demo ml-2 bg-light round border btn-lg"
          href="/contact"
        >
          <p style={{ color: "white" }} className="fs-3 demo-button">
            Book A Demo!
          </p>
        </Button>
      </div>
    </>
  );
}
