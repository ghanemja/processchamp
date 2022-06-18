import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
// import RobotImage from "../images/robot.jpg";
import "./About.css";
import Fade from "react-reveal/Fade";

export default function About() {
  return (
    <div>
      <Header />
      <div className="aboutContainer">
        {/* <img className="aboutImage" src={RobotImage} alt="robot"></img> */}
        <div className="aboutText">
          <Fade bottom cascade spy={true} appear={true}>
            <div className="textBlock">
              <h2 className="defaultText">Our Company</h2>
              <p className="defaultText">
                ProcessChamp was founded in 2016 to advance manufacturing and
                workforce effectiveness using AI-enabled manufacturing. As a
                tech startup subsidiary of established industrial services
                company, Atlas Industrial Contractors, it uses its heritage of
                over 65 years’ experience supporting industry across North
                America provide smarter automation solutions for Industry 4.0.
                With locations in Ohio and Michigan, the company also has access
                to Atlas’s other multiple locations throughout North America.
                ProcessChamp is developing a portfolio of AI software solutions
                for positional alignment, machinery guidance, autonomous
                inspection and quality reporting, predictive failure analysis,
                and digital twin process optimization. ProcessChamp’s software
                solutions are hardware agnostic and are designed to integrate
                with all commercial system components such as robotic
                arms/controllers, end of arm grippers, servo-controlled tooling,
                3D vision systems, and programmable logic controllers.
              </p>
            </div>
            <div className="textBlock">
              <h2 className="defaultText">Our capabilities</h2>
              <p className="defaultText">
                We are a one-of-a-kind technology startup focused on the
                combination of AI technology, vision systems, and robotics for
                real-time, predictive, and adaptive machine guidance in
                manufacturing. We aim to shift manufacturing's traditional focus
                from relying on hardware to instead look towards
                software-oriented solutions. Our ~1 second per cycle, adaptive,
                and patented technology has a wide variety of applications such
                as:
              </p>
              <ul className="aboutList">
                <li>Automated part inspection</li>
                <li>Sheet metal joining</li>
                <li>Fixtureless robotic/HGV assembly</li>
                <li>Model mix adaptive tooling</li>
                <li>Tailor Welded Blanks</li>
                <li>Closed loop manufacturing</li>
                <li>Robot guidance</li>
                <li>Large scale photogrammetry</li>
              </ul>
              <p className="defaultText">
                Our unique ability to eliminate the need for dedicated hardware
                tooling and set product geometry in real-time allows for
                increased flexibility, less variation, and reduction of O/H
                costs by $100s of millions/year that only we can provide. Join
                us in changing the industry!
              </p>
            </div>
            <div className="textBlock">
              <h2 className="defaultText">Our Mission</h2>
              <p className="defaultText">We love Zinas</p>
            </div>
          </Fade>
        </div>
      </div>
      <Footer />
    </div>
  );
}
