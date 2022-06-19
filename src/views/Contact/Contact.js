import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Contact.css";
import { Form, Button } from "react-bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

export default function Contact() {
  return (
    <div
      className="shadow-strong"
      style={{
        background:
          "radial-gradient(circle, rgba(2,0,36,0.6909357492997199) 12%, rgba(11,56,102,1) 46%, rgba(2,0,36,1) 87%)",
      }}
    >
      <div>
        <Header />
      </div>
      <div className="contactContainer shadow mt-5 mb-5">
        <div className="title">
          <h1>How Can We Help?</h1>
          <p>
            Send us a message to book a demo, reach out for questions or
            anything else we can help with and one of our admins will get back
            to you within 3-5 business days!
          </p>
        </div>
        <div className="form">
          <Form>
            <div className="row">
              <Form.Group className="col-sm-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" />
              </Form.Group>
              <Form.Group className="col-sm-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" />
              </Form.Group>
              <Form.Group className="col-sm-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
            </div>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Please type your inquiry in as much detail as possible so we can best assist you."
              />
            </Form.Group>
            <br></br>
            <Button variant="primary" href="/thank-you" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
