import { Link } from 'react-router-dom';
import '../styles/globle.css';

const Header = () => {
  return (
    <header>
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="/" />
          <span className="logo-text">SamanTree</span>
        </Link>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;