import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductFeatures from './pages/ProductFeatures';
import Header from './components/Header';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';
import './styles/globle.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<ProductFeatures />} />
           
        </Routes>
        <Footer /> 
      </div>
       <AudioPlayer />
    </Router>
  );
}

export default App;