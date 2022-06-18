import homevideo from "../../images/web-banner.mp4";
import Robot from "../../images/robot1.png";
import video1 from "../../images/video1.mp4";
import "./Home.css";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slide from "react-reveal/Slide";
import Roll from "react-reveal/Roll";
import "animate.css/animate.min.css";

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
        <h1 id="intro-message" className="slide-up">
          Autonomous, AI-driven Manufacturing Like the World Has Never Seen
        </h1>
        <video autoPlay loop muted id="video">
          <source src={homevideo} type="video/mp4" />
        </video>
      </div>
      <div id="benefits">
        <p className="titletext pb-5">
          We create modular smart work cells with factory mobility without the
          need for skilled labor, resulting in...
        </p>
        <Slide right when={true} appear={true}>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon size="3x" icon={faScrewdriverWrench} />
              </div>
              <div className="col-6">
                <p className="p-2 fs-3">Fixtureless Tooling</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide left>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon size="3x" icon={faMaximize} />
              </div>
              <div className="col-6">
                <p className="p-2 fs-3">High Degree of Flexibility</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide right>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon size="3x" icon={faPersonArrowDownToLine} />
              </div>
              <div className="col-6">
                <p className="p-2 fs-3">
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
                <FontAwesomeIcon size="3x" icon={faStopwatch} />
              </div>
              <div className="col-6">
                <p className="p-2 fs-3">Reduction in Set-Up Time</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide right>
          <div className="benefit-item">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon size="3x" icon={faFileCircleCheck} />
              </div>
              <div className="col-6">
                <p className="p-2 fs-3">Measureable Quality Improvement</p>
              </div>
            </div>
          </div>
        </Slide>
        <Slide left>
          <div className="benefit-item slide-right">
            <div className="row">
              <div className="col-3">
                <FontAwesomeIcon size="3x" icon={faHandHoldingDollar} />
              </div>
              <div className="col-6">
                <p className="p-2 fs-3">
                  Reduction in Capital Expenditures and Operating Costs
                </p>
              </div>
            </div>
          </div>
        </Slide>
      </div>
      <div className="products">
        <p className="fw-1 fs-1 text-light pt-5 mt-5">Products</p>
        <div className="row icons">
          <div className="col-sm-4">
            <Roll bottom>
              <div className="benefit-item">
                <img className="benefit-image" src={Robot} alt="Robot"></img>
                <p>Geoset AI</p>
              </div>
            </Roll>
            <br></br>
            <Roll bottom>
              <div className="benefit-item">
                <img className="benefit-image" src={Robot} alt="Robot"></img>
                <p>Geofit AI</p>
              </div>
            </Roll>
          </div>
          <div className="col-sm-4">
            <Roll bottom>
              <div className="benefit-item">
                <img className="benefit-image" src={Robot} alt="Robot"></img>
                <p>Geoinspect AI</p>
              </div>
            </Roll>
            <br></br>
            <Roll bottom>
              <div className="benefit-item">
                <img className="benefit-image" src={Robot} alt="Robot"></img>
                <p>Geopredict AI</p>
              </div>
            </Roll>
          </div>
          <div className="col-sm-4">
            <Roll bottom>
              <div className="benefit-item">
                <img className="benefit-image" src={Robot} alt="Robot"></img>
                <p>Engineering Services</p>
              </div>
            </Roll>
            <br></br>
            <Roll bottom>
              <div className="benefit-item">
                <img className="benefit-image" src={Robot} alt="Robot"></img>
                <p>Zinas</p>
              </div>
            </Roll>
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
              <video autoPlay loop muted className="videoPlay">
                <source src={video1} type="video/mp4" />
              </video>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <p className="fw-light fs-1 ms-auto">
                2. Proprietary AI Analyzes Sensor Data and Instructs Robot
              </p>
            </Accordion.Header>
            <Accordion.Body className="p-0">
              <video autoPlay loop muted className="videoPlay">
                <source src={video1} type="video/mp4" />
              </video>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <p className="fw-light fs-1 ms-auto">
                3. Optimizes Positions to the Critical Datums
              </p>
            </Accordion.Header>
            <Accordion.Body className="p-0">
              <video autoPlay loop muted className="videoPlay">
                <source src={video1} type="video/mp4" />
              </video>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}
