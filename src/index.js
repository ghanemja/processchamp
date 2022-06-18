import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./views/About/About";
// import ThankYou from "./views/ThankYou/ThankYou";
import Geoset from "./views/Geoset/Geoset";
import Geofit from "./views/Geofit/Geofit";
import Geoinspect from "./views/Geoinspect/Geoinspect";
import Geopredict from "./views/Geopredict/Geopredict";
import EngineeringServices from "./views/EngineeringServices/EngineeringServices";
import Contact from "./views/Contact/Contact";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/geosetai" element={<Geoset />} />
      <Route path="/geofitai" element={<Geofit />} />
      <Route path="/geoinspectai" element={<Geoinspect />} />
      <Route path="/geopredictai" element={<Geopredict />} />
      <Route path="/engineering-services" element={<EngineeringServices />} />
      <Route path="/contact" element={<Contact />} />
      {/* <Route path="/thank-you" element={<ThankYou />} /> */}
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
