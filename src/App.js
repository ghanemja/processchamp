import "./App.css";
import Home from "./views/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <div>
        <Header />
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default App;
