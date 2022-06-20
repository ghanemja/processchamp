import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Geoset.css";
import Fade from "react-reveal/Fade";
import { Button } from "react-bootstrap";
import Patent from "../../images/patent.png";
import Software from "../../images/software.png";

export default function Geoset() {
  return (
    <div>
      <Header />
      <hr></hr>
      <div className="container">
        <h1 className="slide-up display-2">What is Geoset AI?</h1>
        <div className="row">
          <Fade>
            <div className="col pl-2">
              <h1
                className="display-6 shadow"
                style={{ backgroundColor: "#eeee", borderRadius: "2rem" }}
              >
                Patented
                <img
                  src={Patent}
                  height="70rem"
                  width="70rem"
                  alt="patent"
                ></img>
              </h1>
            </div>
          </Fade>
          <Fade>
            <div className="col">
              <h1
                className="display-6 shadow"
                style={{ backgroundColor: "#eeee", borderRadius: "2rem" }}
              >
                Flagship software solution
                <img
                  src={Software}
                  height="70rem"
                  width="70rem"
                  alt="software"
                ></img>
              </h1>
            </div>
          </Fade>
        </div>
        <p className="defaultText">
          Geoset AI consists of priority-based intelligent math algorithms
          supported by integrated systems and hardware for smart fixture tooling
          and robotic guidance.
        </p>
        <hr></hr>
        <h1 className="slide-up display-2">What are the applications?</h1>
        <div className="row">
          <Fade>
            <div className="col">
              <h1 className="display-6">Fixtureless Manufacturing</h1>
            </div>
          </Fade>
          <Fade>
            <div className="col">
              <h1 className="display-6">Adaptive Tooling</h1>
            </div>
          </Fade>
        </div>
        <div className="row">
          <h1>From...</h1>
          <Fade>
            <div className="col">
              <h1 className="display-6">
                Building a better body in white, to...
              </h1>
            </div>
          </Fade>
          <Fade>
            <div className="col">
              <h1 className="display-6">Automating on a shoestring budget</h1>
            </div>
          </Fade>
        </div>
        <p className="defaultText">
          Geoset AI consists of priority-based intelligent math algorithms
          supported by integrated systems and hardware for smart fixture tooling
          and robotic guidance.
        </p>
        <hr></hr>
        <h1 className="slide-up display-2">How it works...</h1>
        <div className="row">
          <Fade>
            <div className="col">
              <p className="defaultText">
                3D vision system inspects incoming parts...
              </p>
            </div>
          </Fade>
          <Fade>
            <div className="col">
              <p className="defaultText">
                then computes a robot solution to assemble components that
                achieve critical dimensions
              </p>
            </div>
          </Fade>
        </div>
        <br></br>
        <div className="row">
          <div className="col pr-0 mr-0 w-auto">
            <Button
              style={{ backgroundColor: "white", width: "auto" }}
              className="demo bg-light round border btn-lg"
              href="/contact"
            >
              <p style={{ color: "white" }} className="fs-3 demo-button">
                Contact Us
              </p>
            </Button>
          </div>
          <div className="col pl-0 ml-0">
            <p className="pl-0 ml-0 defaultText">
              to work with our experts and find the best solution for your needs
              by replacing rigid fixtures with adaptive automation.
            </p>
          </div>
        </div>
        <hr></hr>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
